/**
 * Dual-variant Expo config.
 *
 *   EXPO_PUBLIC_VARIANT=v1 (default) → /SecondLeaf/
 *   EXPO_PUBLIC_VARIANT=v2          → /SecondLeaf/v2/
 *
 * Keeps v1 deploying unchanged while letting v2 ride alongside it.
 */

module.exports = () => {
  const variant = process.env.EXPO_PUBLIC_VARIANT === 'v2' ? 'v2' : 'v1';
  const baseUrl = variant === 'v2' ? '/SecondLeaf/v2' : '/SecondLeaf';
  const splashBg = variant === 'v2' ? '#FFFFFF' : '#F4F7F1';
  const androidBg = variant === 'v2' ? '#2ECC71' : '#2E7D4F';

  return {
    expo: {
      name: 'Second Leaf',
      slug: 'secondleaf',
      scheme: 'secondleaf',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: splashBg,
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'uk.co.secondleaf.app',
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: androidBg,
        },
        package: 'uk.co.secondleaf.app',
      },
      web: {
        favicon: './assets/favicon.png',
        bundler: 'metro',
      },
      plugins: [],
      experiments: {
        baseUrl,
      },
      extra: {
        tagline: 'Give plants a second home.',
        variant,
      },
    },
  };
};
