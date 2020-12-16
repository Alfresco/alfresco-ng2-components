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
import {
    CardViewItem,
    NodesApiService,
    LogService,
    CardViewUpdateService,
    AlfrescoApiService,
    TranslationService,
    AppConfigService,
    CardViewBaseItemModel
} from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup } from '../../interfaces/content-metadata.interfaces';
import { takeUntil, debounceTime, catchError } from 'rxjs/operators';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { 'class': 'adf-content-metadata' },
    encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit, OnDestroy {

    static DEFAULT_SEPARATOR = ', ';

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

    /** (optional) shows the given aspect in the expanded  card */
    @Input()
    displayAspect: string = null;

    /** Toggles whether or not to enable copy to clipboard action. */
    @Input()
    copyToClipboardAction: boolean = true;

    /** Toggles whether or not to enable chips for multivalued properties. */
    @Input()
    useChipsForMultiValueProperty: boolean = true;

    multiValueSeparator: string;
    basicProperties$: Observable<CardViewItem[]>;
    groupedProperties$: Observable<CardViewGroup[]>;

    changedProperties = {};
    hasMetadataChanged = false;
    private targetProperty: CardViewBaseItemModel;

    constructor(
        private contentMetadataService: ContentMetadataService,
        private cardViewUpdateService: CardViewUpdateService,
        private nodesApiService: NodesApiService,
        private logService: LogService,
        private alfrescoApiService: AlfrescoApiService,
        private translationService: TranslationService,
        private appConfig: AppConfigService
    ) {
        this.copyToClipboardAction = this.appConfig.get<boolean>('content-metadata.copy-to-clipboard-action');
        this.multiValueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator') || ContentMetadataComponent.DEFAULT_SEPARATOR;
        this.useChipsForMultiValueProperty = this.appConfig.get<boolean>('content-metadata.multi-value-chips');
    }

    ngOnInit() {
        this.cardViewUpdateService.itemUpdated$
            .pipe(
                debounceTime(200),
                takeUntil(this.onDestroy$))
            .subscribe(
                (updatedNode) => {
                    this.hasMetadataChanged = true;
                    this.targetProperty = updatedNode.target;
                    this.updateChanges(updatedNode.changed);
                }
            );

        this.loadProperties(this.node);
    }

    protected handleUpdateError(error: Error) {
        this.logService.error(error);

        let statusCode = 0;

        try {
            statusCode = JSON.parse(error.message).error.statusCode;
        } catch {
        }

        let message = `METADATA.ERRORS.${statusCode}`;

        if (this.translationService.instant(message) === message) {
            message = 'METADATA.ERRORS.GENERIC';
        }

        this.contentMetadataService.error.next({
            statusCode,
            message
        });
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

    updateChanges(updatedNodeChanges) {
        Object.keys(updatedNodeChanges).map((propertyGroup: string) => {
            if (typeof updatedNodeChanges[propertyGroup] === 'object') {
                this.changedProperties[propertyGroup] = {
                    ...this.changedProperties[propertyGroup],
                    ...updatedNodeChanges[propertyGroup]
                };
            } else {
                this.changedProperties[propertyGroup] = updatedNodeChanges[propertyGroup];
            }
        });
    }

    saveChanges() {
        this.nodesApiService.updateNode(this.node.id, this.changedProperties).pipe(
            catchError((err) => {
                this.cardViewUpdateService.updateElement(this.targetProperty);
                this.handleUpdateError(err);
                return of(null);
            }))
            .subscribe((updatedNode) => {
                if (updatedNode) {
                    this.revertChanges();
                    Object.assign(this.node, updatedNode);
                    this.alfrescoApiService.nodeUpdated.next(this.node);
                }
            });
    }

    revertChanges() {
        this.changedProperties = {};
        this.hasMetadataChanged = false;
    }

    cancelChanges() {
        this.revertChanges();
        this.loadProperties(this.node);
    }

    showGroup(group: CardViewGroup): boolean {
        const properties = group.properties.filter((property) => {
            return !this.isEmpty(property.displayValue);
        });

        return properties.length > 0;
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

    keyDown(event: KeyboardEvent) {
        if (event.keyCode === 37 || event.keyCode === 39) { // ArrowLeft && ArrowRight
            event.stopPropagation();
        }
    }

    private isEmpty(value: any): boolean {
        return value === undefined || value === null || value === '';
    }
}
