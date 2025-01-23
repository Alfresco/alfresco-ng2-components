/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, startWith } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbFocusDirective } from '../../directives/breadcrumb-focus.directive';
import { BreadcrumbItemComponent } from '../breadcrumb-item/breadcrumb-item.component';

@Component({
    selector: 'adf-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatIconModule, TranslateModule, MatButtonModule, BreadcrumbFocusDirective]
})
export class BreadcrumbComponent implements AfterContentInit, OnChanges {
    private _breadcrumbTemplateRefs: Array<TemplateRef<unknown>> = [];

    @Input()
    compact = false;

    @Output()
    compactChange: EventEmitter<boolean> = new EventEmitter();

    @ViewChildren(BreadcrumbFocusDirective)
    breadcrumbFocusItems!: QueryList<BreadcrumbFocusDirective>;

    @ContentChildren(BreadcrumbItemComponent)
    breadcrumbItems!: QueryList<BreadcrumbItemComponent>;

    selectedBreadcrumbs: Array<TemplateRef<unknown>> = [];

    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterContentInit() {
        this.breadcrumbItems.changes
            .pipe(
                startWith(this.breadcrumbItems),
                map((breadcrumbItems: QueryList<BreadcrumbItemComponent>) => this.mapToTemplateRefs(breadcrumbItems))
            )
            .subscribe((templateRefs) => {
                this._breadcrumbTemplateRefs = templateRefs;
                this.setBreadcrumbs(templateRefs);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.compact) {
            this.setBreadcrumbs(this._breadcrumbTemplateRefs);
        }
    }

    toggleCompact(compact = false) {
        this.compact = compact;
        this.setBreadcrumbs(this._breadcrumbTemplateRefs);
        this.compactChange.emit(this.compact);
        if (!compact) {
            this.breadcrumbFocusItems.get(1)?.focusOnFirstFocusableElement();
        }
    }

    private setBreadcrumbs(breadcrumbs: Array<TemplateRef<unknown>>) {
        this.selectedBreadcrumbs = this.compact && breadcrumbs.length > 2 ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]] : [...breadcrumbs];
        this.cdr.detectChanges();
    }

    private mapToTemplateRefs(breadcrumbItems: QueryList<BreadcrumbItemComponent>) {
        return breadcrumbItems.toArray().map((breadcrumbItem) => breadcrumbItem.templateRef);
    }
}
