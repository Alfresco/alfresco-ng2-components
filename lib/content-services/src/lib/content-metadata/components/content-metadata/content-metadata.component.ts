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
import { Observable, Subject, of, zip } from 'rxjs';
import {
    CardViewItem,
    LogService,
    TranslationService,
    AppConfigService,
    CardViewBaseItemModel,
    UpdateNotification
} from '@alfresco/adf-core';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { CardViewGroup, PresetConfig } from '../../interfaces/content-metadata.interfaces';
import { takeUntil, debounceTime, catchError, map } from 'rxjs/operators';
import { CardViewContentUpdateService } from '../../../common/services/card-view-content-update.service';
import { NodesApiService } from '../../../common/services/nodes-api.service';

const DEFAULT_SEPARATOR = ', ';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    host: { class: 'adf-content-metadata' },
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

    /** Name or configuration of the metadata preset, which defines aspects and their properties */
    @Input()
    preset: string | PresetConfig;

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
        private cardViewContentUpdateService: CardViewContentUpdateService,
        private nodesApiService: NodesApiService,
        private logService: LogService,
        private translationService: TranslationService,
        private appConfig: AppConfigService
    ) {
        this.copyToClipboardAction = this.appConfig.get<boolean>('content-metadata.copy-to-clipboard-action');
        this.multiValueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator') || DEFAULT_SEPARATOR;
        this.useChipsForMultiValueProperty = this.appConfig.get<boolean>('content-metadata.multi-value-chips');
    }

    ngOnInit() {
        this.cardViewContentUpdateService.itemUpdated$
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$))
            .subscribe(
                (updatedNode: UpdateNotification) => {
                    this.hasMetadataChanged = true;
                    this.targetProperty = updatedNode.target;
                    this.updateChanges(updatedNode.changed);
                }
            );

        this.cardViewContentUpdateService.updatedAspect$.pipe(
            debounceTime(500),
            takeUntil(this.onDestroy$))
            .subscribe((node) => this.loadProperties(node));

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
            this.basicProperties$ = this.getProperties(node);
            this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(node, this.preset);
        }
    }

    private getProperties(node: Node) {
        const properties$ = this.contentMetadataService.getBasicProperties(node);
        const contentTypeProperty$ = this.contentMetadataService.getContentTypeProperty(node);
        return zip(properties$, contentTypeProperty$)
            .pipe(map(([properties, contentTypeProperty]) => {
                const filteredProperties = contentTypeProperty.filter((property) => properties.findIndex((baseProperty) => baseProperty.key === property.key) === -1);
                return [...properties, ...filteredProperties];
            }));
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
        if (this.hasContentTypeChanged(this.changedProperties)) {
            this.contentMetadataService.openConfirmDialog(this.changedProperties).subscribe(() => {
                this.updateNode();
            });
        } else {
            this.updateNode();
        }
    }

    private updateNode() {
        this.nodesApiService.updateNode(this.node.id, this.changedProperties).pipe(
            catchError((err) => {
                this.cardViewContentUpdateService.updateElement(this.targetProperty);
                this.handleUpdateError(err);
                return of(null);
            }))
            .subscribe((updatedNode) => {
                if (updatedNode) {
                    if (this.hasContentTypeChanged(this.changedProperties)) {
                        this.cardViewContentUpdateService.updateNodeAspect(this.node);
                    }
                    this.revertChanges();
                    Object.assign(this.node, updatedNode);
                    this.nodesApiService.nodeUpdated.next(this.node);
                }
            });
    }

    private hasContentTypeChanged(changedProperties): boolean {
        return !!changedProperties?.nodeType;
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
        const properties = group.properties.filter((property) => !this.isEmpty(property.displayValue));

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
