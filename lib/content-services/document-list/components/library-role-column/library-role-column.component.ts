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

import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';

@Component({
    selector: 'adf-library-role-column',
    template: `
        <span title="{{ (displayText$ | async) | translate }}">
            {{ (displayText$ | async) | translate }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-library-role-column' }
})
export class LibraryRoleColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');

    private sub: Subscription;

    constructor(private api: AlfrescoApiService) {}

    ngOnInit() {
        this.updateValue();

        this.sub = this.api.nodeUpdated.subscribe((node: Node) => {
            const row: ShareDataRow = this.context.row;
            if (row) {
                const { entry } = row.node;

                if (entry === node) {
                    row.node = { entry };
                    this.updateValue();
                }
            }
        });
    }

    protected updateValue() {
        const node = this.context.row.node;
        if (node && node.entry) {
            const role: string = node.entry.role;
            switch (role) {
                case 'SiteManager':
                    this.displayText$.next('LIBRARY.ROLE.MANAGER');
                    break;
                case 'SiteCollaborator':
                    this.displayText$.next('LIBRARY.ROLE.COLLABORATOR');
                    break;
                case 'SiteContributor':
                    this.displayText$.next('LIBRARY.ROLE.CONTRIBUTOR');
                    break;
                case 'SiteConsumer':
                    this.displayText$.next('LIBRARY.ROLE.CONSUMER');
                    break;
                default:
                    this.displayText$.next('');
                    break;
            }
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }
}
