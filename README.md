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

```bash
npm install   # or npm ci
```

This project has built-in supply chain attack protection. When you run `npm install`:

1. **Preinstall check** scans both `package.json` AND `package-lock.json` against OSV + GitHub Advisory databases
2. If malicious packages detected → installation blocked BEFORE any code runs
3. Packages install with `--ignore-scripts` (lifecycle scripts disabled for security)
4. **Post-install check** re-runs the security scan (defense in depth) and deletes `node_modules` if violations found
5. Trusted packages (esbuild, nx, husky, etc.) are rebuilt via `npm rebuild` to run their lifecycle scripts

Checking `package.json` catches new dependencies added during upgrades (e.g., `nx migrate`) before the lockfile is updated. If a malicious package is detected at any stage, installation is blocked.

To disable security checks (e.g., in CI environments):
```bash
ADF_SKIP_SECURITY_CHECK=1 npm install
```

To keep `node_modules` on violations (for debugging):
```bash
ADF_SECURITY_KEEP_NODE_MODULES=1 npm install
```

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
