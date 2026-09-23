import { Image } from "expo-image";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { identity, spacing, typography } from "@/theme";
import { TEXTES } from "@/constants/texts";
import { majuscule, numeroPokedex } from "@/utils/texte";

type EnteteDetailProps = {
  nom: string;
  id: number;
};

export function EnteteDetail({ nom, id }: EnteteDetailProps) {
  return (
    <View style={styles.entete}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={TEXTES.retourListe}
      >
        <Image
          source={require("@/assets/arrow_back.svg")}
          style={styles.fleche}
          contentFit="contain"
        />
      </Pressable>

      <Text style={styles.nom}>{majuscule(nom)}</Text>
      <Text style={styles.numero}>{numeroPokedex(id)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entete: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  fleche: {
    width: 24,
    height: 24,
  },
  nom: {
    ...typography.headline,
    flex: 1, // prend l'espace restant, ce qui pousse le numéro tout à droite
    color: identity.texteSurCouleur,
  },
  numero: {
    ...typography.subtitle1,
    color: identity.texteSurCouleur,
  },
});
