// app/(session)/_layout.tsx
import { SelectedUserProvider } from "@/components/selectedUserContext";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable } from 'react-native';
import 'react-native-reanimated';

export default function UserContextLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const confirmExit = () => {
    Alert.alert(
      'Salir',
      '¿Estás seguro que quieres salir?',
      [
        { text: 'Volver', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => router.replace('/') },
      ]
    );
  };

  const headerRightButton = () => (
    <Pressable onPress={confirmExit} style={{ marginRight: 15 }}>
      <Feather name="x" size={24} color= {Colors[colorScheme ?? 'light'].icon} />
    </Pressable>
  );


  const quickExit = () => {
    router.replace('/'); // index
  };

  const headerLeftButton = () => (
    <Pressable onPress={quickExit} style={{ marginHorizontal: 10 }}>
      <Feather name="arrow-left" size={24} color= {Colors[colorScheme ?? 'light'].icon} />
    </Pressable>
  );

  return (
    <SelectedUserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen 
              name="userCreation" 
              options={{ 
                headerShown: true , 
                title:'Creacion de Usuario',
                headerLeft: headerLeftButton
                }} 
              /> 

            <Stack.Screen 
              name="userSelection" 
              options={{ 
                headerShown: true , 
                title:'Seleccion de Usuario',
                headerLeft: headerLeftButton
                }} />  

            <Stack.Screen
              name="evaluationDashboard"
              options={{
                headerShown: true,
                title: 'Evaluación',
                headerRight: headerRightButton
              }}
            />

            <Stack.Screen
              name="evaluationApply"
              options={{
                headerShown: true,
                title: 'Preguntas',
                headerRight: headerRightButton
              }}
            />   

            <Stack.Screen
              name="evaluationReport"
              options={{
                headerShown: true,
                title: 'Preguntas',
                headerRight: headerRightButton
              }}
            />             

        </Stack>
        <StatusBar style="auto" />
        </ThemeProvider>
    </SelectedUserProvider>
  );
}
