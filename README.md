# Alfresco Application Development Framework (ADF)

## Introduction

See the [introduction page](docs/user-guide/adf-introduction.md) in our
[documentation](docs/README.md) for an overview of ADF along with links
to useful starting points.

## Prerequisites

```text
Node: 18.x
NPM: 9.x
``` 

Also, check out the tutorial: [Creating your first ADF Application](docs/tutorials/creating-your-first-adf-application.md)
for full details on what you may need to install before using ADF.

### See also

- [Node Version Manager](docs/tutorials/nvm.md)
- [CORS guide](ALFRESCOCORS.md)

## Installation

This project uses **pnpm** for package management with built-in supply chain attack protection.

```bash
pnpm install            # install all packages
pnpm run add <package>  # add a new package (with security check)
```

### Supply Chain Security

**Layer 1: pnpm script blocking**
- All lifecycle scripts (postinstall, etc.) are blocked by default
- Only trusted packages in `pnpm-workspace.yaml` can run scripts
- Protects during `pnpm install` and `pnpm add`

**Layer 2: Security database check**
- `pnpm run add` checks packages against OSV and GitHub Advisory databases BEFORE installing
- Pre-commit hook blocks commits containing known malicious packages

**Layer 3: npm blocked**
- Running `npm install` will fail - enforces pnpm usage

## Components

You can find the sources for all ADF components in the [`lib`](/lib) folder.

## Libraries

ADF Libraries list:

- [Content services](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/content-services)
- [Core](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/core)
- [Extensions](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/extensions)
- [Insights](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/insights)
- [Process Service Cloud](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/process-services-cloud)
- [Process service](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/process-services)
- [Stories](https://github.com/Alfresco/alfresco-ng2-components/tree/develop/lib/stories)

## Browser Support

All components are supported in the following browsers:

| **Browser** | **Version** |
|-------------|-------------|
| Chrome      | Latest      |
| Safari      | Latest      |
| Firefox     | Latest      |
| Edge        | Latest      |
