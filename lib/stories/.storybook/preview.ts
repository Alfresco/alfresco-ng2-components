import type { Preview } from '@storybook/angular';

const preview: Preview = {
    parameters: {
        docs: { inlineStories: true },
        controls: { expanded: true }
    },
    tags: ['autodocs']
};

export default preview;
