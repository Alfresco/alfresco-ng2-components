import { Component, TemplateRef, ViewChild } from "@angular/core";

@Component({
    standalone: true,
    selector: "adf-breadcrumb-item",
    template: `
        <ng-template #breadcrumbItemTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
})
export class BreadcrumbItemComponent {
    @ViewChild("breadcrumbItemTemplate", { static: true })
    _templateRef!: TemplateRef<any>;
}
