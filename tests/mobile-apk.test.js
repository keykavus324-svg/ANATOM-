import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  APK_DOWNLOAD_URL,
  APK_RELEASES_URL,
  getNativePlatform,
  hideNativeSplash,
  isNativeApp,
  registerAndroidBackButton,
  syncNativeTheme,
  triggerHaptic,
} from '../src/nativeBridge.js';

test('capacitor configuration defines the Android app id, branding and native plugins', () => {
  const cfg = JSON.parse(readFileSync(new URL('../capacitor.config.json', import.meta.url), 'utf8'));
  assert.equal(cfg.appId, 'tr.anatomi.atlas');
  assert.equal(cfg.appName, 'ANATOMİ');
  assert.equal(cfg.webDir, 'dist');
  assert.equal(cfg.server?.androidScheme, 'https');
  assert.equal(cfg.plugins?.SplashScreen?.backgroundColor, '#0F3E37');
  assert.equal(cfg.plugins?.StatusBar?.overlaysWebView, false);
});

test('android native project ships adaptive icons, splash screens and release signing hooks', () => {
  const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
  assert.match(manifest, /android:hardwareAccelerated="true"/);
  assert.match(manifest, /android:supportsRtl="true"/);

  const gradle = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
  assert.match(gradle, /applicationId "tr\.anatomi\.atlas"/);
  assert.match(gradle, /ANDROID_KEYSTORE_PATH/);
  assert.match(gradle, /enableV2Signing true/);

  for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    for (const file of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
      assert.ok(
        existsSync(new URL(`../android/app/src/main/res/mipmap-${density}/${file}`, import.meta.url)),
        `missing mipmap-${density}/${file}`,
      );
    }
  }
  assert.ok(existsSync(new URL('../android/app/src/main/res/drawable/splash.png', import.meta.url)));
});

test('native bridge safely falls back on web and exposes valid APK release URLs', async () => {
  assert.equal(isNativeApp(), false);
  assert.equal(getNativePlatform(), 'web');
  assert.match(APK_DOWNLOAD_URL, /^https:\/\/github\.com\/keykavus324-svg\/ANATOM-\/releases\/latest\/download\/ANATOMI\.apk$/);
  assert.match(APK_RELEASES_URL, /^https:\/\/github\.com\/keykavus324-svg\/ANATOM-\/releases\/latest$/);

  await syncNativeTheme('dark');
  await syncNativeTheme('light');
  await hideNativeSplash();
  await triggerHaptic('light');
  const cleanup = registerAndroidBackButton({ current: null });
  assert.equal(typeof cleanup, 'function');
  cleanup();
});

test('GitHub Actions workflow builds, signs and publishes the downloadable APK release', () => {
  const workflow = readFileSync(new URL('../.github/workflows/build-android-apk.yml', import.meta.url), 'utf8');
  assert.match(workflow, /npm run build:mobile/);
  assert.match(workflow, /assembleRelease/);
  assert.match(workflow, /ANATOMI\.apk/);
  assert.match(workflow, /gh release (create|upload)/);
});
