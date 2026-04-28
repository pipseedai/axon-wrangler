# Roadmap

## Now
- v0 syntax colouring is good enough to stop overfitting for the moment.
- Goblin queue is stocked with small next features:
  - #9 diagnostics for common Axon footguns
  - #10 snippets for common Axon patterns
  - #11 conservative `do`/`end` indentation pretty-printing
  - #12 Format Document / Format Selection integration
  - #13 extension-host smoke tests
  - #14 repeatable VSIX packaging/release workflow
  - #15 curated hover help for known functions/gotchas

## Recommended Goblin Order
1. #14 packaging/release hygiene — makes future handoff builds smoother.
2. #12 format provider — turns existing pretty-print into normal VS Code behaviour.
3. #9 diagnostics — highest daily usefulness after colouring.
4. #10 snippets — low-risk ergonomic win.
5. #11 indentation — useful but needs careful fixture discipline.
6. #15 hover help — helpful once the core interaction feels stable.
7. #13 extension-host tests — pull forward if command/provider behaviour gets fragile.

## Later
- Anvil integration for eval/validation.
- Shared formatter/linter library reusable outside VS Code.
- Larger Language Server Protocol shape if diagnostics/hover/completion outgrow extension-local code.

## Parking Lot
- Full Axon parser/compiler.
- Semantic autocomplete from live SkySpark project.
- Theme-specific colour customization beyond TextMate scopes.
