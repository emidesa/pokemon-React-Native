import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";
import { grayscale, spacing, radius, typography, ombres } from "@/theme";

type PokemonCardProps = {
  id: number;
  nom: string;
  spriteUrl: string;
};

export function PokemonCard({ id, nom, spriteUrl }: PokemonCardProps) {
  return (
    // Deux View imbriquées : overflow "hidden" (pour couper la bande grise aux coins
    // arrondis) rognerait l'ombre s'ils étaient sur le même élément
    <View style={styles.ombre}>
      <View style={styles.carte}>
        <Text style={styles.numero}>#{String(id).padStart(3, "0")}</Text>

        <View style={styles.bandeNom}>
          <Text style={styles.nom} numberOfLines={1}>
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
    backgroundColor: grayscale.white,
  },
  carte: {
    aspectRatio: 104 / 108, // proportions de la maquette, sans figer une taille en pixels
    justifyContent: "space-between",
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  numero: {
    ...typography.caption,
    color: grayscale.medium,
    textAlign: "right",
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  bandeNom: {
    backgroundColor: grayscale.background,
    borderRadius: 7,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  nom: {
    ...typography.body3,
    color: grayscale.dark,
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
