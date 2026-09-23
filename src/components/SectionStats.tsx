import { Text, View, StyleSheet } from "react-native";
import { BarreStat, VALEUR_MAX } from "./BarreStat";
import { SeparateurVertical } from "./SeparateurVertical";
import { spacing, typography, useTheme } from "@/theme";
import { TEXTES } from "@/constants/texts";
import type { PokemonStat } from "@/types/pokemon";

type SectionStatsProps = {
  stats: PokemonStat[];
  couleur: string;
};

export function SectionStats({ stats, couleur }: SectionStatsProps) {
  const { couleurs } = useTheme();

  return (
    <>
      {stats.map((stat) => (
        <View
          key={stat.nom}
          style={styles.ligne}
          accessible
          accessibilityLabel={`${stat.nom}, ${stat.valeur} ${TEXTES.sur} ${VALEUR_MAX}`}
        >
          <Text style={[styles.nom, { color: couleur }]}>{stat.nom}</Text>

          <SeparateurVertical />

          <Text style={[styles.valeur, { color: couleurs.texte }]}>
            {String(stat.valeur).padStart(3, "0")}
          </Text>

          <BarreStat valeur={stat.valeur} couleur={couleur} />
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nom: {
    ...typography.subtitle3,
    width: 44,
    textAlign: "right",
  },
  valeur: {
    ...typography.body3,
  },
});
