import { useEffect, useState } from "react";
import { getPokemons } from "@/services/pokemonService";
import type { Pokemon } from "@/types/pokemon";

export function usePokemons() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        setLoading(true);
        setError(null);
        const pokemons = await getPokemons(20);
        if (!annule) {
          setData(pokemons);
        }
      } catch (e) {
        if (!annule) {
          setError(e instanceof Error ? e.message : "Erreur inconnue");
        }
      } finally {
        if (!annule) {
          setLoading(false);
        }
      }
    }

    charger();

    return () => {
      annule = true;
    };
  }, []);

  return { data, loading, error };
}
