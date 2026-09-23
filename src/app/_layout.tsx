import { Stack } from "expo-router";

export default function RootLayout() {
  // screenOptions s'applique à TOUS les écrans : on masque le header natif d'Expo Router
  // (qui afficherait "index"), nos deux écrans dessinant leur propre en-tête
  return <Stack screenOptions={{ headerShown: false }} />;
}
