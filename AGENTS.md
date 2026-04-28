# AGENTS.md — Axon Wrangler

Read this before working.

## Project
Axon Wrangler is a VS Code extension for SkySpark Axon. Start small and conservative.

## Important constraints
- Do not pretend to fully parse Axon in v0.
- Pretty-printing must be fixture-driven and conservative.
- If unsure, preserve source text rather than rewriting it.
- Keep PRs small and reviewable.

## Useful Axon gotchas to know
- Use `debugType`, not `typeof`.
- Axon uses `lower()` / `upper()`, not `toLower()` / `toUpper()`.
- `dict.get("x", fallback)` does not work like JS/Python; fallback is ignored.
- `readAll(...).limit(...)` is wrong; use `readAllStream(...).limit(...).collect()` or DB limit options.
- Filter shadowing like `siteRef == siteRef` is suspicious.

## Completion signal
Open a PR labelled `human-review` and summarize tests run.
