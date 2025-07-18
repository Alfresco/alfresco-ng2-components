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

import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NodesApiService } from '../common/services/nodes-api.service';
import { EMPTY, Observable, zip } from 'rxjs';
import { concatMap, expand, map, reduce, take, tap } from 'rxjs/operators';
import { AspectListService, CustomAspectsWhere, StandardAspectsWhere } from './services/aspect-list.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { AspectEntry, ContentPagingQuery, ListAspectsOpts } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-aspect-list',
    imports: [CommonModule, MatExpansionModule, MatCheckboxModule, MatTableModule, TranslatePipe, MatProgressSpinnerModule],
    templateUrl: './aspect-list.component.html',
    styleUrls: ['./aspect-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AspectListComponent implements OnInit {
    /** Node Id of the node that we want to update */
    @Input({ required: true })
    nodeId: string = '';

    /** List of aspects' ids which should not be displayed. */
    @Input()
    excludedAspects?: string[] = [];

    /** Emitted every time the user select a new aspect */
    @Output()
    valueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

    /** Emitted every time the number of selected aspects changes */
    @Output()
    updateCounter: EventEmitter<number> = new EventEmitter<number>();

    propertyColumns: string[] = ['name', 'title', 'dataType'];
    aspects$: Observable<AspectEntry[]> = null;
    nodeAspects: string[] = [];
    nodeAspectStatus: string[] = [];
    notDisplayedAspects: string[] = [];
    hasEqualAspect: boolean = true;
    isPanelOpen: boolean[] = [];

    private readonly destroyRef = inject(DestroyRef);

    private customAspectsLoaded = 0;
    private standardAspectsLoaded = 0;
    private hasMoreAspects = false;

    constructor(private aspectListService: AspectListService, private nodeApiService: NodesApiService) {}

    ngOnInit(): void {
        let aspects$: Observable<AspectEntry[]>;
        if (this.nodeId) {
            const node$ = this.nodeApiService.getNode(this.nodeId);
            const customAspect$ = this.aspectListService
                .getAspects(this.aspectListService.getVisibleAspects(), {
                    where: CustomAspectsWhere,
                    include: ['properties'],
                    skipCount: 0,
                    maxItems: 100
                })
                .pipe(map((customAspects) => customAspects?.list?.entries.flatMap((customAspect) => customAspect.entry.id)));
            aspects$ = zip(node$, customAspect$).pipe(
                tap(([node, customAspects]) => {
                    this.nodeAspects = node.aspectNames.filter(
                        (aspect) => this.aspectListService.getVisibleAspects().includes(aspect) || customAspects.includes(aspect)
                    );
                    this.nodeAspectStatus = [...this.nodeAspects];
                    this.notDisplayedAspects = node.aspectNames.filter(
                        (aspect) => !this.aspectListService.getVisibleAspects().includes(aspect) && !customAspects.includes(aspect)
                    );
                    this.valueChanged.emit([...this.nodeAspects, ...this.notDisplayedAspects]);
                    this.updateCounter.emit(this.nodeAspects.length);
                }),
                concatMap(() => this.loadAspects({ skipCount: this.standardAspectsLoaded }, { skipCount: this.customAspectsLoaded })),
                takeUntilDestroyed(this.destroyRef)
            );
        } else {
            aspects$ = this.loadAspects({ skipCount: this.standardAspectsLoaded }, { skipCount: this.customAspectsLoaded });
        }
        this.aspects$ = aspects$.pipe(
            expand(() =>
                this.hasMoreAspects ? this.loadAspects({ skipCount: this.standardAspectsLoaded }, { skipCount: this.customAspectsLoaded }) : EMPTY
            ),
            map((aspects) => aspects.filter((aspect) => !this.excludedAspects.includes(aspect.entry.id))),
            reduce((acc, aspects) => [...acc, ...aspects])
        );
    }

    onCheckBoxClick(event: Event) {
        event.stopImmediatePropagation();
    }

    onChange(change: MatCheckboxChange, prefixedName: string) {
        if (change.checked) {
            this.nodeAspects.push(prefixedName);
        } else {
            this.nodeAspects.splice(this.nodeAspects.indexOf(prefixedName), 1);
        }
        this.updateEqualityOfAspectList();
        this.valueChanged.emit([...this.nodeAspects, ...this.notDisplayedAspects]);
        this.updateCounter.emit(this.nodeAspects.length);
    }

    reset() {
        if (this.nodeAspectStatus && this.nodeAspectStatus.length > 0) {
            this.nodeAspects.splice(0, this.nodeAspects.length, ...this.nodeAspectStatus);
            this.hasEqualAspect = true;
            this.valueChanged.emit([...this.nodeAspects, ...this.notDisplayedAspects]);
            this.updateCounter.emit(this.nodeAspects.length);
        } else {
            this.clear();
        }
    }

    clear() {
        this.nodeAspects = [];
        this.updateEqualityOfAspectList();
        this.valueChanged.emit([...this.nodeAspects, ...this.notDisplayedAspects]);
        this.updateCounter.emit(this.nodeAspects.length);
    }

    getId(aspect: any): string {
        return aspect?.entry?.title ? aspect?.entry?.title : aspect?.entry?.id.replace(':', '-');
    }

    getTitle(aspect: any): string {
        return aspect?.entry?.title ? aspect?.entry?.title : aspect?.entry?.id;
    }

    private updateEqualityOfAspectList() {
        if (this.nodeAspectStatus.length !== this.nodeAspects.length) {
            this.hasEqualAspect = false;
        } else {
            this.hasEqualAspect = this.nodeAspects.every((aspect) => this.nodeAspectStatus.includes(aspect));
        }
    }

    private loadAspects(standardAspectsPagination?: ContentPagingQuery, customAspectsPagination?: ContentPagingQuery): Observable<AspectEntry[]> {
        const standardAspectOpts: ListAspectsOpts = {
            where: StandardAspectsWhere,
            include: ['properties'],
            skipCount: standardAspectsPagination?.skipCount ?? 0,
            maxItems: 100
        };
        const customAspectOpts: ListAspectsOpts = {
            where: CustomAspectsWhere,
            include: ['properties'],
            skipCount: customAspectsPagination?.skipCount ?? 0,
            maxItems: 100
        };
        return this.aspectListService.getAllAspects(standardAspectOpts, customAspectOpts).pipe(
            take(1),
            tap((aspectsPaging) => {
                this.customAspectsLoaded += aspectsPaging.customAspectPaging?.list?.pagination?.count ?? 0;
                this.standardAspectsLoaded += aspectsPaging.standardAspectPaging?.list?.pagination?.count ?? 0;
                this.hasMoreAspects =
                    aspectsPaging.customAspectPaging?.list?.pagination?.hasMoreItems ||
                    aspectsPaging.standardAspectPaging?.list?.pagination?.hasMoreItems;
            }),
            map((aspectsPaging) => [
                ...(aspectsPaging.standardAspectPaging?.list?.entries ?? []),
                ...(aspectsPaging.customAspectPaging?.list?.entries ?? [])
            ])
        );
    }
}
