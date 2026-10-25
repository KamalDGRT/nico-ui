# CLAUDE.md

## What this is

`@kamaldgrt/ui`: shared React UI primitives (`Modal`, `ConfirmModal`, `PromptModal`, `Drawer`, `SearchableSelect`), published to npm as compiled ESM + `.d.ts`. See [README.md](README.md) for usage and the theme-token contract.

## Layout

- `src/Modal.tsx`, `ConfirmModal.tsx`, `PromptModal.tsx`, `Drawer.tsx`, `SearchableSelect.tsx`: one component per file
- `src/constants.ts`: named constants (drawer transition duration)
- `src/index.ts`: the only public entry point; everything exported there is public API
- `tests/`: one test file per component
- `dist/`: build output (gitignored, published)

## Commands

```bash
npm test            # vitest run (jsdom)
npm run typecheck   # tsc --noEmit
npm run build       # tsup -> dist/
```

Run test and typecheck before every commit.

## Rules

- **Generic only.** No app names, domain types, routes, API calls or app-specific constants. Anything app-specific arrives through props.
- **Styling is Tailwind classes over semantic theme tokens** (`bg-surface-elevated`, `text-foreground`, `bg-cta`, ...). Never hardcode colors. Adding a token a component depends on is a breaking change for consumers (bump major) and must be added to the token table in the README.
- **Peer dependencies only:** `react` and `lucide-react`. No other runtime dependencies. No state or data libraries.
- **No app imports.** Components import only from `react`, `lucide-react` and `./` files. Relative imports, never an `@/` alias.
- **Public API is a contract.** Do not rename or remove an exported component or prop without a major bump. Add capabilities as optional props.
- **Accessibility stays.** Dialogs keep `role="dialog"`, `aria-modal` and `aria-label`, Escape handling, and labeled icon buttons.
- **No magic values.** Durations and other numbers go in `src/constants.ts`. If a value must match a Tailwind class (the 200 ms drawer transition), say so in a comment.
- **No resource leaks.** Every timer, animation frame and event listener is cleaned up in its effect.
- **Every component gets tests** that render it the way a consumer does and cover the closed state, keyboard and click dismissal, and focus behavior.
- **Published output is `dist/`.** `exports` points at `dist/`, `files` is `["dist"]`. Tests import from `src`, never from `dist`. The build prepends `"use client"`.

## Commits

Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`). Subject only, unless the reason is not obvious. No co-author trailers.

## Releasing

1. Update `version` in `package.json` (semver, see README).
2. Commit, then `git tag -a vX.Y.Z -m vX.Y.Z`.
3. `npm publish --access public` (`prepublishOnly` runs typecheck, tests and build first). npm may ask for browser approval.
4. `git push origin main vX.Y.Z`.
5. Wait until the new version is installable. The registry's version endpoint (`https://registry.npmjs.org/<package>/<version>`) answers first. `npm view <package> version --prefer-online` and `npm install` can lag by a few minutes.
6. Update each consuming app: `npm i <package>@latest`, then its typecheck, tests, lint and build, then commit and push. While the major version is `0`, `^0.x.0` ranges do not cross a minor, so every minor release needs this explicit bump.

Staged publishes show as "Cannot publish over previously staged version" on retry. Do not republish; confirm approval on npm instead.
