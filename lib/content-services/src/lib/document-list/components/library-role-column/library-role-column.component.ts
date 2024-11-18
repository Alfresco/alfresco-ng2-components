/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Site, SiteEntry } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'adf-library-role-column',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <span class="adf-datatable-cell-value" title="{{ displayText$ | async | translate }}">
            {{ displayText$ | async | translate }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-library-role-column adf-datatable-content-cell' }
})
export class LibraryRoleColumnComponent implements OnInit {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');

    private destroyRef = inject(DestroyRef);

    constructor(private nodesApiService: NodesApiService) {}

    ngOnInit() {
        this.updateValue();

        this.nodesApiService.nodeUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((node) => {
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
        const node: SiteEntry = this.context.row.node;
        if (node?.entry) {
            const role: string = node.entry.role;
            switch (role) {
                case Site.RoleEnum.SiteManager:
                    this.displayText$.next('LIBRARY.ROLE.MANAGER');
                    break;
                case Site.RoleEnum.SiteCollaborator:
                    this.displayText$.next('LIBRARY.ROLE.COLLABORATOR');
                    break;
                case Site.RoleEnum.SiteContributor:
                    this.displayText$.next('LIBRARY.ROLE.CONTRIBUTOR');
                    break;
                case Site.RoleEnum.SiteConsumer:
                    this.displayText$.next('LIBRARY.ROLE.CONSUMER');
                    break;
                default:
                    this.displayText$.next('LIBRARY.ROLE.NONE');
                    break;
            }
        }
    }
}
