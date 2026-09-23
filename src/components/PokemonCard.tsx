import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";
import { spacing, radius, typography, ombres, useTheme } from "@/theme";
import { numeroPokedex } from "@/utils/texte";

type PokemonCardProps = {
  id: number;
  nom: string;
  spriteUrl: string;
};

export function PokemonCard({ id, nom, spriteUrl }: PokemonCardProps) {
  const { couleurs } = useTheme();

  return (
    // Deux View imbriquées : overflow "hidden" (pour couper la bande grise aux coins
    // arrondis) rognerait l'ombre s'ils étaient sur le même élément
    <View style={[styles.ombre, { backgroundColor: couleurs.surface }]}>
      <View style={styles.carte}>
        <Text style={[styles.numero, { color: couleurs.texteSecondaire }]}>
          {numeroPokedex(id)}
        </Text>

        <View style={[styles.bandeNom, { backgroundColor: couleurs.surfaceAlt }]}>
          <Text style={[styles.nom, { color: couleurs.texte }]} numberOfLines={1}>
            {nom}
          </Text>
        </View>

        {/* Déclarée en dernier pour être dessinée par-dessus la bande grise */}
        <Image source={{ uri: spriteUrl }} style={styles.image} contentFit="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ombre: {
    ...ombres.dp2,
    borderRadius: radius.sm,
  },
  carte: {
    aspectRatio: 104 / 108, // proportions de la maquette, sans figer une taille en pixels
    justifyContent: "space-between",
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  numero: {
    ...typography.caption,
    textAlign: "right",
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  bandeNom: {
    borderRadius: 7,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  nom: {
    ...typography.body3,
    textAlign: "center",
  },
  image: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    aspectRatio: 1,
  },
});
