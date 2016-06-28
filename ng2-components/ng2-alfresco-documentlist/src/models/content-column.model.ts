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

export class ContentColumnModel {

    static TYPE_TEXT: string = 'text';
    static TYPE_DATE: string = 'date';
    static TYPE_IMAGE: string = 'image';
    // static TYPE_NUMBER: string = 'number';

    title: string;
    srTitle: string;
    source: string;
    cssClass: string;
    type: string = ContentColumnModel.TYPE_TEXT;
    format: string = 'medium';

    constructor(obj?: any) {
        if (obj) {
            this.title = obj.title;
            this.srTitle = obj.srTitle;
            this.source = obj.source;
            this.cssClass = obj.cssClass;
            this.type = obj.type || ContentColumnModel.TYPE_TEXT;
            this.format = obj.format;
        }
    }

    static getSupportedTypes(): string[] {
        return [
            ContentColumnModel.TYPE_TEXT,
            ContentColumnModel.TYPE_DATE,
            ContentColumnModel.TYPE_IMAGE
            // ContentColumnModel.TYPE_NUMBER
        ];
    }
}
