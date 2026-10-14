Atlas is the design system of a sign-in flow and the device settings behind it, for an app used on touch screens, on Android and as a PWA. It is neutral first: near-black on off-white (the reverse in dark), one blue for links and the focus ring, and red and green only for status. Every value comes from a token.

## Content fundamentals

Atlas speaks to the person holding the device as "you" and names itself in the third person: "Atlas can’t create your account without your agreement". Copy is short, plain and in sentence case.

- Write button labels as verbs: "Sign in", "Pair device", "Save changes". While a button loads, its label says what is happening: "Signing in…".
- Write link text that makes sense on its own: "Forgot password?", "Create an account". Never "click here".
- Make a field message say how to fix the value, with an example: "Enter a valid email, like name@company.com".
- Give an Alert a title that says what happened and a description that says what to do: "Email or password is incorrect", then "Check your details and try again, or reset your password."
- Write a checkbox label as the thing being agreed to: "Share usage data with Atlas". A required consent shows its error only after submit and says what happens without it.
- Use placeholders for the expected format only ("name@company.com", "Kitchen sensor"). The label stays visible above the field.
- Set overlines and group labels in `caption`, which renders in capitals ("Signed in as"). Never set a sentence in it.

## Visual foundations

### Colour

- Use semantic tokens in screens and components. The primitives (`neutral.50`, `blue.600`, `red.700` and the rest) exist only so semantic tokens can point at them per theme.
- Put screens on `surface.page`. Anything that sits on the page (fields, cards, the account card, menus) uses `surface.raised`.
- Set text in `text.primary`. Supporting text, hints and quiet buttons use `text.secondary`. Both hold at least 6:1 on `surface.page` in both themes.
- Fill the one primary button on a screen, and every selected control (checkbox, radio, switch on), with `action.primary`. Text and marks on it use `text.on-action`.
- Keep `accent` for text links and the focus ring.
- Outline cards and draw dividers with `border.subtle`, which is decorative. Inputs and unselected controls use `border.control`, which holds 3:1 on `surface.raised`.
- Show errors with the danger set: `danger.text` for messages, error icons and the border of an invalid field; `danger.surface` for the alert fill and the halo around an invalid field; `danger.border` for the alert outline. An error is always written out, never shown by colour alone.
- Use `success.text` on `success.surface` for the success mark only. There is no success alert, because it would need a success border colour that Atlas does not have yet.
- Light is the default theme. Set `data-theme="dark"` on the root element for dark. Components need no changes between themes.

### Type

- Set everything in Geist. Geist Mono is for code samples. Both load from Google Fonts.
- Use `title` once per screen, for the screen title, and `heading` for section titles inside a screen, such as the groups of a settings form.
- Use `body` for running text and the links inside it, `body-strong` for emphasis and names, and `body-sm` for validation messages and secondary lines such as an email address.
- Use `label` for field labels, `input` for typed text and the selected value of a select, and `button` for every button label, quiet ones included.
- There is no 15 px text. Earlier 15 px text moved to `body`, `body-strong` or `button`.

### Space and size

- Space on a 4 px scale, from `space.1` (4) to `space.14` (56). Values outside the scale are not used.
- Inside components: `space.1` between a title and its description, `space.2` from label to field and from icon to text, `space.3` inside banners and cards, `space.4` as the padding of fields, banners and cards.
- On a screen: `space.5` between fields, `space.6` for the side margins, `space.8` from intro to form and between form sections, `space.10` between screen regions, `space.12` above a bottom action area, `space.14` from header to title on entry screens.
- Make every text field, select and button `size.control` (52) tall, quiet buttons included. Give anything tappable, text links included, a target of at least `size.target-min` (44).
- Draw icons at `size.icon-sm` (16) in text-sized elements and `size.icon-md` (20) in controls and banners. Checkbox boxes, radio circles and switch thumbs are `size.mark` (24).

### Shape, borders and depth

- Round fields, buttons, icon buttons, banners, cards and menus with `radius.md` (12). Use `radius.sm` (6) for the checkbox and other small marks and `radius.full` for avatars, the success mark, switch tracks and radio dots.
- Draw borders at `stroke.default` (1 px). Surfaces are told apart by `border.subtle` outlines, not by shadows.
- Use `shadow.overlay` only for menus and popovers that float above content, such as the select menu, and stack them with `layer.overlay`. Nothing else casts a shadow.
- Give every interactive element `shadow.focus` when it has keyboard focus: a `stroke.focus` gap of `surface.page`, then a `stroke.focus` ring of `accent`. An invalid field adds `shadow.danger-halo` to its `danger.text` border; keyboard focus shows the focus ring instead of the halo, and the danger border stays.

### States and motion

- There are no hover or pressed colours: Atlas runs on touch screens, and pressed feedback comes from the platform.
- Disable with `opacity.disabled` on the whole component, which then takes no interaction. It is the only opacity in the system. Prefer an enabled button that explains what is missing after a press.
- The only motion is the loading spinner, one full turn per `duration.spin`. A loading button keeps its colours; only the spinner and the label change.

## Iconography

- Atlas has its own small stroke set, drawn on a 24-unit grid with round caps and joins: `eye`, `eye-off`, `chevron-down`, `check`, `alert-circle` and `spinner`. Use the Icon component. There are no icon files, sprites or icon fonts.
- Stroke width is 2 at `size.icon-sm`, 1.8 at `size.icon-md` and 2 at `size.icon-lg` (inside StatusMark). Icons take the colour of the text around them.
- Icons are decorative by default. An action shown only as an icon is an IconButton, which carries the label.
- Never make an icon the only signal of a state: an error icon always sits next to a message.
- The Atlas mark and wordmark are the Logo component: a 28 px mark in `text.primary` with a `surface.page` dot, and "Atlas" in `Text/body-strong`. Use the component; there is no logo file.

## Components

{{components-table}}

Every component follows these rules:

{{component-rules}}

## Building with Atlas here

- The components are React 18 function components on `window.Atlas` (`components/bundle.js`), styled by `components/bundle.css`. Load Geist and Geist Mono from {{font-url}}.
- Use the tokens as CSS variables with the repository names, "." replaced by "-": `var(--surface-page)`, `var(--space-4)`, `var(--shadow-focus)`. The type styles are classes: `type-title`, `type-body`, `type-caption` and so on.
- Components are controlled: pass `value` or `checked` with an `onChange`, and keep the state in the screen. Buttons, icon buttons and in-page links take `onPress`, not `onClick`. A Button is full width unless `fullWidth` is false.
- Build screens from these components and tokens only. A value that no token covers is not typed in; it is proposed as a new token in the repository first.

## Source

This design system is generated from the Atlas repository, {{repo}}, where tokens, component specifications and code live together and the Figma library is mapped to the same tokens. The repository is the source of truth: change a token or a component there and re-sync, so Figma, code and this system keep the same scope. Edits made on this page are replaced at the next sync. This version was generated from {{ref}}.
