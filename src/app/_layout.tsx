import { Stack } from "expo-router";
import { ThemeProvider } from "@/theme";

export default function RootLayout() {
  // Le ThemeProvider enveloppe toute l'app : c'est ce qui permet à n'importe quel écran
  // d'appeler useTheme() pour connaître le mode en cours
  return (
    <ThemeProvider>
      {/* screenOptions s'applique à TOUS les écrans : on masque le header natif
          d'Expo Router (qui afficherait "index"), nos écrans ayant le leur */}
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
