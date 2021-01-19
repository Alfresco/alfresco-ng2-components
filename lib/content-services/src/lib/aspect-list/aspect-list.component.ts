/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { NodesApiService } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { AspectListService } from './aspect-list.service';
import { AspectEntryModel } from './apect.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
@Component({
    selector: 'adf-aspect-list',
    templateUrl: './aspect-list.component.html',
    styleUrls: ['./aspect-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AspectListComponent implements OnInit, OnDestroy {

    @Input()
    nodeId: string = '';

    @Output()
    valueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

    propertyColumns: string[] = ['name', 'title', 'dataType'];
    aspects$: Observable<AspectEntryModel[]> = null;
    nodeAspects: string[] = [];
    nodeAspectStatus: string[] = null;

    private onDestroy$ = new Subject<boolean>();

    constructor(private aspectListService: AspectListService, private nodeApiService: NodesApiService) {

    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnInit(): void {
        if (this.nodeId) {
            this.aspects$ = this.nodeApiService.getNode(this.nodeId).pipe(
                tap((node) => {
                    this.nodeAspects = node.aspectNames.filter((aspect) => this.aspectListService.getVisibleAspects().includes(aspect));
                    this.nodeAspectStatus = Array.from(node.aspectNames);
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
        this.valueChanged.emit(this.nodeAspects);
    }

    reset() {
        if (this.nodeAspectStatus && this.nodeAspectStatus.length > 0) {
            this.nodeAspects.splice(0, this.nodeAspects.length, ...this.nodeAspectStatus);
            this.valueChanged.emit(this.nodeAspects);
        } else {
            this.clear();
        }
    }

    clear() {
        this.nodeAspects = [];
        this.valueChanged.emit(this.nodeAspects);
    }
}
