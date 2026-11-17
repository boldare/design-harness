# SignIn

The Atlas sign-in screen and its five states, taken from the original Atlas design.

## Layout

1. Header, height `size.target-min`: Logo on the left, Link (`subtle`, `body`) "Help" on the right.
2. Title block, `space.14` below the header: "Welcome back" / "Sign in with the email you used to create your account."
3. Alert (error state only), `space.8` below the title block: "Email or password is incorrect" / "Check your details and try again, or reset your password."
4. Form, `space.8` below the previous block, gap `space.5`:
   - TextField `email`, label "Email", placeholder "name@company.com", autocomplete `email`.
   - TextField `password`, label "Password", placeholder "At least 8 characters", label action Link (`accent`, `sm`) "Forgot password?", autocomplete `current-password`.
   - Button `primary` "Sign in", loading label "Signing in…".
5. Footer at the bottom of the screen, centred: "New to Atlas?" in `Text/body` and `text.secondary`, then Link (`strong`) "Create an account".

## States

| State | Enters | Shows | Leaves |
|-------|--------|-------|--------|
| `empty` | First open, or after Sign out | Empty fields with placeholders. Sign in is always enabled | Sign in is pressed |
| `validation` | Sign in with a missing or malformed field | Each failing field in its error state with a message: "Enter your email address", "Enter a valid email, like name@company.com", "Enter your password", "Use at least 8 characters". Messages update as the person types | Sign in with both fields passing |
| `loading` | Sign in with valid fields | Fields disabled, Button loading. The button keeps its colour | The server answers |
| `error` | The server rejects the credentials | The Alert above the form. Input is kept | Any edit clears the Alert; Sign in retries |
| `success` | The server accepts | The form is replaced by a `role="status"` region, centred in the space above the actions, gap `space.8`, `space.12` above the actions: StatusMark, "You're signed in" (`Headings/title`), "Good to see you again, Anna." (`Text/body`, `text.secondary`), AccountCard. At the bottom: Button `primary` "Continue" and Button `quiet` "Not you? Sign out", gap `space.2` | Continue, or Sign out back to `empty` |

In the interactive prototype the first valid sign-in fails and the second succeeds, so both outcomes can be shown. Values in the previews: email anna.kowalska@example.com ("anna.kowalska@" in validation), password of 12 characters (4 in validation), AccountCard Anna Kowalska.

## Acceptance

- Empty submit shows both field messages, marks both fields invalid and moves focus to the first invalid field.
- "anna.kowalska@" shows "Enter a valid email, like name@company.com", and the message clears once the email is valid.
- After a server error the Alert is announced and both fields keep their input.
- After success, Sign out returns to the empty form.
- Tab order follows the visual order; every control shows `shadow.focus`.
