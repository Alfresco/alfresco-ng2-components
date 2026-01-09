# Using Storybook

This guide explains how to run and build Storybook for the entire repository and for individual libraries within the Alfresco Angular Components project.

## Introduction

Storybook is used in this repository to develop and showcase components in isolation. It provides a sandbox environment where you can interact with components and view their different states.

## Running All Stories

To run the aggregated Storybook that includes stories from all libraries (Core, Content Services, Process Services Cloud, etc.), use the following command:

```bash
npm run storybook
```

Once started, you can access the Storybook interface at:
[http://localhost:4400/](http://localhost:4400/)

## Building Storybook

To build the static Storybook application (e.g., for deployment), use the following command:

```bash
npm run build-storybook
```

The build artifacts will be output to `dist/storybook/stories`.

## Useful Links

- [Storybook CLI Options](https://storybook.js.org/docs/angular/api/cli-options)
- [Storybook for Angular Introduction](https://storybook.js.org/docs/angular/get-started/introduction)
