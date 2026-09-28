# Workspace Designer

An interactive tool for digital nomads in Bali to design their workspace (desk, chair, screens, lamp, plants, even a surfboard), watch it come together, and rent it in one tap.

## Approach

The design starts from the user in the brief: a freelancer who just landed and needs a workspace by next week. They don't want a catalog; they want to _see_ their setup. So the preview is the hero of the page, and every choice changes it right away.

- **The preview comes first.** An illustrated SVG room (with an ocean view) where each item drops in as you add it. Desk finish and chair colour recolour instantly, and the standing desk actually rises when you press "Stand up".
- **A guided flow, not a catalog.** Four tabs (Desk → Chair → Accessories → Extras) with a "Next" nudge. Desk and chair are always set, so the scene never looks empty or broken.
- **Start from a preset.** Four ready-made setups (Nomad Starter, Developer Pro, Creator Studio, Bali Vibes) for people who'd rather tweak than build. Each shows a live thumbnail of the setup.
- **Real-world rules.** Every desk has a set number of screen spots; the ultrawide takes two. When a desk is full, the Add button explains why. If you switch to a smaller desk, extra monitors are taken off and a short notice says so.
- **Price always visible.** A running weekly total sits in the sidebar on desktop and in a bottom bar on phones. The checkout shows every line, lets you pick a rental length with long-stay discounts, and includes free delivery and setup.
- **Works on phones.** On small screens the preview stays pinned at the top while you scroll the catalog, so you see every change.
- **Remembers your setup.** Your design is saved in the browser, so a refresh doesn't lose it.

## Tech choices

- **Illustrations are code, not images.** Every item is a small SVG React component, so a desk finish or chair colour is just a prop and there are no image assets to manage. A layout function places items by simple rules: screens are centred and scale down to fit the desk, the webcam clips onto the middle screen (or the laptop), and the standing desk lifts everything on it.
- **Nothing beyond the required stack.** Animations are plain CSS and switch off for people who prefer reduced motion. Shared UI pieces (`Button`, `Stepper`, `Price`, the selected-card style) live in `components/ui/`, one file each in the shadcn style, rather than coming from a component library.
- **A tiny store instead of a state library.** The selection is read with `useSyncExternalStore` and saved to `localStorage`. This avoids hydration mismatches, and saved data is validated before use, so an old or broken save can't crash the page.
- **The catalog is data.** Products, presets, prices and the screen-spot rules live in one typed module (`lib/catalog.ts`), so adding a product means one entry plus an SVG.
- **The rent button never scrolls away.** On desktop the page is a fixed-height layout: the preview column scrolls on its own and the sidebar always fits the screen. On phones the preview is pinned at the top and the total sits in a bottom bar.
- **Accessible by default.** Tabs work with arrow keys, cards behave as radio groups, icon buttons require a label, the checkout dialog traps focus, and the running total and notices are announced to screen readers.

## What could come next

- **Edit from the preview.** Click a monitor or plant in the scene to swap or remove it, instead of going back to the list.
- **A budget mode.** Set a weekly budget and have the tool suggest the best setup within it, or show what to drop to fit.
- **Share a setup by link.** Encode the design in the URL, so a team lead can send one setup to everyone joining.
- **Fit the room.** Ask for the room or villa size and warn when a desk plus extras won't fit.
- **Availability per date.** Grey out items that aren't in stock for the chosen delivery day before people fall in love with them.
- **Tests.** Unit tests for the screen-spot rules and pricing, plus a Playwright run through the full design-to-rent flow.

## AI disclosure

This project was built with an AI assistant, directed and reviewed by the developer.

- **Tool:** Claude (Anthropic), in Cowork mode of the Claude desktop app.
- **Model:** `claude-opus-5-5`, the model configured for the session.
- **Effort:** Medium.

### Parts made with AI

- **Project setup:** scaffolding with `create-next-app`, pinning dependency versions, switching to Bun, the oxfmt + lefthook setup and the Docker setup (both modelled on the developer's earlier projects).
- **All application code:** everything in `app/`, `components/` and `lib/`, including the page layout, catalog, checkout, state store and shared UI components.
- **The illustrations:** every desk, chair, accessory and the room itself are SVGs the AI drew in code.
- **Catalog content:** product names, descriptions and presets. Prices are loosely based on monis.rent's public "from $X/week" pricing; the rest are estimates.
- **Interface text and this README,** written by the AI and revised on request.
- **Checking the work:** the AI ran lint, type checks and builds, and took scripted browser screenshots at several screen sizes to catch layout problems.

### Human contributions

- **Decisions:** the requirements, plus the key calls on tooling (Bun, oxfmt, lefthook), the Docker approach, SVG illustrations over product photos, a summary-only checkout, the crisp neutral visual direction and the shadcn-style component structure.
- **Review:** every change was checked in the browser, with fixes requested where needed, for example: the "Ready to rent" button scrolling out of view, clipped badges and borders, preset cards of unequal height, the subtitle wrapping too early, and duplicated button styles that should be shared components.

## Getting started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run format` / `bun run format:check`: format with oxfmt
- `bun run lint` / `bun run lint:fix`: lint with ESLint
- `bun run typecheck`: type-check with TypeScript
- `bun run validate`: format check, lint, typecheck, and build

A lefthook pre-commit hook (installed by `bun install`) formats, lints and type-checks staged files.

## Project structure

```
app/                  layout, page, global styles and theme tokens
components/
  art/                SVG illustrations (desks, chairs, desk items, room items)
  ui/                 shared primitives, one per file (button, stepper, price)
                      plus style helpers (styles.ts: focusRing, selectable)
  scene.tsx           composes the live preview
  catalog-panel.tsx   tabs, product cards, colour swatches
  checkout-dialog.tsx summary, rental length, confirmation
  workspace-designer.tsx page layout, presets, totals
lib/
  catalog.ts          products, presets, pricing and capacity rules
  store.ts            persisted selection store
  utils.ts            cn() class name helper
```

## Docker

```bash
docker compose up --build
```

The app is built with `output: "standalone"` and served by Bun.
