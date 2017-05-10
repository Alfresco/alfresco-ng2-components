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

export class ContentActionModel {
    icon: string;
    title: string;
    handler: ContentActionHandler;
    target: string;
    permission: string;
    disableWithNoPermission: boolean;
    disabled: boolean;

    constructor(obj?: any) {
        if (obj) {
            this.icon = obj.icon;
            this.title = obj.title;
            this.handler = obj.handler;
            this.target = obj.target;
            this.permission = obj.permission;
            this.disableWithNoPermission = obj.disableWithNoPermission;
        }
    }
}

export interface ContentActionHandler {
    (obj: any, target?: any, permission?: string): any;
}

export class DocumentActionModel extends ContentActionModel {
    constructor(json?: any)  {
        super(json);
        this.target = 'document';
    }
}

export class FolderActionModel extends  ContentActionModel {
    constructor(json?: any)  {
        super(json);
        this.target = 'folder';
    }
}
