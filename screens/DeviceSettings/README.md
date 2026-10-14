# DeviceSettings

Settings of a connected device. Every change applies immediately, so the screen has no save button.

## Layout

1. Title block: "Device settings" / "Atlas One, connected" (`Text/body`, `text.secondary`).
2. Alert (disconnected state only), `space.8` below the title block: "Device not found" / "Move your device closer to the phone and try again."
3. Section "Device", `space.8` below: TextField `text`, label "Device name", value "Anna's Atlas One". The name is saved when the field loses focus.
4. Section "Feedback", `space.8` below, gap `space.2` between rows:
   - Switch "Vibration", description "Short vibration when a session starts.", on.
   - Switch "Device lock", description "Asks for your PIN after 5 minutes.", off.
5. Section "Light", `space.8` below: Radio group, legend "LED brightness": "Low", "Medium" (selected), "High".

## States

| State | Shows |
|-------|-------|
| `connected` | Everything enabled |
| `disconnected` | Intro "Atlas One, not connected", the Alert, and every control disabled with their last known values |

## Acceptance

- Each switch and radio change applies at once; if the device does not confirm, the control returns to its previous value and an Alert above the section says why. The prototype device always confirms.
- In `disconnected`, the controls show the last known values and cannot be changed.
