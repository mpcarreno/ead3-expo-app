import { useThemeColor } from '@/hooks/use-theme-color';
import React from "react";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

interface SelectableCardProps {
    lightColor?: string;
    darkColor?: string;
    selected?: boolean;
    colors?: "default" | "selectable" | "simple"
    noAction?: boolean;
    onPress?: () => void;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    labelStyle?: TextStyle;
    children?: React.ReactNode;
}

export default function SelectableCard({
    lightColor,
    darkColor,
    colors = 'default',
    selected = false,
    noAction = false,
    onPress,
    containerStyle,
    contentStyle,
    labelStyle,
    children
}: SelectableCardProps) {
    const boxBackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBackground')
    const noBackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const boxBorderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBorder')
    const boxBorderSelectionColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint')
    const selectionBackgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'selectionBackground')

    const colorMap = {
        "default": {
            bg: boxBackColor,
            border: 'transparent',
        },
        "selectable": {
            bg: selectionBackgroundColor,
            border: boxBorderSelectionColor,
        },
        "simple": {
            bg: noBackColor,
            border: boxBorderColor,
        },
    }

    const { bg: backgroundColor, border: Color } = colorMap[colors];
    
    return (
        <Pressable
            onPress={!noAction ? onPress : undefined}
            disabled={noAction}
            style={[
                styles.card, 
                !noAction &&{ 
                    backgroundColor: selected ? selectionBackgroundColor : noBackColor,
                    borderColor: selected ? boxBorderSelectionColor : boxBorderColor,   },
                noAction &&{ 
                    backgroundColor: backgroundColor,
                    borderColor:  Color},
                containerStyle
            ]}
        >
            <View style={ contentStyle}>
                {children}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
    },
});
