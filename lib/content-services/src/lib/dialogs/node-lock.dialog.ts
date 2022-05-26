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

import moment from 'moment-es6';

import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NodeBodyLock, Node, NodeEntry } from '@alfresco/js-api';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Component({
    selector: 'adf-node-lock',
    templateUrl: './node-lock.dialog.html',
    encapsulation: ViewEncapsulation.None
})
export class NodeLockDialogComponent implements OnInit {

    form: FormGroup;
    node: Node = null;
    nodeName: string;

    get nodesApi() {
        return this.apiClientsService.get('ContentClient.nodes');
    }

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialogRef<NodeLockDialogComponent>,
        private apiClientsService: ApiClientsService,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {}

    ngOnInit() {
        const { node } = this.data;
        this.nodeName = node.name;

        this.form = this.formBuilder.group({
            isLocked: node.isLocked || false,
            allowOwner: node.properties['cm:lockType'] === 'WRITE_LOCK',
            isTimeLock: !!node.properties['cm:expiryDate'],
            time: !!node.properties['cm:expiryDate'] ? moment(node.properties['cm:expiryDate']) : moment()
        });
    }

    private get lockTimeInSeconds(): number {
        if (this.form.value.isTimeLock) {
            const duration = moment.duration(moment(this.form.value.time).diff(moment()));
            return duration.asSeconds();
        }

        return 0;
    }

    private get nodeBodyLock(): NodeBodyLock {
        return new NodeBodyLock({
            timeToExpire: this.lockTimeInSeconds,
            type: this.form.value.allowOwner ? 'ALLOW_OWNER_CHANGES' : 'FULL',
            lifetime: 'PERSISTENT'
        });
    }

    private toggleLock(): Promise<NodeEntry> {
        const { data: { node } } = this;

        if (this.form.value.isLocked) {
            return this.nodesApi.lockNode(node.id, this.nodeBodyLock);
        }

        return this.nodesApi.unlockNode(node.id);
    }

    submit(): void {
        this.toggleLock()
            .then((node: NodeEntry) => {
                this.data.node.isLocked = this.form.value.isLocked;
                this.dialog.close(node.entry);
            })
            .catch((error: any) => this.data.onError(error));
    }
}
