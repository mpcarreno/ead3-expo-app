import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from "expo-router";
import { DimensionValue, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  label: string;
  path?: any | null;
  icon?: any | null;
  onPress?: () => void | Promise<void>;

  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  padding?: number;
  iconSize?: number;
  style?: ViewStyle;
};

export default function Button({
  label,
  path,
  icon,
  onPress,
  width = '100%' as DimensionValue,
  height = 65 as DimensionValue,
  backgroundColor = '#2596B5',
  textColor = '#ffffffff',
  fontSize = 19,
  borderRadius = 10,
  padding = 20,
  iconSize = 40,
  style,

}: Props) {

  const router = useRouter();

  const handlePress = async () => {
    if (onPress) await onPress();
    if (path) router.push(path);
  };

  const contentJustify = icon ? "flex-start" : "center";
  const textAlign = icon ? "left" : "center";

  return (
    <View style={[styles.buttonContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          {
            width,
            height,
            backgroundColor,
            borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: contentJustify,   
            paddingHorizontal: 12,
          },
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
      >
        {icon && (
          <IconSymbol
            name={icon}
            size={iconSize}
            color={textColor}
            style={{ marginRight: 10 }}
          />
        )}

        <Text
          style={[
            styles.buttonLabel,
            { color: textColor, fontSize, textAlign },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4c4c4c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
