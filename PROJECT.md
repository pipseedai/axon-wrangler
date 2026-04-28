# Axon Wrangler Project

## Purpose
Build a small VS Code extension for SkySpark Axon that makes day-to-day editing safer and nicer.

## Now
- Minimal VS Code extension scaffold
- `.axon` language association
- Conservative pretty-print command prototype

## Non-goals for v0
- Full Axon parser/compiler
- Live SkySpark connection
- Automatic semantic rewrites

## Design principles
- Conservative over clever
- Useful before complete
- Every formatter rule must have fixtures
- Prefer warnings over destructive rewrites
