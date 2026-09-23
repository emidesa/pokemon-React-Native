import type { ViewStyle } from "react-native";

export const ombres = {
  // Figma "Drop Shadow / 2 dp" : offset (0,1), radius 3, spread 1.
  // React Native n'a pas de spread : compensé en portant le radius à 4.
  dp2: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
} satisfies Record<string, ViewStyle>;
