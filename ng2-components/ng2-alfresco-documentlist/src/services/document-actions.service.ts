/**
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

import {Injectable} from 'angular2/core';
import {ContentActionHandler} from '../models/content-action.model';
import {AlfrescoService} from './alfresco.service';

@Injectable()
export class DocumentActionsService {
    private handlers: { [id: string]: ContentActionHandler; } = {};

    constructor(private _alfrescoService: AlfrescoService) {
        this.setupActionHandlers();
    }

    getHandler(key: string): ContentActionHandler {
        if (key) {
            let lkey = key.toLowerCase();
            return this.handlers[lkey];
        }
        return null;
    }

    setHandler(key: string, handler: ContentActionHandler): void {
        if (key) {
            let lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
        }
    }

    private setupActionHandlers() {
        this.handlers['download'] = this.download.bind(this);

        // todo: just for dev/demo purposes, to be replaced with real actions
        this.handlers['system1'] = this.handleStandardAction1.bind(this);
        this.handlers['system2'] = this.handleStandardAction2.bind(this);
    }

    private handleStandardAction1(obj: any) {
        window.alert('standard document action 1');
    }

    private handleStandardAction2(obj: any) {
        window.alert('standard document action 2');
    }

    private download(obj: any) {
        if (obj && !obj.isFolder) {
            let link = document.createElement('a');
            document.body.appendChild(link);
            link.setAttribute('download', 'download');
            link.href = this._alfrescoService.getContentUrl(obj);
            link.click();
            document.body.removeChild(link);
        }
    }
}
