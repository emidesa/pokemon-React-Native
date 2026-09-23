import type { PokemonType } from "@/types/pokemon";

export const identity = {
  primary: "#DC0A2D",
  // Le texte posé sur une couleur de marque (bannière rouge, en-tête coloré du détail)
  // reste blanc dans les deux thèmes : ces fonds ne changent pas
  texteSurCouleur: "#FFFFFF",
};

// Noms de RÔLES et non de couleurs : "surface" peut devenir sombre, "white" non.
// C'est ce qui rend le thème possible.
export type Couleurs = {
  fond: string;
  surface: string;
  surfaceAlt: string;
  texte: string;
  texteSecondaire: string;
  bordure: string;
};

export const couleursClaires: Couleurs = {
  fond: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#EFEFEF",
  texte: "#212121",
  texteSecondaire: "#666666",
  bordure: "#E0E0E0",
};

// Le type Couleurs force les deux palettes à avoir exactement les mêmes clés :
// en oublier une en mode sombre devient une erreur de compilation
export const couleursSombres: Couleurs = {
  fond: "#1E1E1E",
  surface: "#2A2A2A",
  surfaceAlt: "#3A3A3A",
  texte: "#FFFFFF",
  texteSecondaire: "#AAAAAA",
  bordure: "#444444",
};

// Texte toujours blanc sur ces couleurs (choix produit) : Bug, Electric, Fairy, Fire,
// Flying, Normal, Grass, Ground, Ice, Psychic, Rock, Steel, Water ne passent pas le
// contraste WCAG AA (4.5:1) avec du texte blanc — vérifié le 2026-09-22, accepté tel quel.
// Record<PokemonType, ...> oblige à définir les 18 types : s'il en manque un, refus de compiler
export const typeColors: Record<PokemonType, string> = {
  bug: "#A7B723",
  dark: "#75574C",
  dragon: "#7037FF",
  electric: "#F9CF30",
  fairy: "#E69EAC",
  fighting: "#C12239",
  fire: "#F57D31",
  flying: "#A891EC",
  ghost: "#70559B",
  normal: "#AAA67F",
  grass: "#74CB48",
  ground: "#DEC16B",
  ice: "#9AD6DF",
  poison: "#A43E9E",
  psychic: "#FB5584",
  rock: "#B69E31",
  steel: "#B7B9D0",
  water: "#6493EB",
};
