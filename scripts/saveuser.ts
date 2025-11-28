
import { calculateAgeRange } from "@/utils/calculate-userdata";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveUser(userData: any) {
  const { uid, uidType, name, lastName, dob } = userData;

  const ageAtCreation = calculateAgeRange(dob);
  console.log(ageAtCreation)

  if (!ageAtCreation.validUser) {
    return { success: false, error: "La edad del paciente no es válida" };
  }

  try {
    // Validate if user already exists based on user id
    const existingUser = await AsyncStorage.getItem(`user_${uid}`);
    if (existingUser) {
      return { success: false, error: "El número de identificación ya está registrado" };
    }

    const newUser = {
      uidType,
      uid,
      name,
      lastName,
      dob,
      ageAtCreation,
    };

    await AsyncStorage.setItem(`user_${uid}`, JSON.stringify(newUser));

    // Save user list
    const allUIDs = await AsyncStorage.getItem("user_ids");
    const uidArray: string[] = allUIDs ? JSON.parse(allUIDs) : [];
    uidArray.push(uid);
    await AsyncStorage.setItem("user_ids", JSON.stringify(uidArray));

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false, error: "No se pudo crear el usuario" };
  }
}
