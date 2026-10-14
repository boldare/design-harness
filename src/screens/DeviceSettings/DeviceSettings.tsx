import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { RadioGroup } from '../../components/Radio';
import { Switch } from '../../components/Switch';
import { TextField } from '../../components/TextField';
import layout from '../layout.module.css';
import styles from './DeviceSettings.module.css';

/** The two states from the DeviceSettings README. */
export type DeviceSettingsState = 'connected' | 'disconnected';

export interface DeviceSettingsProps {
  /** Disconnected, every control keeps its last known value and cannot be changed. */
  state?: DeviceSettingsState;
  /** Called with the new device name when the field loses focus after a change. */
  onSaveName: (name: string) => void;
}

const brightnessLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

/** Settings of a connected device. Every change applies immediately, so there is no save button. */
export function DeviceSettings({ state = 'connected', onSaveName }: DeviceSettingsProps) {
  const [name, setName] = useState("Anna's Atlas One");
  const [savedName, setSavedName] = useState(name);
  const [vibration, setVibration] = useState(true);
  const [deviceLock, setDeviceLock] = useState(false);
  const [brightness, setBrightness] = useState('medium');
  const disconnected = state === 'disconnected';

  function saveName() {
    if (name === savedName) return;
    setSavedName(name);
    onSaveName(name);
  }

  return (
    <div className={`${layout.screen} ${layout.blocks}`}>
      <div className={layout.titleBlock}>
        <h1 className={layout.title}>Device settings</h1>
        <p className={layout.intro}>{disconnected ? 'Atlas One, not connected' : 'Atlas One, connected'}</p>
      </div>

      {disconnected && (
        <Alert title="Device not found" description="Move your device closer to the phone and try again." />
      )}

      {/* SPEC GAP: TextField has no blur callback. Blur bubbles in React, so the section catches it. */}
      <section className={layout.section} onBlur={saveName}>
        <h2 className={layout.heading}>Device</h2>
        <TextField label="Device name" value={name} onChange={setName} disabled={disconnected} />
      </section>

      <section className={layout.section}>
        <h2 className={layout.heading}>Feedback</h2>
        {/*
         * Changes apply at once, and the prototype device always confirms them.
         * SPEC GAP: a change the device does not confirm should revert and say why next to the control,
         * but Switch has no message slot (RadioGroup has error).
         */}
        <div className={styles.rows}>
          <Switch
            label="Vibration"
            description="Short vibration when a session starts."
            checked={vibration}
            onChange={setVibration}
            disabled={disconnected}
          />
          <Switch
            label="Device lock"
            description="Asks for your PIN after 5 minutes."
            checked={deviceLock}
            onChange={setDeviceLock}
            disabled={disconnected}
          />
        </div>
      </section>

      <section className={layout.section}>
        <h2 className={layout.heading}>Light</h2>
        <RadioGroup
          legend="LED brightness"
          options={brightnessLevels}
          value={brightness}
          onChange={setBrightness}
          disabled={disconnected}
        />
      </section>
    </div>
  );
}
