/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NodesApiService } from  '../common/services/nodes-api.service';
import { Observable, Subject, zip } from 'rxjs';
import { concatMap, map, takeUntil, tap } from 'rxjs/operators';
import { AspectListService } from './services/aspect-list.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AspectEntry } from '@alfresco/js-api';
@Component({
    selector: 'adf-aspect-list',
    templateUrl: './aspect-list.component.html',
    styleUrls: ['./aspect-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AspectListComponent implements OnInit, OnDestroy {

    /** Node Id of the node that we want to update */
    @Input()
    nodeId: string = '';

    /** Emitted every time the user select a new aspect */
    @Output()
    valueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

    propertyColumns: string[] = ['name', 'title', 'dataType'];
    aspects$: Observable<AspectEntry[]> = null;
    nodeAspects: string[] = [];
    nodeAspectStatus: string[] = [];
    hasEqualAspect: boolean = true;

    private onDestroy$ = new Subject<boolean>();

    constructor(private aspectListService: AspectListService, private nodeApiService: NodesApiService) {
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnInit(): void {
        if (this.nodeId) {
            const node$ = this.nodeApiService.getNode(this.nodeId);
            const customAspect$ = this.aspectListService.getCustomAspects()
            .pipe(map(
                (customAspects) => customAspects.flatMap((customAspect) => customAspect.entry.id)
            ));
            this.aspects$ = zip(node$, customAspect$).pipe(
                tap(([node, customAspects]) => {
                    this.nodeAspects = node.aspectNames.filter((aspect) => this.aspectListService.getVisibleAspects().includes(aspect) || customAspects.includes(aspect));
                    this.nodeAspectStatus = [ ...this.nodeAspects ];
                    this.valueChanged.emit(this.nodeAspects);
                }),
                concatMap(() => this.aspectListService.getAspects()),
                takeUntil(this.onDestroy$));
        } else {
            this.aspects$ = this.aspectListService.getAspects()
                .pipe(takeUntil(this.onDestroy$));
        }
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
        this.valueChanged.emit(this.nodeAspects);
    }

    reset() {
        if (this.nodeAspectStatus && this.nodeAspectStatus.length > 0) {
            this.nodeAspects.splice(0, this.nodeAspects.length, ...this.nodeAspectStatus);
            this.hasEqualAspect = true;
            this.valueChanged.emit(this.nodeAspects);
        } else {
            this.clear();
        }
    }

    clear() {
        this.nodeAspects = [];
        this.updateEqualityOfAspectList();
        this.valueChanged.emit(this.nodeAspects);
    }

    getId(aspect: any): string {
        return aspect?.entry?.title ? aspect?.entry?.title : aspect?.entry?.id.replace(':', '-');
    }

    getTitle(aspect: any): string {
        return aspect?.entry?.title ? aspect?.entry?.title : aspect?.entry?.id;
    }

    private updateEqualityOfAspectList() {
        if (this.nodeAspectStatus.length !== this.nodeAspects.length) {
            this.hasEqualAspect =  false;
        } else {
            this.hasEqualAspect = this.nodeAspects.every((aspect) => this.nodeAspectStatus.includes(aspect));
        }
    }
}
