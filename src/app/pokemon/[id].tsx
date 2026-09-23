import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useAudioPlayer } from "expo-audio";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { Chargement, Erreur } from "@/components/Etats";
import { EnteteDetail } from "@/components/EnteteDetail";
import { BadgesTypes } from "@/components/BadgesTypes";
import { SectionAbout } from "@/components/SectionAbout";
import { SectionStats } from "@/components/SectionStats";
import { typeColors, spacing, radius, typography, useTheme } from "@/theme";
import { TEXTES } from "@/constants/texts";

// Valeurs relevées sur la maquette Figma (écran 360×640) : la carte blanche démarre à
// y=226 et l'image se termine à y=263, d'où un chevauchement d'environ 40px
const HAUTEUR_IMAGE = 180;
const CHEVAUCHEMENT = 40;

export default function DetailPokemon() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = usePokemonDetail(id);
  const [sensAnimation, setSensAnimation] = useState<"push" | "pop">("push");
  const [cibleNavigation, setCibleNavigation] = useState<number | null>(null);
  const { mode, couleurs } = useTheme();

  const echelle = useSharedValue(0.8);
  const flottement = useSharedValue(0);
  const lecteurCri = useAudioPlayer(null);

  useEffect(() => {
    if (!data) return;
    lecteurCri.replace(data.criUrl);
    lecteurCri.play();
  }, [data, lecteurCri]);

  useEffect(() => {
    if (cibleNavigation !== null) {
      // replace et non push : sinon feuilleter 20 Pokémon empilerait 20 écrans
      router.replace({ pathname: "/pokemon/[id]", params: { id: cibleNavigation } });
    }
  }, [cibleNavigation]);

  useEffect(() => {
    echelle.value = withSpring(1, { damping: 8 }); // apparition avec rebond de ressort
    // -1 = répétition infinie, true = en alternance (aller-retour au lieu d'un saut)
    flottement.value = withRepeat(withTiming(-12, { duration: 1400 }), -1, true);
  }, [echelle, flottement]);

  const styleImage = useAnimatedStyle(() => ({
    transform: [{ scale: echelle.value }, { translateY: flottement.value }],
  }));

  if (loading) {
    return <Chargement message={TEXTES.chargementDetail} />;
  }

  if (error || !data) {
    return <Erreur message={error ?? TEXTES.pokemonIntrouvable} />;
  }

  const couleurPrincipale = typeColors[data.types[0]];
  // En mode sombre, le fond passe au gris foncé : la couleur du type reste uniquement
  // en accent (badges, titres, barres de stats)
  const couleurFond = mode === "sombre" ? couleurs.fond : couleurPrincipale;

  function allerVers(nouvelId: number) {
    setSensAnimation(nouvelId < Number(id) ? "pop" : "push");
    setCibleNavigation(nouvelId);
  }

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: couleurFond }]}
      contentContainerStyle={styles.contenuScroll}
    >
      <Stack.Screen options={{ animationTypeForReplace: sensAnimation }} />

      <Image
        source={require("@/assets/BackgroundPokeball.svg")}
        style={styles.filigrane}
        contentFit="contain"
        accessible={false}
      />

      <EnteteDetail nom={data.nom} id={data.id} />

      <View style={styles.corps}>
        <View style={[styles.carte, { backgroundColor: couleurs.surface }]}>
          <BadgesTypes types={data.types} />

          <Text style={[styles.sectionTitre, { color: couleurPrincipale }]}>{TEXTES.about}</Text>
          <SectionAbout pokemon={data} />

          {data.description ? (
            <Text style={[styles.description, { color: couleurs.texte }]}>{data.description}</Text>
          ) : null}

          <Text style={[styles.sectionTitre, { color: couleurPrincipale }]}>
            {TEXTES.statistiquesBase}
          </Text>
          <SectionStats stats={data.stats} couleur={couleurPrincipale} />
        </View>

        <Animated.View style={[styles.image, styleImage]}>
          <Image
            source={{ uri: data.spriteUrl }}
            style={styles.imageInterieure}
            contentFit="contain"
            accessibilityLabel={`${TEXTES.illustrationDe} ${data.nom}`}
          />
        </Animated.View>

        {data.id > 1 && (
          <Pressable
            style={[styles.chevron, styles.chevronGauche]}
            onPress={() => allerVers(data.id - 1)}
            accessibilityRole="button"
            accessibilityLabel={TEXTES.pokemonPrecedent}
          >
            <Image
              source={require("@/assets/chevron_left.svg")}
              style={styles.chevronIcone}
              contentFit="contain"
            />
          </Pressable>
        )}

        <Pressable
          style={[styles.chevron, styles.chevronDroite]}
          onPress={() => allerVers(data.id + 1)}
          accessibilityRole="button"
          accessibilityLabel={TEXTES.pokemonSuivant}
        >
          <Image
            source={require("@/assets/chevron_right.svg")}
            style={styles.chevronIcone}
            contentFit="contain"
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  contenuScroll: {
    // Sans flexGrow, le contenu s'arrête à sa hauteur naturelle et la couleur de fond
    // réapparaît sous la carte quand le Pokémon a peu de texte
    flexGrow: 1,
  },
  filigrane: {
    position: "absolute",
    // Taille native du SVG et opacité relevée sur la maquette (le fond passe de
    // #74CB48 à (130,208,91) sous le filigrane, soit 10%)
    top: 8,
    right: 7,
    width: 206,
    height: 208,
    opacity: 0.1,
  },
  chevron: {
    position: "absolute",
    top: HAUTEUR_IMAGE / 2 - 12,
    padding: spacing.xs, // agrandit la zone tapable sans agrandir l'icône
  },
  chevronGauche: {
    left: spacing.md,
  },
  chevronDroite: {
    right: spacing.md,
  },
  chevronIcone: {
    width: 24,
    height: 24,
  },
  corps: {
    flex: 1,
    // On réserve moins que la hauteur de l'image : la carte remonte dessous, donc
    // l'image la recouvre partiellement
    paddingTop: HAUTEUR_IMAGE - CHEVAUCHEMENT,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HAUTEUR_IMAGE,
  },
  imageInterieure: {
    width: "100%",
    height: "100%",
  },
  carte: {
    flex: 1,
    borderRadius: radius.sm,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    paddingTop: CHEVAUCHEMENT + spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  sectionTitre: {
    ...typography.subtitle1,
    textAlign: "center",
  },
  description: {
    ...typography.body1,
  },
});
