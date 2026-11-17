---
type: regex
target: { source: file, path: "components/README.md" }
pattern: '\| *([^|\n]+?) *\|[^\n]*\n *\| *\[Badge\]\(Badge/README\.md\) *\| *\1 *\||\| *\[Badge\]\(Badge/README\.md\) *\| *([^|\n]+?) *\|[^\n]*\n *\| *\[\w+\]\(\w+/README\.md\) *\| *\2 *\||^(?=[\s\S]*\| *\[Badge\]\(Badge/README\.md\) *\| *([^|\n]+?) *\|)(?![\s\S]*\| *\[(?!Badge\])\w+\]\(\w+/README\.md\) *\| *\3 *\|)'
match: contains
---
The inventory table has a Badge row, next to a row of its own group, or alone in a new group, so that the rows of each group still stand together.
