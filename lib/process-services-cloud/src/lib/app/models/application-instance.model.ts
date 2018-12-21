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

export class ApplicationInstanceModel {

    public static DEFAULT_THEME: string = 'theme-2';
    public static DEFAULT_ICON: string = 'favorite_border';

    name: string;
    createdAt: any;
    status: string;
    theme?: string;
    icon?: string;
    description?: string;
    connectors?: any;

    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name ? obj.name : null;
            this.status = obj.status ? obj.status : null;
            this.createdAt = obj.createdAt ? obj.createdAt : null;
            this.theme = obj.theme ? obj.theme : ApplicationInstanceModel.DEFAULT_THEME;
            this.icon = obj.icon ? obj.icon : ApplicationInstanceModel.DEFAULT_ICON;
            this.description = obj.description ? obj.description : null;
            this.connectors = obj.connectors ? obj.connectors : null;
        }
    }
}
