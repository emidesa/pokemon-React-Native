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

// L'API ne donne pas l'id dans les listes, seulement une URL ".../pokemon-species/25/"
function idDepuisUrl(url: string): number {
  const segments = url.split("/").filter(Boolean);
  return Number(segments[segments.length - 1]);
}

function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// PokeAPI fournit des cris, mais en .ogg qu'iOS ne sait pas lire. Cette source les a en mp3
function criUrl(nom: string): string {
  return `https://play.pokemonshowdown.com/audio/cries/${nom.replace(/-/g, "")}.mp3`;
}

export async function getPokemons(): Promise<Pokemon[]> {
  // /pokemon-species et pas /pokemon : ce dernier inclut les méga-évolutions et formes
  // régionales qui n'ont pas de fiche espèce → erreurs 404
  const data = await apiFetch<PokemonListApiResponse>(`/pokemon-species?limit=1025`);

  return data.results.map((resultat) => {
    const id = idDepuisUrl(resultat.url);
    return { id, nom: resultat.name, spriteUrl: spriteUrl(id) };
  });
}

export async function getPokemonById(id: number | string): Promise<PokemonDetail> {
  // Deux endpoints nécessaires (stats d'un côté, description de l'autre), lancés en
  // parallèle : on attend le plus lent, pas la somme des deux
  const [pokemon, espece] = await Promise.all([
    apiFetch<PokemonDetailApiResponse>(`/pokemon/${id}`),
    apiFetch<PokemonSpeciesApiResponse>(`/pokemon-species/${id}`),
  ]);

  const descriptionEntry = espece.flavor_text_entries.find(
    (entree) => entree.language.name === "en"
  );
  // L'API laisse des retours à la ligne et des \f (caractère d'imprimante) dans le texte
  const description = (descriptionEntry?.flavor_text ?? "")
    .replace(/[\n\f]/g, " ")
    .trim();

  return {
    id: pokemon.id,
    nom: pokemon.name,
    spriteUrl: spriteUrl(pokemon.id),
    criUrl: criUrl(pokemon.name),
    types: pokemon.types.map((t) => t.type.name),
    // L'API hérite des unités des jeux : hectogrammes et décimètres
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
