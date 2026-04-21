# Second Leaf — Mobile App

An ideal native mobile companion to [secondleaf.co.uk](https://secondleaf.co.uk),
the UK marketplace where plant lovers **buy, sell, swap, and give away** plants,
cuttings, and seeds.

> _Give plants a second home._

The site is a PWA served to the homescreen as a plain list
(`?launchedfrom=homescreen&display=List`). This app reimagines it natively:
same workflow, but built for touch with a proper brand system, richer
discovery, and in-app messaging.

## Stack

- **Expo SDK 51** + **React Native 0.74**
- **TypeScript**
- **React Navigation** (bottom tabs + native stack)
- **react-native-svg** for the logo + generative plant illustrations
- Path aliases via `@/*` → `src/*`

## Getting started

```bash
npm install
npm start           # opens Expo Dev Tools
npm run ios         # or android / web
```

## Preview on your phone (GitHub Pages)

A GitHub Actions workflow builds the web version and publishes it to
GitHub Pages on every push to `main` or
`claude/secondleaf-mobile-app-ezDtE`.

**One-time setup:** in the repo, go to **Settings → Pages** and set
**Source: GitHub Actions**.

After the first successful run, the app is live at:

```
https://<owner>.github.io/SecondLeaf/
```

Open that URL on your phone and add it to your homescreen — the exact
same PWA pattern Second Leaf uses on the web
(`?launchedfrom=homescreen&display=List`).

## Branding

Pulled from the Second Leaf identity and extended into a full mobile system.

| Token        | Hex        | Usage |
| ------------ | ---------- | ------ |
| `leaf`       | `#2E7D4F`  | Primary brand green |
| `leafDark`   | `#1E5733`  | Deep gradient + word accents |
| `leafLight`  | `#6FB989`  | Highlights, buttons pressed |
| `sprout`     | `#A8D5A2`  | Light accents |
| `leafMuted`  | `#C6E1CF`  | Backgrounds for icon chips |
| `cream`      | `#F4F7F1`  | App background |
| `paper`      | `#FFFFFF`  | Cards |
| `bark`       | `#5C4A3A`  | Terracotta/wooden details |
| `accent`     | `#E8A13A`  | Ratings, badges |
| `danger`     | `#C25450`  | Likes, destructive actions |

Logo mark: two overlapping teardrop leaves with radial vein detail on a
dark-to-mid green gradient. Generated at three scales (`icon.png`,
`adaptive-icon.png`, `favicon.png`) and reproduced as inline SVG in
`src/components/Logo.tsx` so it scales cleanly across the UI.

Typography: a serif display face (Georgia) for headings — reinforcing the
botanical-journal feel of the brand — and system sans for body text.

Iconography: Ionicons throughout for a clean, neutral feel that doesn't
compete with the generative plant artwork.

## Features (parity with secondleaf.co.uk + native enhancements)

### Implemented

- **Browse / home feed** — featured carousel, mode filters (For sale / Swap
  / Free), category chips, switch between List and Grid views
  (mirroring the site's `?display=List` param)
- **Search** — full-text search, category + mode filters, distance slider,
  five sort orders (newest, nearest, price asc/desc, most loved)
- **Listing detail** — hero illustration, save, share, in-app message,
  details grid, trade-for panel, seller card, safety tip
- **Sell / Swap / Give away** — entry screen with three listing modes + tips
- **Create listing** — full form with photo preview, mode, price / trade-for,
  species, description, category, care level, light, height, town, pot &
  pet-friendly toggles
- **Messages** — conversations list + chat screen with bubbles, composer,
  listing context pin, unread markers
- **Notifications** — messages, offers, likes, system notices
- **Profile** — stats, listings, saved, reviews tabs, share & new listing
  actions
- **Seller profile** — public profile with bio, stats, listings
- **Sign in / Sign up** — email + password, Google / Apple placeholders,
  guest mode, gradient branded splash
- **Settings** — account, preferences (location, push categories), help,
  sign out
- **Generative plant artwork** — deterministic leafy SVG illustrations
  keyed off listing IDs so no remote image hosting is required to prototype
- **Custom branded tab bar** with a floating "+" sell button and a badge
  counter for unread messages

## Project structure

```
assets/               brand PNGs (icon, adaptive-icon, splash, favicon)
App.tsx               entry — wires providers + navigator
src/
  theme/              colors, typography, spacing, radii, shadows
  components/         Logo, PlantArt, PlantCard, Chip, Button, Avatar, ...
  context/AppContext  global reducer — listings, saved, chat, auth
  data/               seed listings, users, conversations, notifications
  navigation/         bottom tabs + native stack
  screens/            one file per screen
  types/              shared types
  utils/              (reserved)
```

## License

UI + code scaffolded for demonstration. Brand name "Second Leaf" and tagline
belong to their owners.
