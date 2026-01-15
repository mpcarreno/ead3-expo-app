import ParallaxScrollView from '@/components/parallax-scroll-view';
import Button from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#edeaeaff', dark: '#5e5e5e2b' }}
      headerImage={
        <Image
          source={require('@/assets/images/smile-wave-owl.png')}
          style={styles.reactLogo}
        />
      }>
      
      <ThemedView style={styles.textContainer}>
        <ThemedText type="title" style={{fontSize: 20}}> ¿Qué deseas hacer? </ThemedText>
      </ThemedView>
  
      
      
        <ThemedView style={styles.buttonContainer}>
          <Button 
            width={280}
            icon="person.crop.circle.badge.plus" 
            label="Registrar Paciente"
            path="/userCreation"/>
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <Button 
          width={280}
          icon="document.badge.plus" 
          label="Comenzar Evaluación"
          path="/(session)/userSelection"/>
        </ThemedView>
      
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 140,
    width: 200,
    bottom: 0,
    left: '25%',
    position: 'absolute',
  },

});
