import { Directive, ElementRef } from "@angular/core";

/** @internal */
@Directive({
    selector: "[adfBreadcrumbFocus]",
    host: {
        class: "adf-breadcrumb-focus",
    },
})
export class BreadcrumbFocusDirective {
    constructor(private _elementRef: ElementRef) {}

    focusOnFirstFocusableElement() {
        this._getFocusableElements(this._elementRef.nativeElement)[0].focus();
    }

    private _getFocusableElements(root: HTMLElement): HTMLElement[] {
        const allFocusableElements = `button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])`;
        return Array.from(
            root.querySelectorAll(
                allFocusableElements
            ) as NodeListOf<HTMLElement>
        ).filter(
            (element) =>
                !element.hasAttribute("disabled") && element.tabIndex >= 0
        );
    }
}
