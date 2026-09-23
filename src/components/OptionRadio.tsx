import { Text, View, StyleSheet, Pressable } from "react-native";
import { identity, spacing, typography, useTheme } from "@/theme";

type OptionRadioProps = {
  label: string;
  selectionne: boolean;
  onPress: () => void;
};

export function OptionRadio({ label, selectionne, onPress }: OptionRadioProps) {
  const { couleurs } = useTheme();

  return (
    <Pressable
      style={styles.option}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: selectionne }}
      accessibilityLabel={label}
    >
      <View style={styles.exterieur}>{selectionne && <View style={styles.interieur} />}</View>
      <Text style={[styles.texte, { color: couleurs.texte }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  exterieur: {
    width: 16,
    height: 16,
    borderRadius: 8, // moitié de la taille = cercle parfait
    borderWidth: 1.5,
    borderColor: identity.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  interieur: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: identity.primary,
  },
  texte: {
    ...typography.body2,
  },
});
