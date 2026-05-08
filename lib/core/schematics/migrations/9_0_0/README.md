# Migration Schematic: migrate-pdf-viewer-imports (v9.0.0)

Automatically migrates consumer projects from the monolithic `@alfresco/adf-core` PDF viewer to the new `@alfresco/adf-core/viewer/pdf` secondary entrypoint.

## What it does

### 1. Rewrites imports

Moves PDF-related symbols from `@alfresco/adf-core` to `@alfresco/adf-core/viewer/pdf`:

**Before:**
```typescript
import { AppConfigService, PdfViewerComponent, RenderingQueueServices } from '@alfresco/adf-core';
```

**After:**
```typescript
import { AppConfigService } from '@alfresco/adf-core';
import { PdfViewerComponent, RenderingQueueServices } from '@alfresco/adf-core/viewer/pdf';
```

Affected symbols:
- `PdfViewerComponent`
- `PdfPasswordDialogComponent`
- `PdfThumbListComponent`
- `PdfThumbComponent`
- `PDFJS_MODULE`
- `PDFJS_VIEWER_MODULE`
- `RenderingQueueServices`

### 2. Adds `providePdfViewer()` to app providers

The PDF viewer now requires explicit registration via the `providePdfViewer()` provider function. The schematic automatically adds it to the consumer's application configuration.

**Standalone app (`app.config.ts`):**
```typescript
import { providePdfViewer } from '@alfresco/adf-core/viewer/pdf';

export const appConfig: ApplicationConfig = {
    providers: [providePdfViewer(), /* ...existing providers */]
};
```

**NgModule app (`app.module.ts`):**
```typescript
import { providePdfViewer } from '@alfresco/adf-core/viewer/pdf';

@NgModule({
    providers: [providePdfViewer()]
})
export class AppModule {}
```

## How it runs

Triggered automatically via `ng update @alfresco/adf-core` when upgrading to v9.0.0+.

Can also be run manually:
```bash
ng generate @alfresco/adf-core:migrate-pdf-viewer-imports
```

## File discovery

The schematic scans all `.ts` files in the project (excluding `node_modules`, `.git`, `.angular`, `.nxcache`) and processes any file containing one of the PDF symbols listed above.

For provider injection, it searches for the app config file in this order:
1. `src/app/app.config.ts`
2. `src/app/app.module.ts`
3. `src/main.ts`
4. Falls back to scanning for any file containing `bootstrapApplication` or `ApplicationConfig`

## Edge cases handled

| Scenario | Behavior |
|----------|----------|
| Existing `@alfresco/adf-core/viewer/pdf` import | Merges moved symbols into it (deduplicates) |
| All symbols in the core import are PDF symbols | Removes the entire `@alfresco/adf-core` import |
| `providePdfViewer` already present in the project | Skips provider injection |
| No app config file found | Skips provider injection (consumer must add manually) |
| File has no PDF symbols | Skipped entirely (no modifications) |
| Empty providers array | Inserts `providePdfViewer()` as the first element |

## Why this migration exists

In v9.0.0, the PDF viewer was extracted into a secondary entrypoint (`@alfresco/adf-core/viewer/pdf`) so that:
- `pdfjs-dist` becomes an optional peer dependency
- Applications that don't use PDF viewing avoid bundling ~500KB of PDF processing code
- The primary `@alfresco/adf-core` bundle stays lean

Without this schematic, consumers upgrading to v9 would see PDF files rendered as "unknown format" because the `PDF_VIEWER_COMPONENT` injection token defaults to `null` when `providePdfViewer()` is not called.
