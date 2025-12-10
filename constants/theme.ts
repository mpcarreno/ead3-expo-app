/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#229ef0ff';
const tintColorDark = '#13699eff';

export const Colors = {
  light: {
    text: '#4e4e4eff',
    background: '#fff',
    selectionBackground: '#e7f1feff',
    boxBackground: '#f4f4f4ff',
    greenBackground: '#e0ecdcff',
    green: '#42c830ff',
    boxText: '#aaaaaaff',
    
    redBackground: '#ecc8c8ff',
    red: '#ce3a3aff',
    yellowBackground: '#fcf4d0ff',
    yellow: '#d6c804ff',

    boxBorder: '#c8c8c8ff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    selectionBackground: '#293036ff',
    boxBackground: '#373737ff',
    greenBackground: '#3a4234ff',
    green: '#54983eff',
    redBackground: '#6d4343ff',
    red: '#a32b2bff',
    yellowBackground: '#706a41ff',
    yellow: '#d3b926ff',


    boxBorder: '#424242ff',
    boxText: '#adb2b6ff',
    tint: tintColorDark,
    icon: '#adb2b6ff',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
