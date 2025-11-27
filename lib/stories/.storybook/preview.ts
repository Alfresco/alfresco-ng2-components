import { type Preview, moduleMetadata } from '@storybook/angular';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const preview: Preview = {
    parameters: {
        docs: { inlineStories: true },
        controls: { expanded: true }
    },
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
                    useValue: {
                        appearance: 'outline'
                    }
                }
            ]
        })
    ],
    tags: ['autodocs']
};

export default preview;
