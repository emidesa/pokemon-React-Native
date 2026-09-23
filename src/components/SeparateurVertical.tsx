import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme";

export function SeparateurVertical() {
  const { couleurs } = useTheme();

  return <View style={[styles.trait, { backgroundColor: couleurs.bordure }]} />;
}

const styles = StyleSheet.create({
  trait: {
    alignSelf: "stretch", // épouse la hauteur de ses voisins, pas de hauteur à maintenir
    width: 1,
  },
});
