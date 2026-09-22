import { Text, View, StyleSheet, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { usePokemons } from "@/hooks/usePokemons";
import { PokemonCard } from "@/components/PokemonCard";
import { identity, grayscale } from "@/theme/colors";

export default function Index() {
  const { data, loading, error } = usePokemons();

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" />
        <Text>Chargement des Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centre}>
        <Text style={styles.erreur}>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titre}>Pokédex</Text>

      <View style={styles.grille}>
        {data.map((pokemon) => (
          <Link
            key={pokemon.id}
            href={{ pathname: "/pokemon/[id]", params: { id: pokemon.id } }}
            asChild
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${pokemon.nom}, numéro ${pokemon.id}`}
            >
              <PokemonCard id={pokemon.id} nom={pokemon.nom} />
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  container: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 16,
    backgroundColor: grayscale.background,
  },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    color: identity.primary,
  },
  grille: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 12,
  },
  erreur: {
    color: "red",
    fontSize: 16,
  },
});
