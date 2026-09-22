import { apiFetch } from "./api";
import type {
  Pokemon,
  PokemonDetail,
  PokemonDetailApiResponse,
  PokemonListApiResponse,
  PokemonSpeciesApiResponse,
} from "@/types/pokemon";

const NOMS_STATS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

function idDepuisUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

export async function getPokemons(limit: number = 20): Promise<Pokemon[]> {
  const data = await apiFetch<PokemonListApiResponse>(`/pokemon?limit=${limit}`);

  return data.results.map((resultat) => ({
    id: idDepuisUrl(resultat.url),
    nom: resultat.name,
  }));
}

export async function getPokemonById(id: number | string): Promise<PokemonDetail> {
  const [pokemon, espece] = await Promise.all([
    apiFetch<PokemonDetailApiResponse>(`/pokemon/${id}`),
    apiFetch<PokemonSpeciesApiResponse>(`/pokemon-species/${id}`),
  ]);

  const descriptionEntry = espece.flavor_text_entries.find(
    (entree) => entree.language.name === "en"
  );
  const description = (descriptionEntry?.flavor_text ?? "")
    .replace(/[\n\f]/g, " ")
    .trim();

  return {
    id: pokemon.id,
    nom: pokemon.name,
    types: pokemon.types.map((t) => t.type.name),
    poidsKg: pokemon.weight / 10,
    tailleM: pokemon.height / 10,
    talents: pokemon.abilities.map((a) => a.ability.name),
    description,
    stats: pokemon.stats.map((s) => ({
      nom: NOMS_STATS[s.stat.name] ?? s.stat.name,
      valeur: s.base_stat,
    })),
  };
}
