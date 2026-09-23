import { Text, View, StyleSheet } from "react-native";
import { typeColors, identity, spacing, radius, typography } from "@/theme";
import { TEXTES } from "@/constants/texts";
import { majuscule } from "@/utils/texte";
import type { PokemonType } from "@/types/pokemon";

export function BadgesTypes({ types }: { types: PokemonType[] }) {
  return (
    <View style={styles.badges}>
      {types.map((type) => (
        <View
          key={type}
          accessible
          style={[styles.badge, { backgroundColor: typeColors[type] }]}
          accessibilityLabel={`${TEXTES.type} ${type}`}
        >
          <Text style={styles.texte}>{majuscule(type)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pilule,
  },
  texte: {
    ...typography.subtitle3,
    color: identity.texteSurCouleur,
  },
});
