export type Pokemon = {
  id: number;
  nom: string;
  spriteUrl: string;
};

export type PokemonType =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "normal"
  | "grass"
  | "ground"
  | "ice"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

export type PokemonListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export type PokemonStat = {
  nom: string;
  valeur: number;
};

export type PokemonDetail = {
  id: number;
  nom: string;
  spriteUrl: string;
  types: PokemonType[];
  poidsKg: number;
  tailleM: number;
  talents: string[];
  description: string;
  stats: PokemonStat[];
};

export type PokemonDetailApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: PokemonType } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
};

export type PokemonSpeciesApiResponse = {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};
