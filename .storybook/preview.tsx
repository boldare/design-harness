import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Atlas colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      // tokens.css switches semantic colours on [data-theme] at the root element.
      document.documentElement.dataset.theme = context.globals.theme;
      return <Story />;
    },
  ],
  parameters: {
    // The canvas uses surface.page from the tokens instead of the backgrounds addon.
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      storySort: { order: ['Foundations', ['Colour', 'Type', 'Spacing'], 'Components'] },
    },
  },
};

export default preview;
