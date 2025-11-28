
import { ThemedTextInput } from "@/components/themed-textinput";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function DateSection({
  day, setDay, dayError,
  month, setMonth, monthError,
  year, setYear, yearError
}: any) {

    const today = new Date();

    return (
    <ThemedView style={styles.dateContainer}>
      <ThemedTextInput
        style={[styles.input, dayError && styles.error]}
        value={day}
        onChangeText={(t) => {
            const n = t.replace(/[^0-9]/g, '');
            if (Number(n) <= 31) {
                setDay(n);
            }
        }}
        placeholder="DD"
        keyboardType="numeric"
        maxLength={2}
      />

      <ThemedTextInput
        style={[styles.input, monthError && styles.error]}
        value={month}
        onChangeText={(t) => {
            const n = t.replace(/[^0-9]/g, '');
            if (Number(n) <= 12) {
                setMonth(n);
            }
        }}
        placeholder="MM"
        keyboardType="numeric"
        maxLength={2}
      />

      <ThemedTextInput
        style={[styles.yearInput, yearError && styles.error]}
        value={year}
        onChangeText={(t) => {
            const n = t.replace(/[^0-9]/g, '');
            if (Number(n) <= today.getFullYear()) {
                setYear(n);
            }
        }}
        placeholder="AAAA"
        keyboardType="numeric"
        maxLength={4}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dateContainer: { flexDirection: "row", gap: 15, alignSelf: "center" },
  input: { flex: 1, textAlign: "center"},
  yearInput: { flex: 2, textAlign: "center"},
  error: { borderColor: "red", borderWidth: 2 }
});
