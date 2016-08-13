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

import { Injectable } from '@angular/core';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { TagModel } from './tag.model';

@Injectable()
export class TagService {

    constructor(private authService: AlfrescoAuthenticationService) {}

    getTags(): Promise<TagModel[]> {
        return new Promise<TagModel[]>((resolve, reject) => {
            this.authService.getAlfrescoApi().core.tagsApi.getTags({}).then(
                data => {
                    let entries = data.list.entries || [];
                    let tags = entries.map(obj => <TagModel> obj.entry);
                    resolve(tags);
                },
                err => reject(err)
            );
        });
    }

    addTags(nodeId: string, tags: { tag: string }[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.authService.getAlfrescoApi().core.tagsApi.addTag(nodeId, tags).then(
                data => resolve(data),
                err => reject(err)
            );
        });
    }

}
