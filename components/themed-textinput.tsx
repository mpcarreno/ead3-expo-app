import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export type ThemedTextProps = TextInputProps & {
  lightColor?: string
  darkColor?: string
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxText')
    const boxBackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBackground')
    const boxBorderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBorder')
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const [isFocused, setIsFocused] = React.useState(false)

  return (
    <TextInput
      style={[
        {   
            borderColor: isFocused ? boxBorderColor : 'transparent',
            borderWidth: isFocused ? 2 : 0,
            backgroundColor: boxBackColor,
            color:color
        },
        styles.default,
        style,
      ]}
      placeholderTextColor={ textColor }
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    textAlign: 'left',
    fontSize: 16,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
    padding: 15
  },
});
