//components/evaluationResultItem.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

export type EvaluationResultsProps = {
    lightColor?: string;
    darkColor?: string;
    title: string;
    result: "Satisfactorio" | "Riesgo de Problema" | "Sospecha de Problema";
    pd: number;
    pt: number;
    answers: {
        questionId: number;
        question: string;
        answer: boolean;
    }[];
};

export default function ResultItem({
    lightColor,
    darkColor,
    title,
    result,
    pd,
    pt,
    answers,
}: EvaluationResultsProps) {

    

    const redBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'redBackground');
    const red = useThemeColor({ light: lightColor, dark: darkColor }, 'red');

    const yellowBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'yellowBackground');
    const yellow = useThemeColor({ light: lightColor, dark: darkColor }, 'yellow');

    const greenBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'greenBackground');
    const green = useThemeColor({ light: lightColor, dark: darkColor }, 'green');

    const colorMap = {
        "Satisfactorio": {
            bg: greenBackground,
            border: green,
            text: "El paciente cumple con el desarrollo esperado para su edad",
            icon: "happy-outline" as const,
        },
        "Riesgo de Problema": {
            bg: yellowBackground,
            border: yellow,
            text: "El paciente no cumple con el desarrollo esperado para su edad, riesgo de problema en el desarrollo",
            icon: "alert-circle-outline" as const,
        },
        "Sospecha de Problema": {
            bg: redBackground,
            border: red,
            text: "El paciente no cumple con el desarrollo esperado para su edad, sospecha de problema en el desarrollo",
            icon: "sad-outline" as const,
        },
    } as const;

    const { bg: backgroundColor, border: Color, text: textDetails, icon: iconName } = colorMap[result];
    const [expanded, setExpanded] = useState(true);

    return (
        <Pressable onPress={() => setExpanded(!expanded)} style={[styles.button, { backgroundColor: backgroundColor, borderColor: Color }]}>
            
            <View style={styles.content}>
                <Ionicons name={iconName} size={30} color={Color} />
                <View style={styles.textContainer}>
                    <ThemedText style={styles.title}>{title}</ThemedText>
                    <ThemedText style={styles.status}>Resultado: <ThemedText style={{color: Color}}>{result}</ThemedText></ThemedText>
                    <ThemedText style={styles.textDetails}>{textDetails}</ThemedText>
                    
                </View>
            </View>
            {expanded && (
            <View style={styles.extraContent}>
                
                <ThemedText style={styles.status}>Items aplicados</ThemedText>
                {answers.map((item) => (
                    <ThemedText style={styles.textDetails} key={item.questionId}>
                    {item.questionId}. {item.question}{" "}
                    {item.answer ? <Ionicons name='checkmark-circle-outline' size={16} color={green} />
                                : <Ionicons name='close-circle-outline' size={16} color={red} />}
                    </ThemedText>
                ))}
                <ThemedText style={styles.status}>Puntaje </ThemedText>
                <ThemedText style={[styles.textDetails, {fontWeight: '400'}]}>Puntuacion Directa: <ThemedText style={[styles.textDetails, {fontWeight: '300'}]}>{pd} </ThemedText></ThemedText>
                <ThemedText style={[styles.textDetails, {fontWeight: '400'}]}>Puntuacion Tipica: <ThemedText style={[styles.textDetails, {fontWeight: '300'}]}>{pt} </ThemedText></ThemedText>
                
                
            </View>
            )}
        </Pressable>
    );

}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 10,
        flexDirection: 'column', 
        flexShrink: 1,
        flexWrap: "wrap", 
    },
    content: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 8,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,

    },
    score: {
        flexDirection: 'row',
        gap: 10,
    },
    textContainer: {
        flexShrink: 1,
        flexDirection: "column",
    },
    textDetails: {
        fontSize: 15,
        lineHeight: 18,
        flexShrink: 1,
        flexWrap: "wrap",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
    },
    status: {
        marginVertical: 5,
        fontSize: 16,
        fontWeight: "600",
    },
    extraContent: {
    flexDirection: "column",
    gap: 5,
    alignItems: "flex-start",
    overflow: "hidden",
    marginHorizontal: 10,
    padding: 5,
},
extraTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
},
extraItem: {
    fontSize: 14,
    marginBottom: 4,
},
buttonAction: {
    marginTop: 10,
    backgroundColor: "#333",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
},

});
