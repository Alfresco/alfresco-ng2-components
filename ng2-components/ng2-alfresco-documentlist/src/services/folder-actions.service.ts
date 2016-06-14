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

import {Injectable} from '@angular/core';
import {ContentActionHandler} from '../models/content-action.model';
import {AlfrescoService} from './alfresco.service';

@Injectable()
export class FolderActionsService {
    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private _alfrescoService?: AlfrescoService) {
        this.setupActionHandlers();
    }

    getHandler(key: string): ContentActionHandler {
        if (key) {
            let lkey = key.toLowerCase();
            return this.handlers[lkey] || null;
        }
        return null;
    }

    setHandler(key: string, handler: ContentActionHandler): void {
        if (key) {
            let lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
        }
    }

    canExecuteAction(obj: any): boolean {
        return this._alfrescoService && obj && obj.entry.isFolder === true;
    }

    private setupActionHandlers() {
        this.handlers['delete'] = this.deleteNode.bind(this);

        // TODO: for demo purposes only, will be removed during future revisions
        this.handlers['system1'] = this.handleStandardAction1.bind(this);
        this.handlers['system2'] = this.handleStandardAction2.bind(this);
    }

    // TODO: for demo purposes only, will be removed during future revisions
    private handleStandardAction1(document: any) {
        window.alert('standard folder action 1');
    }

    // TODO: for demo purposes only, will be removed during future revisions
    private handleStandardAction2(document: any) {
        window.alert('standard folder action 2');
    }

    private deleteNode(obj: any, target?: any) {
        if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
            this._alfrescoService.deleteNode(obj.entry.id).subscribe(() => {
                if (target && typeof target.reload === 'function') {
                    target.reload();
                }
            });
        }
    }
}
