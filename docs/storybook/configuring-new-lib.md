# Configuring Storybook for a New Library

This guide outlines the steps to configure Storybook for a newly created Nx library within the repository.

## Prerequisites

Ensure that the library has been created using the Nx generator.

## Configuration Steps

### 1. Generate Storybook Configuration

Run the Nx generator to add Storybook configuration to your library:

```bash
nx g @nx/angular:storybook-configuration [project-name]
```

Replace `[project-name]` with the name of your library (e.g., `my-new-lib`).

### 2. Update `project.json`

Verify that the `project.json` file of your library has the `storybook` and `build-storybook` targets correctly configured.

### 3. Update `.storybook/main.ts`

Update the `.storybook/main.ts` file in your library to extend the root configuration and handle static assets correctly.

```typescript
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main'; // Adjust path to root

const config: StorybookConfig = {
    ...rootMain,
    stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
    staticDirs: [
        // Add static directories if needed, e.g., for i18n or assets
        { from: '../src/lib/i18n', to: 'assets/adf-my-lib/i18n' }
    ],
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    }
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
```

### 4. Update `.storybook/preview.ts`

Update `.storybook/preview.ts` to import the root preview configuration and add any library-specific tags.

```typescript
import { type Preview } from '@storybook/angular';
import rootPreview from '../../../.storybook/preview'; // Adjust path to root

const preview: Preview = {
    ...rootPreview,
    tags: ['autodocs']
};

export default preview;
```

### 5. Update `.storybook/tsconfig.json`

Ensure the `tsconfig.json` in the `.storybook` directory extends the main `tsconfig.json` and includes/excludes the correct files.

```json
{
    "extends": "../../../tsconfig.json",
    "compilerOptions": {
        "emitDecoratorMetadata": true
    },
    "exclude": ["../**/*.spec.ts", "../**/*.mock.ts", "../**/test.ts", "../**/*.module.ts"],
    "include": ["../src/**/*", "*.ts"]
}
```

### 6. Update Root `lib/stories`

To include the new library's stories in the aggregated Storybook (`nx run stories:storybook`), you need to update the `lib/stories/.storybook/main.ts` file.

1.  **Add Stories Pattern**: Add the path to your new library's stories in the `stories` array.
2.  **Add Static Assets**: If your library has static assets (like i18n files), add them to the `staticDirs` array.

Example update in `lib/stories/.storybook/main.ts`:

```typescript
// ...
stories: [
    // ... existing entries
    '../../my-new-lib/**/*.stories.ts'
],
staticDirs: [
    // ... existing entries
    { from: '../../my-new-lib/src/lib/i18n', to: 'assets/adf-my-lib/i18n' }
],
// ...
```

## Useful Links

- [Configure Storybook](https://storybook.js.org/docs/angular/configure/overview)
- [Framework Configuration (main.ts)](https://storybook.js.org/docs/angular/configure/framework-config)
- [Story Rendering (preview.ts)](https://storybook.js.org/docs/angular/configure/story-rendering)
