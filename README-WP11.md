# Command Center

An Obsidian plugin implementing the Command Center Phase 3 Architecture Record.

## Status

**WP11 — Project Record Data Layer**: implemented, tested, closed.

Later work packages (orientation element, screens, AI observation surface)
are not yet implemented — see `docs/architecture/` for the governing
specifications once added.

## Development

```
npm install
npm test        # run the data layer test suite
npx tsc --noEmit # type-check
```

`npm run build` will fail until `src/main.ts` is introduced in a later
work package — this is intentional, not a bug.
