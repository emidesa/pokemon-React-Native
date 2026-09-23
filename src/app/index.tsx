import { useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { usePokemons, type TriPokemon } from "@/hooks/usePokemons";
import { PokemonCard } from "@/components/PokemonCard";
import { Chargement, Erreur } from "@/components/Etats";
import { identity, grayscale, spacing, radius, typography } from "@/theme";
import { TEXTES } from "@/constants/texts";
import type { Pokemon } from "@/types/pokemon";

export default function Index() {
  const { data, loading, error, recherche, setRecherche, tri, setTri, chargerPlus } = usePokemons();
  const [afficherTri, setAfficherTri] = useState(false);

  function choisirTri(nouveauTri: TriPokemon) {
    setTri(nouveauTri);
    setAfficherTri(false);
  }

  function renderItem({ item }: { item: Pokemon }) {
    return (
      <Link href={{ pathname: "/pokemon/[id]", params: { id: item.id } }} asChild>
        <Pressable
          style={styles.lienCarte}
          accessibilityRole="button"
          accessibilityLabel={`${item.nom}, ${TEXTES.numero} ${item.id}`}
        >
          <PokemonCard id={item.id} nom={item.nom} spriteUrl={item.spriteUrl} />
        </Pressable>
      </Link>
    );
  }

  return (
    // Bannière HORS de la FlatList : elle ne défile pas, la recherche reste accessible
    <View style={styles.page}>
      <View style={styles.banniere}>
        <View style={styles.titreLigne}>
          <Image
            source={require("@/assets/pokeball.svg")}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.titre}>{TEXTES.titrePokedex}</Text>
        </View>

        <View style={styles.barreOutils}>
          {/* La pilule blanche est portée par cette View, pas par le TextInput :
              sinon l'icône loupe serait à côté de la pilule au lieu d'être dedans */}
          <View style={styles.champRechercheConteneur}>
            <Image
              source={require("@/assets/search.svg")}
              style={styles.iconeRecherche}
              contentFit="contain"
            />
            <TextInput
              style={styles.champRecherche}
              placeholder={TEXTES.rechercher}
              placeholderTextColor={grayscale.medium}
              value={recherche}
              onChangeText={setRecherche}
              accessibilityLabel={TEXTES.rechercher}
            />
          </View>

          <Pressable
            style={styles.boutonTri}
            onPress={() => setAfficherTri((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={TEXTES.boutonTri}
          >
            <Image
              source={require("@/assets/sort.svg")}
              style={styles.iconeTri}
              contentFit="contain"
            />
          </Pressable>
        </View>

        {afficherTri && (
          <View style={styles.carteTri}>
            <Text style={styles.carteTriTitre}>{TEXTES.trierPar}</Text>
            {(
              [
                { valeur: "numero" as TriPokemon, label: TEXTES.triNumero },
                { valeur: "nom" as TriPokemon, label: TEXTES.triNom },
              ] as const
            ).map((option) => (
              <Pressable
                key={option.valeur}
                style={styles.optionTri}
                onPress={() => choisirTri(option.valeur)}
                accessibilityRole="radio"
                accessibilityState={{ selected: tri === option.valeur }}
                accessibilityLabel={option.label}
              >
                <View style={styles.radioExterieur}>
                  {tri === option.valeur && <View style={styles.radioInterieur} />}
                </View>
                <Text style={styles.optionTriTexte}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* FlatList et non ScrollView : elle ne monte que les éléments visibles et recycle
          les vues — indispensable avec plus de 1000 Pokémon */}
      <FlatList
        style={styles.liste}
        contentContainerStyle={styles.container}
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={styles.ligne}
        renderItem={renderItem}
        onEndReached={chargerPlus} // déclenché à l'approche du bas → scroll infini
        onEndReachedThreshold={0.5} // 0.5 = quand il reste une demi-hauteur d'écran
        ListHeaderComponent={
          <View>
            {error && <Erreur message={error} />}
            {loading && <Chargement message={TEXTES.chargementListe} />}
          </View>
        }
        ListFooterComponent={<View style={styles.piedListe} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: identity.primary,
  },
  liste: {
    flex: 1,
    backgroundColor: grayscale.white,
    // Ces marges laissent dépasser le rouge de la page autour du conteneur blanc
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
  },
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  banniere: {
    backgroundColor: identity.primary,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  titreLigne: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
  },
  titre: {
    ...typography.titre,
    color: grayscale.white,
  },
  barreOutils: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  champRechercheConteneur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: grayscale.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  iconeRecherche: {
    width: 16,
    height: 16,
  },
  champRecherche: {
    ...typography.body1,
    flex: 1,
    paddingVertical: 10,
    color: grayscale.dark,
  },
  boutonTri: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: grayscale.white,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeTri: {
    width: 16,
    height: 16,
  },
  carteTri: {
    alignSelf: "flex-end",
    backgroundColor: grayscale.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  carteTriTitre: {
    ...typography.subtitle2,
    color: grayscale.medium,
  },
  optionTri: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  radioExterieur: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: identity.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInterieur: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: identity.primary,
  },
  optionTriTexte: {
    ...typography.body2,
    color: grayscale.dark,
  },
  ligne: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },
  lienCarte: {
    // Pourcentage et non flex: 1, sinon une carte seule (1 seul résultat de recherche)
    // s'étirerait sur toute la largeur de sa ligne
    width: "31%",
    marginBottom: spacing.md,
  },
  piedListe: {
    paddingVertical: spacing.lg,
  },
});
