import type { PokemonType } from "@/types/pokemon";

export const identity = {
  primary: "#DC0A2D",
};

export const grayscale = {
  dark: "#212121",
  medium: "#666666",
  light: "#E0E0E0",
  background: "#EFEFEF",
  white: "#FFFFFF",
};

// Texte toujours blanc sur ces couleurs (choix produit) : Bug, Electric, Fairy, Fire,
// Flying, Normal, Grass, Ground, Ice, Psychic, Rock, Steel, Water ne passent pas le
// contraste WCAG AA (4.5:1) avec du texte blanc — vérifié le 2026-09-22, accepté tel quel.
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
