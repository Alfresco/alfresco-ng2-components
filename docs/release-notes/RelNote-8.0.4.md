---
Title: Changelog for alfresco-ng2-components v8.0.4
---

# Changelog

- [b089b855ff](https://github.com/Alfresco/alfresco-ng2-components/commit/b089b855ff) Fix PNG signature images not rendering in the PDF viewer, by enabling the PDF.js annotation layer (`annotationMode: 1`)

The commit above is titled `Release 8.0.4` and bundles the version bump together with
the fix. The change itself is a single line in `pdf-viewer.component.ts`: the viewer was
constructed with `annotationMode: 0` (`AnnotationMode.DISABLE`), which suppresses the
annotation layer. Signature appearances are annotations, so their images never rendered.
