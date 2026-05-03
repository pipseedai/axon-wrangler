# Axon Wrangler

> Keep your Axon goblins in line.

Axon Wrangler is a VS Code extension project for SkySpark Axon: syntax support first, then formatter/pretty-printing, snippets, and diagnostics for common Axon gotchas.

## Current v0 Slice

This scaffold provides:

- VS Code extension metadata and TypeScript build scripts
- `.axon` language registration
- conservative TextMate syntax colouring for comments, strings, numbers, refs, keywords/block words, constants, operators/arrows, dict/tag keys, and function/method-ish calls
- `samples/basic.axon` and `samples/real-shape.axon` as syntax-colour smoke files
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

Run tests:

```sh
npm test
```

This compiles TypeScript, runs fixture tests for `prettyPrintAxon`, and runs TextMate tokenization tests against `syntaxes/axon.tmLanguage.json`, including the sanitized real-shaped Axon sample.

Build a local VSIX package:

```sh
npm run package:vsix
```

This runs `npm test`, runs the VS Code prepublish compile step, and writes `dist/axon-wrangler-<version>.vsix`.

To run only the syntax-colour tokenization self-test:

```sh
npm run test:grammar
```

This verifies emitted TextMate scopes for representative comments, strings, numbers, refs, keywords, chained method/function-ish calls, operators/arrows, dict/tag keys before `:`, and known literals. It does not prove theme colours visually distinguish those scopes; use the manual check below only for final eyeballing in a real VS Code theme.

## Manual syntax-colour testing

1. Open this repo in VS Code.
2. Run `npm install` if needed.
3. Press `F5` to launch an Extension Development Host.
4. In the Extension Development Host, open `samples/basic.axon`, `samples/real-shape.axon`, or create another `.axon` file.
5. Confirm the active VS Code theme visibly distinguishes the scoped shapes that `npm run test:grammar` already verifies: comments, strings, numbers, refs such as `@p:demo-site-123`, block words such as `do`/`end`, constants such as `true`/`false`/`null`, operators/arrows such as `=>`/`->`/`==`, dict/tag keys before `:`, and chained method-ish calls such as `.sort(...)`/`.addMeta(...)`/`.toGrid`.

The v0 grammar is intentionally conservative. It does not fully parse Axon or attempt semantic highlighting; it only provides stable TextMate scopes for the obvious lexical shapes covered by the automated tokenization samples. Visual theme contrast remains a manual VS Code check.

## Release/package hygiene

Axon Wrangler is currently marked `private: true` in `package.json` and is packaged for local/private installation, not Marketplace publishing.

The repository intentionally commits `.vscodeignore` so package contents stay explicit. The package excludes source, tests, project-planning docs, Git metadata, generated VSIX files, and development-only directories. The built VSIX includes the compiled extension, language configuration, grammar, samples, and README.

There is no committed `LICENSE` file yet. Until that changes, treat the package as private/no-license rather than open-source distributable.

For a release candidate:

1. Run `npm install` if dependencies are not present.
2. Run `npm run package:vsix`.
3. Confirm the command reports the expected included files and writes `dist/axon-wrangler-<version>.vsix`.
4. Install the generated VSIX in an Extension Development Host or local VS Code profile for manual smoke testing.

GitHub Actions also runs `npm ci` and `npm run package:vsix` on pushes to `main` and pull requests, then uploads the generated VSIX as a workflow artifact.

## Pretty-print testing

Automated path:

```sh
npm test
```

Pretty-print fixture cases live under `test/fixtures/<case>/input.axon` and `expected.axon`. Add a fixture before adding any new formatter rule.

Manual command path:

1. Launch the Extension Development Host with `F5`.
2. Open a `.axon` document with trailing spaces or extra blank lines at the end.
3. Run `Axon Wrangler: Pretty Print` from the command palette.
4. Confirm the current selection is formatted when selected; otherwise the whole document is formatted.

The command formats the current selection when text is selected; otherwise it formats the whole active document.
