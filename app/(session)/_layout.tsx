import { SelectedUserProvider } from "@/scripts/selectedUserContext";
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
            <Stack.Screen name="evaluationDashboard" options={{ headerShown: false , title:'Userpage'}} />
            <Stack.Screen name="applyEvaluation" options={{ title: 'Evaluation' }} />

        </Stack>
        <StatusBar style="auto" />
        </ThemeProvider>
    </SelectedUserProvider>
  );
}
