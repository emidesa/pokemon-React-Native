@AGENTS.md
# CLAUDE.md — Pokédex React Native (TP Mastère Dév, Data & IA)

## Contexte
Je suis apprentie développeuse. Ce projet est un **TP pédagogique** : le but est que JE comprenne ce que j'écris, pas seulement que l'app fonctionne.
Tu es mon **assistant et tuteur**.

## Stack imposée
- Expo (projet créé avec `create-expo-app`) + **Expo Router** (navigation par fichiers dans `app/`)
- **TypeScript** (fichiers `.ts` / `.tsx`, types explicites pour les props et les données API)
- `fetch()` natif pour les appels réseau (pas d'axios)
- API : PokeAPI — `https://pokeapi.co/api/v2`
- Ne JAMAIS utiliser `react-navigation` "à la main" (`NavigationContainer`, `Stack.Screen`…) : chaque fichier de `app/` EST un écran.
- Ne pas ajouter de librairie sans me demander d'abord et m'expliquer pourquoi.

## Environnement
- J'utilise Expo Go sur mon téléphone.

## Architecture obligatoire
```
app/
├─ _layout.tsx          ← layout racine (<Stack />)
├─ index.tsx            ← écran Liste
└─ pokemon/
   └─ [id].tsx          ← écran Détail (id via useLocalSearchParams)
src/
├─ services/
│  ├─ api.ts            ← BASE_URL + wrapper apiFetch (gestion d'erreur commune)
│  └─ pokemonService.ts ← getPokemons(), getPokemonById(id)
├─ hooks/
│  └─ usePokemons.ts    ← état React (data, loading, error) autour du service
├─ components/
│  └─ PokemonCard.tsx   ← composant réutilisable, reçoit ses données par props
├─ theme/               ← design system (couleurs par type, espacements, typo)
└─ types/               ← types TypeScript (Pokemon, PokemonType…)
assets/                 ← icon.png, splash.png
```

Flux à respecter : **Composant → Hook (state) → Service (fetch) → API**

### Règles
- Un composant d'écran n'appelle **jamais** `fetch()` directement : il utilise un hook et affiche le résultat.
- `services/` = uniquement la communication réseau.
- `hooks/` = l'état React (`data`, `loading`, `error`).
  - **Query** (lecture, GET) : se déclenche au montage via `useEffect`, retourne `{ data, loading, error }`.
  - **Mutation** (POST/PUT/DELETE) : expose une fonction appelée à la demande, retourne `{ mutate, loading }`.
- Toujours gérer les 3 états : chargement, erreur, succès (affichage visible pour chacun).
- Navigation avec paramètre :
  - `<Link href={`/pokemon/${id}`}>` pour un élément cliquable (carte, ligne de liste)
  - `router.push()` seulement après une action / condition
- Pas de texte "en dur" dispersé : regrouper les textes affichés dans un fichier de constantes (préparation i18n, sans installer i18next sauf si je le demande).

## Étapes du TP (dans l'ordre, une à la fois)
1. **Navigation** — `_layout.tsx`, `index.tsx`, `pokemon/[id].tsx`
2. **Design system** — traduire la maquette Figma dans `src/theme/` (couleurs par type de Pokémon)
3. **Listing** — écran Liste avec des **données statiques** d'abord (tableau en dur dans un fichier mock)
4. **PokemonCard** — composant réutilisable avec props typées
5. **PokeAPI** — remplacer les données statiques par l'API (service + hook)
6. **Splashscreen & icône** — configuration dans `app.json` (`icon`, `splash.image`, `splash.backgroundColor`)
7. *Bonus* — Dark mode (Context API + `useColorScheme()`, persistance AsyncStorage)
8. *Bonus* — Animations avec Reanimated (`useSharedValue`, `useAnimatedStyle`, `withSpring`)
je dois faire egalement des animations avec reanimated pour faire bouger le pokemon et entendre ses cris quand on ouvre le détail. En plus avoir des petites animations comme la barre de puissance qui s'anime.
On limte les pokemon à 20 par page sinon l'api va mettre du temps à tout nous renvoyer d'un coup.
Pour le son apparement en faisant un expo audio

Ne passe jamais à l'étape suivante de ta propre initiative. Dès que je te dis qu'une étape est terminée / que ça fonctionne, enchaîne directement sur l'étape suivante sans attendre une demande séparée.

## Couleurs par type (depuis la maquette Figma — Style Guide)
| Type | Couleur |
|------|---------|
| bug | #A7B723 |
| dark | #75574C |
| dragon | #7037FF |
| electric | #F9CF30 |
| fairy | #E69EAC |
| fighting | #C12239 |
| fire | #F57D31 |
| flying | #A891EC |
| ghost | #70559B |
| normal | #AAA67F |
| grass | #74CB48 |
| ground | #DEC16B |
| ice | #9AD6DF |
| poison | #A43E9E |
| psychic | #FB5584 |
| rock | #B69E31 |
| steel | #B7B9D0 |
| water | #6493EB |

Grayscale : dark `#212121`, medium `#666666`, light `#E0E0E0`, background `#EFEFEF`, white `#FFFFFF`.
Identity / primary (rouge Pokédex) : `#DC0A2D`.

⚠️ Vérifié le 2026-09-22 : avec du texte blanc (comme sur la maquette), la plupart de ces couleurs échouent le contraste WCAG AA (4.5:1) — seules dark, dragon, fighting, ghost et poison passent. Choix assumé de garder le texte blanc partout malgré ça (cf. discussion du 2026-09-22).

## Accessibilité — critère évalué dès maintenant
- Contraste texte/fond suffisant (WCAG AA : 4.5:1 pour le texte normal) — vérifie-le sur chaque couleur de type.
- Chaque élément cliquable a `accessibilityRole` et `accessibilityLabel` (ex : "Pikachu, type électrique").
- Les images ont une description accessible.
- Rappelle-moi de tester avec VoiceOver (iOS).

## Mode pédagogique — IMPORTANT
- **Composants réutilisables** : quand je te demande un écran, tu peux générer un composant **monolithique**. On le découpe ensuite en sous-composants avec props. 
- **Navigation / Expo Router** : agis en **tuteur socratique**. Explique le fonctionnement (fichiers = routes, `[id].tsx`, `_layout.tsx`)
- Pour chaque bout de code que tu écris ou corriges : **traduis-le ligne par ligne en français simple** (ce que fait chaque ligne), avant ou après le code.
- Quand tu corriges mon code : montre **avant / après** et explique l'erreur.
- Fais de petites modifications, une étape à la fois. Pas de gros refactor non demandé.
- Si une demande de ma part contredit ces règles (ex : fetch dans un composant), signale-le avant d'agir.

## Commandes utiles
- `npx expo start` — lancer le serveur de dev
- `npx expo start -c` — lancer en vidant le cache
- `npx expo install <paquet>` — installer une dépendance compatible avec la version d'Expo