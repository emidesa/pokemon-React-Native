import type { TextStyle } from "react-native";

// Échelle reprise du Style Guide Figma (Headline, Subtitle 1-3, Body 1-3, Caption)
export const typography = {
  titre: { fontSize: 32, lineHeight: 40, fontWeight: "bold" },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: "bold" },
  subtitle1: { fontSize: 14, lineHeight: 16, fontWeight: "bold" },
  subtitle2: { fontSize: 12, lineHeight: 16, fontWeight: "bold" },
  subtitle3: { fontSize: 10, lineHeight: 16, fontWeight: "bold" },
  body1: { fontSize: 14, lineHeight: 20 },
  body2: { fontSize: 12, lineHeight: 16 },
  body3: { fontSize: 10, lineHeight: 16 },
  caption: { fontSize: 8, lineHeight: 12 },
  // "satisfies" vérifie que chaque entrée est un style de texte valide (une faute de
  // frappe sur fontWeight serait refusée) tout en gardant les noms pour l'autocomplétion
} satisfies Record<string, TextStyle>;
