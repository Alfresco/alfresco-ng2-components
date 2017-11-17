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

import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Rx';
import { CardViewItem } from '../../interface/card-view-item.interface';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { NodesApiService } from '../../services/nodes-api.service';
import { ContentMetadataService } from './content-metadata.service';

@Component({
    selector: 'adf-content-metadata',
    templateUrl: './content-metadata.component.html',
    styleUrls: ['./content-metadata.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-metadata' },
    providers: [
        CardViewUpdateService
    ],
    viewProviders: [
        ContentMetadataService,
        FileSizePipe
    ]
})
export class ContentMetadataComponent implements OnChanges, OnInit {

    @Input()
    node: MinimalNodeEntryEntity;

    @Input()
    editable: boolean = false;

    @Input()
    maxPropertiesToShow: number | null;

    properties: CardViewItem[] = [];

    constructor(private contentMetadataService: ContentMetadataService,
                private cardViewUpdateService: CardViewUpdateService,
                private nodesApi: NodesApiService) {}

    ngOnInit() {
        this.cardViewUpdateService.itemUpdated$
            .switchMap(this.saveNode.bind(this))
            .subscribe(
                node => this.node = node,
                error => this.handleError(error)
            );
    }

    ngOnChanges(): void {
        this.recalculateProperties();
    }

    private saveNode({ changed: nodeBody }): Observable<MinimalNodeEntryEntity> {
        return this.nodesApi.updateNode(this.node.id, nodeBody);
    }

    private handleError(error) {
        /*tslint:disable-next-line*/
        console.log(error);
    }

    private recalculateProperties(): void {
        let basicProperties = this.contentMetadataService.getBasicProperties(this.node);

        if (this.maxPropertiesToShow) {
            basicProperties = basicProperties.slice(0, this.maxPropertiesToShow);
        }

        this.properties = [...basicProperties];
    }
}
