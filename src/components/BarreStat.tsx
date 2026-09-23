import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Maximum théorique d'une stat dans les jeux Pokémon — sert d'échelle à la barre, et de
// repère dans le label lu par VoiceOver
export const VALEUR_MAX = 255;
const DUREE_MS = 800;

type BarreStatProps = {
  valeur: number;
  couleur: string;
};

// Composant séparé et non un bout de JSX dans l'écran : un hook ne peut pas être appelé
// dans une boucle .map(), or chaque barre a besoin de son propre useSharedValue
export function BarreStat({ valeur, couleur }: BarreStatProps) {
  // Valeur partagée avec le thread d'animation natif : l'animation tourne à 60 fps même
  // si le JavaScript est occupé (un useState redessinerait le composant à chaque image)
  const progression = useSharedValue(0);

  useEffect(() => {
    const pourcentage = Math.min(100, (valeur / VALEUR_MAX) * 100);
    progression.value = withTiming(pourcentage, { duration: DUREE_MS });
  }, [valeur, progression]);

  const styleAnime = useAnimatedStyle(() => ({
    width: `${progression.value}%`,
  }));

  // "33" en fin d'hexadécimal = 20% d'opacité : une teinte claire du type, sans avoir à
  // définir une deuxième couleur par type dans le thème
  return (
    <View style={[styles.fond, { backgroundColor: `${couleur}33` }]}>
      <Animated.View style={[styles.barre, styleAnime, { backgroundColor: couleur }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fond: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  barre: {
    height: "100%",
    borderRadius: 2,
  },
});
