import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { Chargement, Erreur } from "@/components/Etats";
import { BarreStat } from "@/components/BarreStat";
import { typeColors, grayscale, spacing, radius, typography } from "@/theme";
import { TEXTES } from "@/constants/texts";

function majuscule(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1);
}

export default function DetailPokemon() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = usePokemonDetail(id);
  const [sensAnimation, setSensAnimation] = useState<"push" | "pop">("push");
  const [cibleNavigation, setCibleNavigation] = useState<number | null>(null);

  const echelle = useSharedValue(0.8);
  const flottement = useSharedValue(0);

  // Navigation déclenchée par effet et non directement dans allerVers() :
  // animationTypeForReplace est une option d'écran lue au rendu, elle doit donc être à
  // jour AVANT que la navigation parte
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

  function allerVers(nouvelId: number) {
    setSensAnimation(nouvelId < Number(id) ? "pop" : "push");
    setCibleNavigation(nouvelId);
  }

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: couleurPrincipale }]}
      contentContainerStyle={styles.contenuScroll}
    >
      <Stack.Screen options={{ animationTypeForReplace: sensAnimation }} />

      <Image
        source={require("@/assets/BackgroundPokeball.svg")}
        style={styles.filigrane}
        contentFit="contain"
        accessible={false}
      />

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

        <Text style={styles.nomHeader}>{majuscule(data.nom)}</Text>

        <Text style={styles.numeroHeader}>#{String(data.id).padStart(3, "0")}</Text>
      </View>

      <View style={styles.corps}>
        <View style={styles.carte}>
          <View style={styles.badges}>
            {data.types.map((type) => (
              <View
                key={type}
                style={[styles.badge, { backgroundColor: typeColors[type] }]}
                accessibilityLabel={`${TEXTES.type} ${type}`}
              >
                <Text style={styles.badgeTexte}>{majuscule(type)}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitre, { color: couleurPrincipale }]}>{TEXTES.about}</Text>

          <View style={styles.about}>
            <View style={styles.aboutItem}>
              <View style={styles.aboutMesure}>
                <Image
                  source={require("@/assets/weight.svg")}
                  style={styles.aboutIcone}
                  contentFit="contain"
                />
                <Text style={styles.aboutValeur}>
                  {data.poidsKg} {TEXTES.uniteKg}
                </Text>
              </View>
              <Text style={styles.aboutLabel}>{TEXTES.poids}</Text>
            </View>

            <View style={styles.separateurVertical} />

            <View style={styles.aboutItem}>
              <View style={styles.aboutMesure}>
                <Image
                  source={require("@/assets/straighten.svg")}
                  style={styles.aboutIcone}
                  contentFit="contain"
                />
                <Text style={styles.aboutValeur}>
                  {data.tailleM} {TEXTES.uniteM}
                </Text>
              </View>
              <Text style={styles.aboutLabel}>{TEXTES.taille}</Text>
            </View>

            <View style={styles.separateurVertical} />

            <View style={styles.aboutItem}>
              <Text style={styles.aboutValeur}>{data.talents.map(majuscule).join("\n")}</Text>
              <Text style={styles.aboutLabel}>{TEXTES.talents}</Text>
            </View>
          </View>

          {data.description ? <Text style={styles.description}>{data.description}</Text> : null}

          <Text style={[styles.sectionTitre, { color: couleurPrincipale }]}>
            {TEXTES.statistiquesBase}
          </Text>

          {data.stats.map((stat) => (
            <View key={stat.nom} style={styles.statLigne}>
              <Text style={[styles.statNom, { color: couleurPrincipale }]}>{stat.nom}</Text>

              <View style={styles.separateurVertical} />

              <Text style={styles.statValeur}>{String(stat.valeur).padStart(3, "0")}</Text>

              <BarreStat valeur={stat.valeur} couleur={couleurPrincipale} />
            </View>
          ))}
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

// Valeurs relevées sur la maquette Figma (écran 360×640) : la carte blanche démarre à
// y=226 et l'image se termine à y=263, d'où un chevauchement d'environ 40px
const HAUTEUR_IMAGE = 180;
const CHEVAUCHEMENT = 40;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  contenuScroll: {
    // Sans flexGrow, le contenu s'arrête à sa hauteur naturelle et la couleur de fond
    // réapparaît sous la carte blanche quand le Pokémon a peu de texte
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
    padding: spacing.xs,
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
  nomHeader: {
    ...typography.headline,
    flex: 1, // prend l'espace restant, ce qui pousse le numéro tout à droite
    color: grayscale.white,
  },
  numeroHeader: {
    ...typography.subtitle1,
    color: grayscale.white,
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
    backgroundColor: grayscale.white,
    borderRadius: radius.sm,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    paddingTop: CHEVAUCHEMENT + spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
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
  badgeTexte: {
    ...typography.subtitle3,
    color: grayscale.white,
  },
  sectionTitre: {
    ...typography.subtitle1,
    textAlign: "center",
  },
  about: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  aboutItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
  aboutMesure: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  aboutIcone: {
    width: 12,
    height: 12,
  },
  aboutValeur: {
    ...typography.body3,
    color: grayscale.dark,
    textAlign: "center",
  },
  aboutLabel: {
    ...typography.caption,
    color: grayscale.medium,
  },
  separateurVertical: {
    alignSelf: "stretch", // épouse la hauteur de ses voisins, pas de hauteur à maintenir
    width: 1,
    backgroundColor: grayscale.light,
  },
  description: {
    ...typography.body1,
    color: grayscale.dark,
  },
  statLigne: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statNom: {
    ...typography.subtitle3,
    width: 32,
    textAlign: "right",
  },
  statValeur: {
    ...typography.body3,
    color: grayscale.dark,
  },
});
