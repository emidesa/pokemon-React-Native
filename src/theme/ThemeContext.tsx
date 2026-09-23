import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { couleursClaires, couleursSombres, type Couleurs } from "./colors";

export type ModeTheme = "clair" | "sombre";

const CLE_STOCKAGE = "theme";

type ValeurContexte = {
  mode: ModeTheme;
  couleurs: Couleurs;
  changerMode: (mode: ModeTheme) => void;
};

const ThemeContext = createContext<ValeurContexte | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Thème du téléphone : sert uniquement de valeur de départ, avant tout choix de l'utilisateur
  const themeSysteme = useColorScheme();
  const [mode, setMode] = useState<ModeTheme>(themeSysteme === "dark" ? "sombre" : "clair");

  // Au démarrage, un choix déjà enregistré l'emporte sur le thème du téléphone
  useEffect(() => {
    AsyncStorage.getItem(CLE_STOCKAGE).then((valeur) => {
      if (valeur === "clair" || valeur === "sombre") setMode(valeur);
    });
  }, []);

  function changerMode(nouveauMode: ModeTheme) {
    setMode(nouveauMode);
    AsyncStorage.setItem(CLE_STOCKAGE, nouveauMode);
  }

  const couleurs = mode === "sombre" ? couleursSombres : couleursClaires;

  return (
    <ThemeContext.Provider value={{ mode, couleurs, changerMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ValeurContexte {
  const contexte = useContext(ThemeContext);
  // Garde-fou : oublier le <ThemeProvider> donnerait des erreurs incompréhensibles ailleurs
  if (!contexte) throw new Error("useTheme doit être utilisé dans un <ThemeProvider>");
  return contexte;
}
