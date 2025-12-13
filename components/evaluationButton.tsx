import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from "@expo/vector-icons";

import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";


export type EvaluationButtonProps = {
    lightColor?: string;
    darkColor?: string;
    title: string;
    status: "No Iniciado" | "Completado";
    onPress: () => void;
};

export default function EvaluationButton({
    lightColor,
    darkColor,
    title,
    status,
    onPress,
}: EvaluationButtonProps) {

    const completedBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'selectionBackground')
    const completedBorder = useThemeColor({ light: lightColor, dark: darkColor }, 'tint')
    const noBackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const boxBorder = useThemeColor({ light: lightColor, dark: darkColor }, 'boxBorder')
    const icon = useThemeColor({ light: lightColor, dark: darkColor }, 'icon')
    const isCompleted = status === "Completado";

    return (
        <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.button,
            {
            backgroundColor: isCompleted ?  completedBackground: noBackColor,
            borderColor: isCompleted ? completedBorder: boxBorder,
            opacity: pressed ? 0.7 : 1,
            },
        ]}
        >
        <View style={styles.textContainer}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText>Estado: <ThemedText style={[styles.status, isCompleted && [styles.completedStatus, {color: completedBorder}]]}>
             {status}
            </ThemedText></ThemedText>
        </View>

        {/* 🔥 ICONO DINÁMICO */}
        {isCompleted ? (
            <Ionicons name="checkmark-circle" size={30} color={completedBorder} />
        ) : (
            <Ionicons name="chevron-forward" size={30} color={icon} />
        )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        overflow: "hidden",
  },
    textContainer: {
        flexDirection: "column",
  },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 5
  },
    status: {
        marginTop: 4,
        fontSize: 16,
        color: "#666",
  },
    completedStatus: {
        
        fontSize: 16,
        fontWeight: "bold",
  },
});
