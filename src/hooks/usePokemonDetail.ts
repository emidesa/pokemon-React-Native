import { useEffect, useState } from "react";
import { getPokemonById } from "@/services/pokemonService";
import type { PokemonDetail } from "@/types/pokemon";

export function usePokemonDetail(id: string) {
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function charger() {
      try {
        setLoading(true);
        setError(null);
        setData(await getPokemonById(id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    charger();
    // [id] et non [] : sans ça, passer de Bulbasaur à Charmander garderait les anciennes données
  }, [id]);

  return { data, loading, error };
}
