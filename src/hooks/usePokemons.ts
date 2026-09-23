import { useEffect, useMemo, useState } from "react";
import { getPokemons } from "@/services/pokemonService";
import type { Pokemon } from "@/types/pokemon";

export type TriPokemon = "numero" | "nom";

const TAILLE_PAGE = 20;
const DELAI_DEBOUNCE_MS = 400;

export function usePokemons() {
  const [tous, setTous] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deux états pour une seule recherche : "recherche" suit la frappe en direct (sinon les
  // lettres s'afficheraient en retard), "rechercheDebounced" ne bouge qu'à la fin de la saisie
  const [recherche, setRecherche] = useState("");
  const [rechercheDebounced, setRechercheDebounced] = useState("");
  const [tri, setTri] = useState<TriPokemon>("numero");
  const [nombreAffiches, setNombreAffiches] = useState(TAILLE_PAGE);

  useEffect(() => {
    async function charger() {
      try {
        setLoading(true);
        setError(null);
        setTous(await getPokemons());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    charger();
  }, []);

  useEffect(() => {
    const delai = setTimeout(() => {
      setRechercheDebounced(recherche);
      setNombreAffiches(TAILLE_PAGE); // nouvelle recherche = on repart à 20 résultats
    }, DELAI_DEBOUNCE_MS);

    // Le clearTimeout tue le minuteur de la frappe précédente : tant qu'on tape, aucun
    // filtre ne se déclenche ; seul le dernier minuteur survit et sonne
    return () => clearTimeout(delai);
  }, [recherche]);

  // useMemo évite de tout recalculer à chaque rendu.
  const data = useMemo(() => {
    const texte = rechercheDebounced.trim().toLowerCase();
    const filtres = texte === "" ? tous : tous.filter((p) => p.nom.includes(texte));

    // La copie [...] est obligatoire : sort() modifie le tableau sur place, il trierait "tous"
    const tries = [...filtres].sort((a, b) =>
      tri === "numero" ? a.id - b.id : a.nom.localeCompare(b.nom)
    );

    return tries.slice(0, nombreAffiches);
  }, [tous, rechercheDebounced, tri, nombreAffiches]);

  // Aucune requête ici : tout est déjà en mémoire, on découpe juste une tranche plus grande
  function chargerPlus() {
    if (nombreAffiches < tous.length) {
      setNombreAffiches((n) => n + TAILLE_PAGE);
    }
  }

  return {
    data,
    loading,
    error,
    recherche,
    setRecherche,
    tri,
    setTri,
    chargerPlus,
  };
}
