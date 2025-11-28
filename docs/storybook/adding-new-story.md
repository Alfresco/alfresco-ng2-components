# Adding a New Story

This guide describes how to create and structure a new story for a component in the Alfresco Angular Components repository.

## File Location

Story files should be co-located with the component they are documenting. This keeps the stories close to the source code and makes them easier to find and maintain.

## Naming Convention

The file should be named using the pattern:
`[component-name].stories.ts`

For example, if your component is `my-component.component.ts`, the story file should be `my-component.component.stories.ts`.

## Basic Structure

A typical story file includes:

1.  Imports for `Meta`, `Story`, `moduleMetadata` from `@storybook/angular`.
2.  The component configuration using `applicationConfig` to provide necessary dependencies.
3.  Usage of `provideStoryCore()` (or other library-specific providers) to set up the environment.

### Example

Here is an example of how to set up a basic story for a component.

```typescript
import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { MyComponent } from './my.component';
import { provideStoryCore } from '@alfresco/adf-core/testing'; // Adjust import based on your library location
import { CommonModule } from '@angular/common';

const meta: Meta<MyComponent> = {
    title: 'Core/My Component',
    component: MyComponent,
    decorators: [
        applicationConfig({
            providers: [...provideStoryCore()]
        }),
        moduleMetadata({
            imports: [MyComponent]
        })
    ],
    argTypes: {
        // Define controls for your inputs here
        label: { control: 'text' },
        isDisabled: { control: 'boolean' }
    }
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {
    args: {
        label: 'Click me',
        isDisabled: false
    }
};

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        isDisabled: true
    }
};
```

### Dependencies

The `provideStoryCore()` function helper is essential for setting up the common providers required by ADF components, such as translation services, authentication mocks, and app configuration.

If your component requires specific services not included in `provideStoryCore()`, you should add them to the `providers` array in the `applicationConfig`.

## Useful Links

- [Writing Stories](https://storybook.js.org/docs/angular/writing-stories/introduction)
- [Args and Controls](https://storybook.js.org/docs/angular/writing-stories/args)
- [Decorators](https://storybook.js.org/docs/angular/writing-stories/decorators)
- [Naming Components and Hierarchy](https://storybook.js.org/docs/angular/writing-stories/naming-components-and-hierarchy)
