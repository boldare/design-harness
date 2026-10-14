# Profile

The account details and notification preferences, saved together with one button.

## Layout

1. Title block: "Profile" / "We use these details to confirm your age and to show features available in your country."
2. AccountCard (Anna Kowalska, anna.kowalska@example.com), `space.8` below the title block.
3. Section "Details", `space.8` below, heading then fields with gap `space.5`:
   - TextField `text`, label "Full name", value "Anna Kowalska", autocomplete `name`.
   - TextField `email`, label "Email", value "anna.kowalska@example.com".
   - Select, label "Country", options Poland, Germany, United Kingdom; value Poland.
4. Section "Notifications", `space.8` below:
   - Radio group, legend "Usage summary": "Every day", "Every week" (selected), "Never".
   - Checkbox "Product news by email", description "One email a month at most.", unchecked (opt-in).
5. Actions, `space.8` below, gap `space.2`: Button `primary` "Save changes", Button `quiet` "Cancel".

## States

| State | Shows |
|-------|-------|
| `default` | Saved values, all fields valid |
| `error` | After Save with problems (rules: full name required, "Enter your full name"; email required, "Enter your email address", and valid, as in SignIn; country required): Email "anna.kowalska@" in its error state ("Enter a valid email, like name@company.com"), Country empty in its error state ("Choose the country where you use your device"). Focus moves to the first invalid field |
| `saving` | Fields and controls disabled, Button loading with "Saving…" |

## Acceptance

- Save with invalid fields keeps everything typed and focuses the first invalid field.
- Cancel discards changes since the last save.
- In `saving`, nothing can be edited and repeated presses are ignored.
