// app/(session)/_layout.tsx
import { SelectedUserProvider } from "@/components/selectedUserContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';


export default function UserContextLayout() {
  const colorScheme = useColorScheme();

  return (
    <SelectedUserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen name="userCreation" options={{ headerShown: true , title:'Creacion de Usuario'}} /> 
            <Stack.Screen name="userSelection" options={{ headerShown: true , title:'Seleccion de Usuario'}} />  
            <Stack.Screen name="evaluationDashboard" options={{ headerShown: true , title:'Evaluacion'}} />
            <Stack.Screen name="evaluationApply" options={{ headerShown: true , title:'Preguntas'}} />               

        </Stack>
        <StatusBar style="auto" />
        </ThemeProvider>
    </SelectedUserProvider>
  );
}
