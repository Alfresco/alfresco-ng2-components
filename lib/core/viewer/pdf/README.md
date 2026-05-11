# @alfresco/adf-core/viewer/pdf

Secondary entrypoint that provides the PDF viewer component, extracted from `@alfresco/adf-core` to make `pdfjs-dist` an optional dependency.

## Setup

1. Install `pdfjs-dist` (if not already present):

```bash
npm install pdfjs-dist
```

2. Add `providePdfViewer()` to your app providers:

```typescript
import { providePdfViewer } from '@alfresco/adf-core/viewer/pdf';

// Standalone app (app.config.ts)
export const appConfig: ApplicationConfig = {
    providers: [
        providePdfViewer(),
        // ...other providers
    ]
};

// NgModule-based app (app.module.ts)
@NgModule({
    providers: [providePdfViewer()]
})
export class AppModule {}
```

That's it. The viewer will render PDFs using the real `PdfViewerComponent`.

## Migration from v8.x

If upgrading from a version where `PdfViewerComponent` was part of `@alfresco/adf-core` directly, run:

```bash
ng update @alfresco/adf-core
```

The migration schematic will:
- Rewrite imports of PDF symbols (`PdfViewerComponent`, `PdfPasswordDialogComponent`, `PdfThumbListComponent`, `PdfThumbComponent`, `PDFJS_MODULE`, `PDFJS_VIEWER_MODULE`, `RenderingQueueServices`) from `@alfresco/adf-core` to `@alfresco/adf-core/viewer/pdf`
- Add `providePdfViewer()` to your app's providers array

## Opting out of PDF support

If your application does not need to render PDFs, you can skip installing `pdfjs-dist` and omit `providePdfViewer()`. The viewer will display an "unknown format" placeholder for PDF files.

## Exports

| Symbol | Description |
|--------|-------------|
| `providePdfViewer()` | Provider function that registers the PDF viewer |
| `PdfViewerComponent` | The PDF viewer component |
| `PdfPasswordDialogComponent` | Password dialog for protected PDFs |
| `PdfThumbListComponent` | PDF thumbnail list |
| `PdfThumbComponent` | Individual PDF thumbnail |
| `PDFJS_MODULE` | Injection token for pdfjs-dist library |
| `PDFJS_VIEWER_MODULE` | Injection token for pdfjs viewer module |
| `RenderingQueueServices` | Service managing PDF page render queue |

## Architecture

```
@alfresco/adf-core (primary entrypoint)
  - Exports: PDF_VIEWER_COMPONENT token, PdfViewerRef interface
  - ViewerRenderComponent injects the token via NgComponentOutlet
  - Does NOT depend on pdfjs-dist

@alfresco/adf-core/viewer/pdf (this entrypoint)
  - Imports from: @alfresco/adf-core, pdfjs-dist
  - Exports: PdfViewerComponent, providePdfViewer(), etc.
```

The dependency is one-way (secondary -> primary). The primary entrypoint never imports from this package, avoiding circular dependencies and keeping `pdfjs-dist` out of the main bundle.
