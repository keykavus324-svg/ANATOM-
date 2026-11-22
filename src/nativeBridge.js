import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const APK_DOWNLOAD_URL =
  'https://github.com/keykavus324-svg/ANATOM-/releases/latest/download/ANATOMI.apk';
export const APK_RELEASES_URL =
  'https://github.com/keykavus324-svg/ANATOM-/releases/latest';

export function isNativeApp() {
  try {
    return Boolean(Capacitor?.isNativePlatform?.());
  } catch {
    return false;
  }
}

export function getNativePlatform() {
  try {
    return Capacitor?.getPlatform?.() || 'web';
  } catch {
    return 'web';
  }
}

export async function syncNativeTheme(theme) {
  if (!isNativeApp()) return;
  try {
    const isDark = theme === 'dark';
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    if (getNativePlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: isDark ? '#101c1c' : '#f8f7f3' });
    }
  } catch {
    // StatusBar styling is best-effort across Android API levels.
  }
}

export async function hideNativeSplash() {
  if (!isNativeApp()) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 280 });
  } catch {
    // Splash screen may already have auto-hidden.
  }
}

export async function triggerHaptic(kind = 'light') {
  if (!isNativeApp()) return;
  try {
    if (kind === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (kind === 'medium') {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {
    // Haptics may be disabled by the device battery saver.
  }
}

export function registerAndroidBackButton(handlersRef) {
  if (!isNativeApp() || getNativePlatform() !== 'android') return () => {};
  let lastBackPress = 0;
  let listenerHandle = null;
  let disposed = false;

  CapApp.addListener('backButton', ({ canGoBack }) => {
    const handlers = handlersRef.current;
    if (!handlers) return;

    if (handlers.hasOverlay()) {
      handlers.closeOverlay();
      return;
    }

    if (!handlers.isHome()) {
      if (canGoBack) {
        window.history.back();
      } else {
        handlers.goHome();
      }
      return;
    }

    const now = Date.now();
    if (now - lastBackPress < 2200) {
      CapApp.exitApp();
    } else {
      lastBackPress = now;
      handlers.showExitHint();
    }
  })
    .then(handle => {
      if (disposed) {
        handle.remove().catch(() => {});
      } else {
        listenerHandle = handle;
      }
    })
    .catch(() => {});

  return () => {
    disposed = true;
    listenerHandle?.remove?.().catch(() => {});
  };
}
