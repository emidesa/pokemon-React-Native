// Les données de l'API arrivent en minuscules ("bulbasaur", "grass")
export function majuscule(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1);
}

// "1" → "001", pour coller à la numérotation du Pokédex
export function numeroPokedex(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
