import { useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { usePokemons, type TriPokemon } from "@/hooks/usePokemons";
import { PokemonCard } from "@/components/PokemonCard";
import { Chargement, Erreur } from "@/components/Etats";
import { OptionRadio } from "@/components/OptionRadio";
import { identity, spacing, radius, typography, ombres, useTheme } from "@/theme";
import { TEXTES } from "@/constants/texts";
import type { Pokemon } from "@/types/pokemon";

export default function Index() {
  const { data, loading, error, recherche, setRecherche, tri, setTri, chargerPlus } = usePokemons();
  const [afficherTri, setAfficherTri] = useState(false);
  // Mesurée au rendu : c'est ce qui permet de poser le panneau de tri juste sous la bannière
  const [hauteurBanniere, setHauteurBanniere] = useState(0);
  const { mode, couleurs, changerMode } = useTheme();
  // En mode sombre, le rouge de marque laisse place au fond sombre
  const couleurFond = mode === "sombre" ? couleurs.fond : identity.primary;

  function choisirTri(nouveauTri: TriPokemon) {
    setTri(nouveauTri);
    setAfficherTri(false);
  }

  function renderItem({ item }: { item: Pokemon }) {
    return (
      <Link href={{ pathname: "/pokemon/[id]", params: { id: item.id } }} asChild>
        <Pressable
          style={styles.lienCarte}
          accessibilityLabel={`${item.nom}, ${TEXTES.numero} ${item.id}`}
        >
          <PokemonCard id={item.id} nom={item.nom} spriteUrl={item.spriteUrl} />
        </Pressable>
      </Link>
    );
  }

  return (
    // Bannière HORS de la FlatList : elle ne défile pas, la recherche reste accessible
    <View style={[styles.page, { backgroundColor: couleurFond }]}>
      <View
        style={[styles.banniere, { backgroundColor: couleurFond }]}
        onLayout={(e) => setHauteurBanniere(e.nativeEvent.layout.height)}
      >
        <View style={styles.titreLigne}>
          <Image
            source={require("@/assets/pokeball.svg")}
            style={styles.logo}
            contentFit="contain"
            accessible={false}
          />
          <Text style={styles.titre}>{TEXTES.titrePokedex}</Text>
        </View>

        <View style={styles.barreOutils}>
          <View style={[styles.champRechercheConteneur, { backgroundColor: couleurs.surface }]}>
            <Image
              source={require("@/assets/search.svg")}
              style={styles.iconeRecherche}
              contentFit="contain"
              accessible={false}
            />
            <TextInput
              style={[styles.champRecherche, { color: couleurs.texte }]}
              placeholder={TEXTES.rechercher}
              placeholderTextColor={couleurs.texteSecondaire}
              value={recherche}
              onChangeText={setRecherche}
              accessibilityLabel={TEXTES.rechercher}
            />
          </View>

          <Pressable
            style={[styles.boutonTri, { backgroundColor: couleurs.surface }]}
            onPress={() => setAfficherTri((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={TEXTES.boutonOptions}
          >
            <Image
              source={require("@/assets/sort.svg")}
              style={styles.iconeTri}
              contentFit="contain"
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        style={[styles.liste, { backgroundColor: couleurs.fond }]}
        contentContainerStyle={styles.container}
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={styles.ligne}
        renderItem={renderItem}
        onEndReached={chargerPlus} // déclenché à l'approche du bas 
        onEndReachedThreshold={0.5} // 0.5 = quand il reste une demi-hauteur d'écran
        ListHeaderComponent={
          <View>
            {error && <Erreur message={error} />}
            {loading && <Chargement message={TEXTES.chargementListe} />}
          </View>
        }
        ListFooterComponent={<View style={styles.piedListe} />}
      />

      {afficherTri && hauteurBanniere > 0 && (
        <>
          {/* Zone tapable qui couvre tout l'écran : un clic n'importe où ferme le panneau */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAfficherTri(false)}
            accessibilityRole="button"
            accessibilityLabel={TEXTES.fermerOptions}
          />

          <View
            style={[styles.carteTri, { backgroundColor: couleurs.surface, top: hauteurBanniere }]}
          >
            <Text style={[styles.carteTriTitre, { color: couleurs.texteSecondaire }]}>
              {TEXTES.trierPar}
            </Text>
            <OptionRadio
              label={TEXTES.triNumero}
              selectionne={tri === "numero"}
              onPress={() => choisirTri("numero")}
            />
            <OptionRadio
              label={TEXTES.triNom}
              selectionne={tri === "nom"}
              onPress={() => choisirTri("nom")}
            />

            <Text style={[styles.carteTriTitre, { color: couleurs.texteSecondaire }]}>
              {TEXTES.theme}
            </Text>
            <OptionRadio
              label={TEXTES.themeClair}
              selectionne={mode === "clair"}
              onPress={() => changerMode("clair")}
            />
            <OptionRadio
              label={TEXTES.themeSombre}
              selectionne={mode === "sombre"}
              onPress={() => changerMode("sombre")}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  liste: {
    flex: 1,
    // Ces marges laissent dépasser le rouge de la page autour du conteneur
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
  },
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  banniere: {
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
    color: identity.texteSurCouleur,
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
  },
  boutonTri: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeTri: {
    width: 16,
    height: 16,
  },
  carteTri: {
    ...ombres.dp2,
    // "absolute" le sort du flux : il se superpose à la liste au lieu de la pousser vers
    // le bas. Le "top" est fourni au rendu, il vaut la hauteur mesurée de la bannière
    position: "absolute",
    right: spacing.lg,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  carteTriTitre: {
    ...typography.subtitle2,
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
