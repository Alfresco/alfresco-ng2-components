import type { Preview } from '@storybook/angular';
import rootPreview from '../../../.storybook/preview';

const preview: Preview = {
    ...rootPreview,
    tags: ['autodocs']
};

export default preview;
