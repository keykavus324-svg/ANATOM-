import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_ICON = path.join(ROOT, 'public/brand/pwa-512.png');
const RES_DIR = path.join(ROOT, 'android/app/src/main/res');
const BG_COLOR = '#0F3E37';

function runConvert(args) {
  execFileSync('convert', args, { stdio: 'inherit' });
}

// 1. Launcher icons for every density (legacy square, round, and adaptive foreground)
const MIPMAPS = [
  { dir: 'mipmap-mdpi', icon: 48, fg: 108 },
  { dir: 'mipmap-hdpi', icon: 72, fg: 162 },
  { dir: 'mipmap-xhdpi', icon: 96, fg: 216 },
  { dir: 'mipmap-xxhdpi', icon: 144, fg: 324 },
  { dir: 'mipmap-xxxhdpi', icon: 192, fg: 432 },
];

for (const { dir, icon, fg } of MIPMAPS) {
  const outDir = path.join(RES_DIR, dir);
  mkdirSync(outDir, { recursive: true });

  // Standard launcher icon
  runConvert([
    SRC_ICON,
    '-resize', `${icon}x${icon}`,
    '-strip',
    path.join(outDir, 'ic_launcher.png'),
  ]);

  // Round launcher icon (circular alpha mask)
  const half = icon / 2;
  runConvert([
    SRC_ICON,
    '-resize', `${icon}x${icon}`,
    '(', '+clone', '-alpha', 'extract',
      '-draw', `fill black polygon 0,0 0,${icon} ${icon},${icon} ${icon},0 fill white circle ${half},${half} ${half},0`,
      '-blur', '0x0.5',
    ')',
    '-alpha', 'off',
    '-compose', 'CopyOpacity',
    '-composite',
    '-strip',
    path.join(outDir, 'ic_launcher_round.png'),
  ]);

  // Adaptive icon foreground: place artwork inside the 66% safe zone on transparent canvas
  const safeSize = Math.round(fg * 0.68);
  runConvert([
    '-size', `${fg}x${fg}`, 'xc:none',
    '(', SRC_ICON, '-fuzz', '10%', '-transparent', BG_COLOR, '-resize', `${safeSize}x${safeSize}`, ')',
    '-gravity', 'center',
    '-compose', 'Over',
    '-composite',
    '-strip',
    path.join(outDir, 'ic_launcher_foreground.png'),
  ]);
}

// 2. Splash screens (portrait, landscape, and default fallback)
const SPLASHES = [
  { dir: 'drawable', w: 1080, h: 1920 },
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
];

for (const { dir, w, h } of SPLASHES) {
  const outDir = path.join(RES_DIR, dir);
  mkdirSync(outDir, { recursive: true });
  const emblem = Math.round(Math.min(w, h) * 0.42);
  runConvert([
    '-size', `${w}x${h}`, `xc:${BG_COLOR}`,
    '(', SRC_ICON, '-resize', `${emblem}x${emblem}`, ')',
    '-gravity', 'center',
    '-composite',
    '-strip',
    path.join(outDir, 'splash.png'),
  ]);
}

// 3. Brand colors & launcher background
const valuesDir = path.join(RES_DIR, 'values');
mkdirSync(valuesDir, { recursive: true });

writeFileSync(
  path.join(valuesDir, 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${BG_COLOR}</color>
</resources>
`,
);

writeFileSync(
  path.join(valuesDir, 'colors.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#0F3E37</color>
    <color name="colorPrimaryDark">#0A2B26</color>
    <color name="colorAccent">#AE5952</color>
    <color name="splashBackground">#0F3E37</color>
</resources>
`,
);

writeFileSync(
  path.join(valuesDir, 'styles.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>

    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:background">@null</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/splashBackground</item>
        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
        <item name="android:background">@drawable/splash</item>
    </style>
</resources>
`,
);

console.log('Generated Android icons, splash screens, colors, and themes.');
