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

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { Observable, Subject, of } from 'rxjs';
import { CardViewItem, NodesApiService, LogService, CardViewUpdateService, AlfrescoApiService, NotificationService, TranslationService } from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup } from '../../interfaces/content-metadata.interfaces';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { 'class': 'adf-content-metadata' },
    encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit, OnDestroy {

    protected onDestroy$ = new Subject<boolean>();

    /** (required) The node entity to fetch metadata about */
    @Input()
    node: Node;

    /** Toggles whether the edit button should be shown */
    @Input()
    editable: boolean = false;

    /** Toggles whether to display empty values in the card view */
    @Input()
    displayEmpty: boolean = false;

    /** Toggles between expanded (ie, full information) and collapsed
     * (ie, reduced information) in the display
     */
    @Input()
    expanded: boolean = false;

    /** The multi parameter of the underlying material expansion panel, set to true to allow multi accordion to be expanded at the same time */
    @Input()
    multi = false;

    /** Name of the metadata preset, which defines aspects and their properties */
    @Input()
    preset: string;

    /** Toggles whether the metadata properties should be shown */
    @Input()
    displayDefaultProperties: boolean = true;

    /** (Optional) shows the given aspect in the expanded  card */
    @Input()
    displayAspect: string = null;

    @Input()
    displayErrors = true;

    basicProperties$: Observable<CardViewItem[]>;
    groupedProperties$: Observable<CardViewGroup[]>;

    constructor(
        private contentMetadataService: ContentMetadataService,
        private cardViewUpdateService: CardViewUpdateService,
        private nodesApiService: NodesApiService,
        private logService: LogService,
        private alfrescoApiService: AlfrescoApiService,
        private notificationService: NotificationService,
        private translationService: TranslationService
    ) {}

    ngOnInit() {
        this.cardViewUpdateService.itemUpdated$
            .pipe(
                switchMap((changes) =>
                    this.saveNode(changes).pipe(
                        catchError((err) => {
                            this.handleUpdateError(err);
                            return of(null);
                        })
                    )
                ),
                takeUntil(this.onDestroy$)
            )
            .subscribe(
                (updatedNode) => {
                    if (updatedNode) {
                        Object.assign(this.node, updatedNode);
                        this.alfrescoApiService.nodeUpdated.next(this.node);
                    }
                }
            );

        this.loadProperties(this.node);
    }

    protected handleUpdateError(error: { message: any }) {
        this.logService.error(error);

        if (this.displayErrors) {
            const statusCode = JSON.parse(error.message).error.statusCode;
            const messageKey = `METADATA.ERRORS.${statusCode}`;

            let message = this.translationService.instant(messageKey);
            if (message === messageKey) {
                message = 'METADATA.ERRORS.GENERIC';
            }

            this.notificationService.showError(message);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && !changes.node.firstChange) {
            this.loadProperties(changes.node.currentValue);
        }
    }

    private loadProperties(node: Node) {
        if (node) {
            this.basicProperties$ = this.contentMetadataService.getBasicProperties(node);
            this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(node, this.preset);
        }
    }

    private saveNode({ changed: nodeBody }): Observable<Node> {
        return this.nodesApiService.updateNode(this.node.id, nodeBody);
    }

    showGroup(group: CardViewGroup) {
        const properties = group.properties.filter((property) => {
            return !!property.displayValue;
        });

        return properties.length;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public canExpandTheCard(group: CardViewGroup): boolean {
        return group.title === this.displayAspect;
    }

    public canExpandProperties(): boolean {
        return !this.expanded || this.displayAspect === 'Properties';
    }

}
