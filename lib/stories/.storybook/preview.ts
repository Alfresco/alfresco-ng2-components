import { type Preview, type AngularRenderer, moduleMetadata } from '@storybook/angular';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { withThemeByClassName } from '@storybook/addon-themes';

const preview: Preview = {
    parameters: {
        docs: { inlineStories: true },
        controls: { expanded: true },
        layout: 'centered'
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
        }),
        withThemeByClassName<AngularRenderer>({
            themes: {
                light: 'adf-storybook-light-theme',
                dark: 'adf-storybook-dark-theme'
            },
            defaultTheme: 'light'
        })
    ],
    tags: ['autodocs']
};

export default preview;
