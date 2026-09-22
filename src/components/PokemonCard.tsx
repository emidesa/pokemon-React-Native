import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";
import { grayscale } from "@/theme/colors";

type PokemonCardProps = {
  id: number;
  nom: string;
};

export function PokemonCard({ id, nom }: PokemonCardProps) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <View style={styles.carte}>
      <Image source={{ uri: spriteUrl }} style={styles.image} contentFit="contain" />
      <Text style={styles.nom}>{nom}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    width: 100,
    alignItems: "center",
    backgroundColor: grayscale.white,
    borderRadius: 12,
    padding: 8,
    gap: 4,
  },
  image: {
    width: 64,
    height: 64,
  },
  nom: {
    fontSize: 14,
    color: grayscale.dark,
    textAlign: "center",
  },
});
