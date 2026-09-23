import type { TextStyle } from "react-native";

export const typography = {
  titre: { fontSize: 34, lineHeight: 44, fontWeight: "bold" },
  headline: { fontSize: 26, lineHeight: 36, fontWeight: "bold" },
  subtitle1: { fontSize: 18, lineHeight: 24, fontWeight: "bold" },
  subtitle2: { fontSize: 16, lineHeight: 24, fontWeight: "bold" },
  subtitle3: { fontSize: 14, lineHeight: 20, fontWeight: "bold" },
  body1: { fontSize: 18, lineHeight: 24 },
  body2: { fontSize: 16, lineHeight: 24 },
  body3: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
} satisfies Record<string, TextStyle>;
