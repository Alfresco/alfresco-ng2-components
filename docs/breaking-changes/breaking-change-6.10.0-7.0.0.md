---
Title: Breaking changes, 6.10.0 -> 7.0.0
---

# Breaking changes, 6.10.0 -> 7.0.0

This document lists all the deprecated ADF v2.x components that were removed for v3.0.0:

- [PR-9317](https://github.com/Alfresco/alfresco-ng2-components/pull/9317) Move alfresco js-API and AlfrescoApi service out from the core

    Move `AlfrescoApiServiceMock` and `AlfrescoApiServiceMock` from `core` library to `content-services`, These libraries are content related therefore should not live in `core`

    To mitigate this change, we can run migration:

    ```
    npx nx migrate @alfresco/adf-core@7.0.0
    npx nx migrate --run-migrations
    ```

    Or for pure angular repository:

    ```
    npx ng update @alfresco/adf-core@7.0.0
    ```
