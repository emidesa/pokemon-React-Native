import { Image } from "expo-image";
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { typeColors, grayscale } from "@/theme/colors";

function majuscule(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1);
}

export default function DetailPokemon() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = usePokemonDetail(id);

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centre}>
        <Text style={styles.erreur}>Erreur : {error ?? "Pokémon introuvable"}</Text>
      </View>
    );
  }

  const couleurPrincipale = typeColors[data.types[0]];
  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  return (
    <ScrollView style={styles.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { backgroundColor: couleurPrincipale }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour à la liste"
          style={styles.boutonRetour}
        >
          <Text style={styles.fleche}>←</Text>
        </Pressable>

        <Text style={styles.nomHeader}>
          {majuscule(data.nom)} #{String(data.id).padStart(3, "0")}
        </Text>

        <Image
          source={{ uri: artworkUrl }}
          style={styles.image}
          contentFit="contain"
          accessibilityLabel={`Illustration de ${data.nom}`}
        />
      </View>

      <View style={styles.contenu}>
        <View style={styles.badges}>
          {data.types.map((type) => (
            <View
              key={type}
              style={[styles.badge, { backgroundColor: typeColors[type] }]}
              accessibilityLabel={`Type ${type}`}
            >
              <Text style={styles.badgeTexte}>{majuscule(type)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitre}>About</Text>
        <View style={styles.about}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutValeur}>{data.poidsKg} kg</Text>
            <Text style={styles.aboutLabel}>Weight</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutValeur}>{data.tailleM} m</Text>
            <Text style={styles.aboutLabel}>Height</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutValeur}>{data.talents.map(majuscule).join(", ")}</Text>
            <Text style={styles.aboutLabel}>Abilities</Text>
          </View>
        </View>

        {data.description ? <Text style={styles.description}>{data.description}</Text> : null}

        <Text style={styles.sectionTitre}>Base Stats</Text>
        {data.stats.map((stat) => (
          <View key={stat.nom} style={styles.statLigne}>
            <Text style={styles.statNom}>{stat.nom}</Text>
            <Text style={styles.statValeur}>{String(stat.valeur).padStart(3, "0")}</Text>
            <View style={styles.statBarreFond}>
              <View
                style={[
                  styles.statBarreValeur,
                  {
                    width: `${Math.min(100, (stat.valeur / 255) * 100)}%`,
                    backgroundColor: couleurPrincipale,
                  },
                ]}
              />
            </View>
          </View>
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
  erreur: {
    color: "red",
    fontSize: 16,
  },
  page: {
    flex: 1,
    backgroundColor: grayscale.white,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  boutonRetour: {
    position: "absolute",
    top: 56,
    left: 16,
  },
  fleche: {
    fontSize: 24,
    color: grayscale.white,
  },
  nomHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: grayscale.white,
    alignSelf: "flex-start",
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 8,
  },
  contenu: {
    padding: 16,
    gap: 16,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeTexte: {
    color: grayscale.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionTitre: {
    fontSize: 16,
    fontWeight: "bold",
    color: grayscale.dark,
  },
  about: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  aboutItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  aboutValeur: {
    fontSize: 14,
    fontWeight: "bold",
    color: grayscale.dark,
    textAlign: "center",
  },
  aboutLabel: {
    fontSize: 12,
    color: grayscale.medium,
  },
  description: {
    fontSize: 14,
    color: grayscale.dark,
    lineHeight: 20,
  },
  statLigne: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statNom: {
    width: 44,
    fontSize: 12,
    fontWeight: "bold",
    color: grayscale.medium,
  },
  statValeur: {
    width: 32,
    fontSize: 12,
    color: grayscale.dark,
  },
  statBarreFond: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: grayscale.light,
    overflow: "hidden",
  },
  statBarreValeur: {
    height: "100%",
    borderRadius: 3,
  },
});
