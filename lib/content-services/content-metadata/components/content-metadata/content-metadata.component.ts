/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable, Subscription } from 'rxjs';
import { CardViewItem, NodesApiService, LogService, CardViewUpdateService, AlfrescoApiService } from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup } from '../../interfaces/content-metadata.interfaces';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { 'class': 'adf-content-metadata' },
    encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit, OnDestroy {
    /** (required) The node entity to fetch metadata about */
    @Input()
    node: MinimalNodeEntryEntity;

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

    basicProperties$: Observable<CardViewItem[]>;
    groupedProperties$: Observable<CardViewGroup[]>;
    disposableNodeUpdate: Subscription;

    constructor(
        private contentMetadataService: ContentMetadataService,
        private cardViewUpdateService: CardViewUpdateService,
        private nodesApiService: NodesApiService,
        private logService: LogService,
        private alfrescoApiService: AlfrescoApiService
    ) {}

    ngOnInit() {
        this.disposableNodeUpdate =  this.cardViewUpdateService.itemUpdated$
            .pipe(
                switchMap(this.saveNode.bind(this))
            )
            .subscribe(
                updatedNode => {
                    Object.assign(this.node, updatedNode);
                    this.alfrescoApiService.nodeUpdated.next(this.node);
                },
                error => this.logService.error(error)
            );

        this.loadProperties(this.node);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node && !changes.node.firstChange) {
            this.loadProperties(changes.node.currentValue);
        }
    }

    private loadProperties(node: MinimalNodeEntryEntity) {
        if (node) {
            this.basicProperties$ = this.contentMetadataService.getBasicProperties(node);
            this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(node, this.preset);
        }
    }

    private saveNode({ changed: nodeBody }): Observable<MinimalNodeEntryEntity> {
        return this.nodesApiService.updateNode(this.node.id, nodeBody);
    }

    ngOnDestroy() {
        this.disposableNodeUpdate.unsubscribe();
    }

}
