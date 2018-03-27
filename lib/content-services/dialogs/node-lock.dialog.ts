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

import moment from 'moment-es6';

import { Component, Inject, OnInit, Optional, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-node-lock',
    styleUrls: ['./folder.dialog.scss'],
    templateUrl: './node-lock.dialog.html'
})
export class NodeLockDialogComponent implements OnInit {

    form: FormGroup;
    node: MinimalNodeEntryEntity = null;
    nodeName: string;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialogRef<NodeLockDialogComponent>,
        private alfrescoApi: AlfrescoApiService,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {}

    ngOnInit() {
        const { node } = this.data;
        this.nodeName = node.name;

        this.form = this.formBuilder.group({
            lockNode: node.isLocked || false,
            isTimeLock: !!node.properties['cm:expiryDate'],
            time: !!node.properties['cm:expiryDate'] ? moment(node.properties['cm:expiryDate']) : moment()
        });
    }

    private get lockTimeInSeconds() {
        if (this.form.value.isTimeLock) {
            let duration = moment.duration(moment(this.form.value.time).diff(moment()));
            return duration.asSeconds();
        }

        return 0;
    }

    private get nodeBodyLock() {
        return {
            "timeToExpire": this.lockTimeInSeconds,
            "type": "ALLOW_OWNER_CHANGES",
            "lifetime": "PERSISTENT"
        }
    }

    private toggleLock() {
        const { alfrescoApi: { nodesApi }, data: { node } } = this;

        if (this.form.value.lockNode) {
            return nodesApi.lockNode(node.id, this.nodeBodyLock);
        }

        return nodesApi.unlockNode(node.id);
    }

    submit() {
        const { dialog } = this;
        this.toggleLock().then(node => dialog.close(node.entry));
    }
}
