# Api Factories

## Basic usage

```typescript
import { JsApiLegacyFactoriesModule } from '@alfresco/adf-core';
```

```typescript
 import { AboutApiFactory, ABOUT_API_FACTORY_TOKEN } from '@alfresco/adf-core';
 
 @Inject(ABOUT_API_FACTORY_TOKEN) private aboutApiFactory: AboutApiFactory
 ...
 const aboutApi = this.aboutApiFactory.get();
```
