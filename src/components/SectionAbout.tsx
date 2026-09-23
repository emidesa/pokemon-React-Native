import { Image, type ImageSource } from "expo-image";
import { Text, View, StyleSheet } from "react-native";
import { SeparateurVertical } from "./SeparateurVertical";
import { spacing, typography, useTheme } from "@/theme";
import { TEXTES } from "@/constants/texts";
import { majuscule } from "@/utils/texte";
import type { PokemonDetail } from "@/types/pokemon";

type AboutItemProps = {
  valeur: string;
  label: string;
  icone?: ImageSource;
};

// Une colonne de la section : la valeur (avec son icône éventuelle) au-dessus du label.
// Regroupée en un seul élément d'accessibilité, sinon VoiceOver lit "6,9 kg" puis "Poids".
function AboutItem({ valeur, label, icone }: AboutItemProps) {
  const { couleurs } = useTheme();

  return (
    <View style={styles.item} accessible accessibilityLabel={`${label} : ${valeur}`}>
      <View style={styles.mesure}>
        {icone && (
          <Image source={icone} style={styles.icone} contentFit="contain" accessible={false} />
        )}
        <Text style={[styles.valeur, { color: couleurs.texte }]}>{valeur}</Text>
      </View>
      <Text style={[styles.label, { color: couleurs.texteSecondaire }]}>{label}</Text>
    </View>
  );
}

export function SectionAbout({ pokemon }: { pokemon: PokemonDetail }) {
  return (
    <View style={styles.section}>
      <AboutItem
        icone={require("@/assets/weight.svg")}
        valeur={`${pokemon.poidsKg} ${TEXTES.uniteKg}`}
        label={TEXTES.poids}
      />

      <SeparateurVertical />

      <AboutItem
        icone={require("@/assets/straighten.svg")}
        valeur={`${pokemon.tailleM} ${TEXTES.uniteM}`}
        label={TEXTES.taille}
      />

      <SeparateurVertical />

      <AboutItem valeur={pokemon.talents.map(majuscule).join("\n")} label={TEXTES.talents} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
  mesure: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icone: {
    width: 12,
    height: 12,
  },
  valeur: {
    ...typography.body3,
    textAlign: "center",
  },
  label: {
    ...typography.caption,
  },
});
