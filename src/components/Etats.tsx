import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { identity, spacing, typography, useTheme } from "@/theme";
import { TEXTES } from "@/constants/texts";

export function Chargement({ message }: { message: string }) {
  const { couleurs } = useTheme();

  return (
    <View style={[styles.centre, { backgroundColor: couleurs.fond }]}>
      <ActivityIndicator size="large" color={identity.primary} />
      <Text style={[styles.texte, { color: couleurs.texteSecondaire }]}>{message}</Text>
    </View>
  );
}

export function Erreur({ message }: { message: string }) {
  const { couleurs } = useTheme();

  return (
    <View style={[styles.centre, { backgroundColor: couleurs.fond }]}>
      <Text style={styles.erreur}>
        {TEXTES.erreurPrefixe}
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  texte: {
    ...typography.body1,
  },
  erreur: {
    ...typography.subtitle1,
    color: identity.primary, // le rouge d'identité ne change pas selon le thème
    textAlign: "center",
  },
});
