// app/userCreation.tsx
import DateSection from "@/components/date-input";
import Spacer from "@/components/spacer";
import Button from "@/components/themed-button";
import ThemedCheckBox from "@/components/themed-checkbox";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-textinput";
import { ThemedView } from "@/components/themed-view";
import { saveUser } from "@/utils/saveuser";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

export default function UserCreation() {
  
  // Constants
  const [uidType, setUidType] = useState<string | null>(null);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [gestationalAge, setGestationalAge] = useState("");
  const [isPremature, setIsPremature] = useState<string | null>(null);

  // Errors
  const [uidError, setUidError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dayError, setDayError] = useState(false);
  const [monthError, setMonthError] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [gestAgeError, setGestAgeError] = useState(false);
  const [uidTypeError, setUidTypeError] = useState(false);
  const [isPrematureError, setIsPrematureError] = useState(false);

  const uidOptions = ["MS", "RC", "TI"];
  const IsPrematureOptions = ["Si", "No"];

  const isValidDate = (y: string, m: string, d: string) => {
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return (
      date.getFullYear() === Number(y) &&
      date.getMonth() === Number(m) - 1 &&
      date.getDate() === Number(d)
    );
  };

  const validateForm = () => {
    let hasError = false;

    if (!uidType) { setUidTypeError(true); hasError = true; }
    if (!uid) { setUidError(true); hasError = true; }
    if (!name) { setNameError(true); hasError = true; }
    if (!lastName) { setLastNameError(true); hasError = true; }

    if (!day) { setDayError(true); hasError = true; }
    if (!month) { setMonthError(true); hasError = true; }
    if (!year) { setYearError(true); hasError = true; }

    if (!isPremature) { setIsPrematureError(true); hasError = true; }

    if (isPremature === "Si" && (!gestationalAge || Number(gestationalAge) > 36)) {
      setGestAgeError(true);
      hasError = true;
    }

    if (!hasError && !isValidDate(year, month, day)) {
      setDayError(true);
      setMonthError(true);
      setYearError(true);
      Alert.alert("Error", "La fecha de nacimiento no es válida");
      return true; // return error
    }

    return hasError;
  };

  const onSave = async () => {
    const error = validateForm();
    if (error) return;

    const dob = {
      day: Number(day),
      month: Number(month),
      year: Number(year),
      isPremature: isPremature!,
      gestationalAge: isPremature === "Si" ? Number(gestationalAge) : 0,
    };

    const response = await saveUser({
      uid,
      uidType,
      name,
      lastName,
      dob
    });

    if (!response.success) {
      Alert.alert("Error", response.error);
      return;
    }

    Alert.alert("Éxito", "El usuario ha sido creado exitosamente");

    setTimeout(() => {
      router.replace("/");
    }, 300);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        
        <ScrollView style={{ flex: 1 }}>
          <ThemedView style={styles.container}>
            <ThemedText style={styles.text}>Diligencia todos los campos</ThemedText>
            <Spacer height={20} />

            {/* Identification type selection */}
            <ThemedText style={styles.text}>Tipo de identificación <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText></ThemedText>
            <ThemedView style={styles.checkBoxContainer}>
              {uidOptions.map((o) => (
                <ThemedCheckBox key={o} label={o} value={o} selected={uidType === o} onSelect={setUidType} />
              ))}
            </ThemedView>
            {uidTypeError && <ThemedText style={styles.errorText}>Selecciona una opción</ThemedText>}

            {/* User ID number input */}
            <ThemedText style={styles.text}>Número de identificación <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText></ThemedText>
            <ThemedTextInput
              style={[ uidError && styles.inputError]}
              value={uid}
              placeholder="Ingrese el número de identificación"
              keyboardType="numeric"
              onChangeText={(text) => { setUid(text); setUidError(false); }}
            />

            {/* Name input  */}
            <ThemedText style={styles.text}>Nombre(s) <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText></ThemedText>
            <ThemedTextInput
              style={[ nameError && styles.inputError]}
              value={name}
              placeholder="Ingrese nombre del paciente"
              onChangeText={(t) => { setName(t); setNameError(false); }}
            />

            {/* LastName input */}
            <ThemedText style={styles.text}>Apellido(s) <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText></ThemedText>
            <ThemedTextInput
              style={[lastNameError && styles.inputError]}
              value={lastName}
              placeholder="Ingrese apellidos del paciente"
              onChangeText={(t) => { setLastName(t); setLastNameError(false); }}
            />

            {/* Date of birth input */}
            <ThemedText style={styles.text}>Fecha de nacimiento <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText></ThemedText>
            <DateSection style={styles.dateContainer}
              day={day} setDay={setDay} dayError={dayError}
              month={month} setMonth={setMonth} monthError={monthError}
              year={year} setYear={setYear} yearError={yearError}
            />

            {/* Premature */}
            <ThemedText style={styles.text}>¿Paciente Prematuro? <ThemedText style={{color: '#ff0000ff'}}>*</ThemedText> <ThemedText style={{opacity: 0.8}}>(Menor a 37 semanas)</ThemedText> </ThemedText>
            <ThemedView style={styles.checkBoxContainer}>
              {IsPrematureOptions.map((o) => (
                <ThemedCheckBox key={o} label={o} value={o} selected={isPremature === o} onSelect={setIsPremature} />
              ))}
            </ThemedView>
            {isPrematureError && <ThemedText style={styles.errorText}>Selecciona una opción</ThemedText>}

            {isPremature === "Si" && (
              <ThemedTextInput
                style={[gestAgeError && styles.inputError]}
                value={gestationalAge}
                keyboardType="numeric"
                maxLength={2}
                onChangeText={(t) => {
                  const n = t.replace(/[^0-9]/g, '');
                  if (Number(n) <= 36) {
                    setGestationalAge(n);
                    setGestAgeError(false);
                  }
                }}
                placeholder="Ingrese semanas de gestación (menor a 37)"
              />
            )}

            <Spacer height={20} />

            <Button  label="Crear Usuario" onPress={onSave} />
            
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding:20, marginBottom: 50  },
  text: { marginTop: 10},
  mandatory: { color: "red"},
  inputError: { borderColor: "red", borderWidth: 2 },
  dateContainer: { flexDirection: 'row', gap: 20, alignSelf: 'center' },
  checkBoxContainer: { flexDirection: "row", gap: 40, alignSelf: "center", marginVertical: 10 },
  errorText: { color: "red", alignSelf: "center" }
});
