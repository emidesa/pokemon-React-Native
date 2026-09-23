import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { identity, grayscale, spacing, typography } from "@/theme";
import { TEXTES } from "@/constants/texts";

export function Chargement({ message }: { message: string }) {
  return (
    <View style={styles.centre}>
      <ActivityIndicator size="large" color={identity.primary} />
      <Text style={styles.texte}>{message}</Text>
    </View>
  );
}

export function Erreur({ message }: { message: string }) {
  return (
    <View style={styles.centre}>
      <Text style={styles.erreur}>
        {TEXTES.erreurPrefixe}
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  texte: {
    ...typography.body1,
    color: grayscale.medium,
  },
  erreur: {
    ...typography.subtitle1,
    color: identity.primary,
    textAlign: "center",
  },
});
