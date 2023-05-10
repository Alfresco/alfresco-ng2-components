import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChildren,
} from "@angular/core";
import { map, startWith } from "rxjs/operators";

import { BreadcrumbFocusDirective } from "../../directives/breadcrumb-focus.directive";
import { BreadcrumbItemComponent } from "../breadcrumb-item/breadcrumb-item.component";

@Component({
    selector: "adf-breadcrumb",
    templateUrl: "./breadcrumb.component.html",
    styleUrls: ["./breadcrumb.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements AfterContentInit, OnChanges {
    private _breadcrumbTemplateRefs: Array<TemplateRef<unknown>> = [];

    @Input()
    compact = false;

    @Output()
    compactChange: EventEmitter<boolean> = new EventEmitter();

    @ViewChildren(BreadcrumbFocusDirective)
    _breadcrumbFocusItems!: QueryList<BreadcrumbFocusDirective>;

    @ContentChildren(BreadcrumbItemComponent)
    _breadcrumbItems!: QueryList<BreadcrumbItemComponent>;

    _selectedBreadcrumbs: Array<TemplateRef<unknown>> = [];

    constructor(private _cdr: ChangeDetectorRef) {}

    ngAfterContentInit() {
        this._breadcrumbItems.changes
            .pipe(
                startWith(this._breadcrumbItems),
                map((breadcrumbItems: QueryList<BreadcrumbItemComponent>) =>
                    this._mapToTemplateRefs(breadcrumbItems)
                )
            )
            .subscribe((templateRefs) => {
                this._breadcrumbTemplateRefs = templateRefs;
                this._setBreadcrumbs(templateRefs);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.compact) {
            this._setBreadcrumbs(this._breadcrumbTemplateRefs);
        }
    }

    _toggleCompact(compact = false) {
        this.compact = compact;
        this._setBreadcrumbs(this._breadcrumbTemplateRefs);
        this.compactChange.emit(this.compact);
        if (!compact) {
            this._breadcrumbFocusItems.get(1)?.focusOnFirstFocusableElement();
        }
    }

    private _setBreadcrumbs(breadcrumbs: Array<TemplateRef<unknown>>) {
        this._selectedBreadcrumbs =
            this.compact && breadcrumbs.length > 2
                ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
                : [...breadcrumbs];
        this._cdr.detectChanges();
    }

    private _mapToTemplateRefs(
        breadcrumbItems: QueryList<BreadcrumbItemComponent>
    ) {
        return breadcrumbItems
            .toArray()
            .map((breadcrumbItem) => breadcrumbItem._templateRef);
    }
}
