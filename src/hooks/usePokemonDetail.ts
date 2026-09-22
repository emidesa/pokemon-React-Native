import { useEffect, useState } from "react";
import { getPokemonById } from "@/services/pokemonService";
import type { PokemonDetail } from "@/types/pokemon";

export function usePokemonDetail(id: string) {
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        setLoading(true);
        setError(null);
        const detail = await getPokemonById(id);
        if (!annule) {
          setData(detail);
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
  }, [id]);

  return { data, loading, error };
}
