import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { BreadcrumbItemComponent } from "./components/breadcrumb-item/breadcrumb-item.component";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { BreadcrumbFocusDirective } from "./directives/breadcrumb-focus.directive";

@NgModule({
    declarations: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        BreadcrumbFocusDirective,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        // HyMaterialIconModule,
        // HyTranslateModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    exports: [BreadcrumbComponent, BreadcrumbItemComponent],
})
export class BreadcrumbModule {}
