# Axon Wrangler

> Keep your Axon goblins in line.

Axon Wrangler is a VS Code extension project for SkySpark Axon: syntax support first, then formatter/pretty-printing, snippets, and diagnostics for common Axon gotchas.

## Current v0 Slice

This scaffold provides:

- VS Code extension metadata and TypeScript build scripts
- `.axon` language registration
- `Axon Wrangler: Pretty Print` command (`axonWrangler.prettyPrint`)
- a conservative pretty-printer with fixture-based tests

## Pretty-print v0 limits

The formatter is deliberately not a full Axon parser. For now it only:

- trims trailing spaces/tabs from each line
- normalizes line endings to `\n`
- ensures exactly one final newline

It does **not** rewrite Axon expressions, infer semantic indentation, parse comments, or connect to SkySpark. If a formatting change would require understanding Axon syntax, v0 should preserve the source text instead.

## Local development

Install dependencies:

```sh
npm install
```

Compile:

```sh
npm run compile
```

Run fixture tests:

```sh
npm test
```

Run in VS Code:

1. Open this repo in VS Code.
2. Run `npm install` if needed.
3. Press `F5` to launch an Extension Development Host.
4. Open or create a `.axon` file.
5. Run `Axon Wrangler: Pretty Print` from the command palette.

The command formats the current selection when text is selected; otherwise it formats the whole active document.
