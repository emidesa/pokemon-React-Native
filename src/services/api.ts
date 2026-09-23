export const BASE_URL = "https://pokeapi.co/api/v2";

export async function apiFetch<T>(chemin: string): Promise<T> {
  const reponse = await fetch(`${BASE_URL}${chemin}`);

  // fetch ne lève pas d'erreur sur un 404/500 : on la déclenche nous-mêmes
  if (!reponse.ok) {
    throw new Error(`Erreur API (${reponse.status}) sur ${chemin}`);
  }

  return reponse.json() as Promise<T>;
}
