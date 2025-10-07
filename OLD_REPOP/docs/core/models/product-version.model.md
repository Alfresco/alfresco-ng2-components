---
Title: Product Version model
Added: v2.0.0
Status: Active
---

# [Product Version model](../../../lib/core/src/lib/models/product-version.model.ts "Defined in product-version.model.ts")

Contains version and license information classes for Alfresco products.

## Details

The classes in this model contain details about the version and license
status of Process Services and Content Services. You can access this
information from ADF using the [Discovery Api service](../services/discovery-api.service.md).
See also the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-discovery-rest-api)
to learn more about the REST architecture that the service is based on.

```ts
class BpmProductVersionModel {
    edition: string;
    majorVersion: string;
    revisionVersion: string;
    minorVersion: string;
    type: string;
}

class EcmProductVersionModel {
    edition: string;
    version: VersionModel;
    license: LicenseModel;
    status: VersionStatusModel;
    modules: VersionModuleModel[] = [];
}

class VersionModel {
    major: string;
    minor: string;
    patch: string;
    hotfix: string;
    schema: number;
    label: string;
    display: string;
}

class LicenseModel {
    issuedAt: string;
    expiresAt: string;
    remainingDays: number;
    holder: string;
    mode: string;
    isClusterEnabled: boolean;
    isCryptodocEnabled: boolean;
}

class VersionStatusModel {
    isReadOnly: boolean;
    isAuditEnabled: boolean;
    isQuickShareEnabled: boolean;
    isThumbnailGenerationEnabled: boolean;
}

class VersionModuleModel {
    id: string;
    title: string;
    description: string;
    version: string;
    installDate: string;
    installState: string;
    versionMin: string;
    versionMax: string;
}
```

## See also

-   [Discovery api service](../services/discovery-api.service.md)
