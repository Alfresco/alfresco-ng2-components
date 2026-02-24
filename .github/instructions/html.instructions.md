---
applyTo: "**/*.html"
---

# HTML Development Standards

* Simple Templates: Keep templates as simple as possible, avoiding complex logic directly in the template. Delegate complex logic to the component's TypeScript code.
* Native Control Flow: Use the new built-in control flow syntax (`@if`, `@for`, `@switch`) instead of the older structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).
* NgOptimizedImage: Use `NgOptimizedImage` for all static images to automatically optimize image loading and performance.
* Async Pipe: Use the `async` pipe to handle observables in templates. This automatically subscribes and unsubscribes, preventing memory leaks.
* Prefer pipes over functions in templates for performance reasons, as pipes are only re-evaluated when their inputs change.

## Accessibility Standards

* Add `alt` text to all images
* Label form inputs with `<mat-label>` or `aria-label`
* Ensure interactive elements have accessible names
* Add `role`, `aria-labelledby`, and `aria-describedby` when semantic HTML isn't sufficient
* All interactive elements must be keyboard accessible
* Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text
* Use `aria-live="polite"` for status updates
* Watch out for misused/non-semantic elements (e.g., <div> instead of <section>)
* Avoid broken heading hierarchy (e.g., h1 → h3 without h2)
