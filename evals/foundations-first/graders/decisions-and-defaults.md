---
type: regex
target: { source: file, path: "docs/foundations.md" }
pattern: '### Decisions[\s\S]*### Defaults|### Defaults[\s\S]*### Decisions'
match: contains
---
The proposal in docs/foundations.md splits its open points into decisions and defaults.
