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

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Site } from '@alfresco/js-api';
import { ShareDataRow } from '../../data/share-data-row.model';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-library-role-column',
    imports: [TranslatePipe],
    template: `
        <span class="adf-datatable-cell-value" [title]="displayText() | translate">
            {{ displayText() | translate }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-library-role-column adf-datatable-content-cell' }
})
export class LibraryRoleColumnComponent implements OnInit {
    @Input({ required: true })
    context: any;

    private readonly role = signal<string | undefined>(undefined);

    readonly displayText = computed(() => {
        const roleValue = this.role();
        switch (roleValue) {
            case Site.RoleEnum.SiteManager:
                return 'LIBRARY.ROLE.MANAGER';
            case Site.RoleEnum.SiteCollaborator:
                return 'LIBRARY.ROLE.COLLABORATOR';
            case Site.RoleEnum.SiteContributor:
                return 'LIBRARY.ROLE.CONTRIBUTOR';
            case Site.RoleEnum.SiteConsumer:
                return 'LIBRARY.ROLE.CONSUMER';
            default:
                return 'LIBRARY.ROLE.NONE';
        }
    });

    private readonly destroyRef = inject(DestroyRef);

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
        const roleValue = this.context.row.node?.entry.role ?? this.context.row.obj.role;
        this.role.set(roleValue);
    }
}
