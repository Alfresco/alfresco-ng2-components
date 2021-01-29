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

export class ContentTypeModelEntry {
    entry?: ContentTypeModel;

    constructor(obj?: any) {
        this.entry = obj.entry;
    }
}

export class ContentTypeModel {
    id?: string;
    description?: string;
    name?: string;
    title?: string;
    parent?: string;
    prefixedName?: string;
    archive?: string;
    properties?: ContentTypeProperty[];

    constructor(obj?: any) {
        this.id = obj.id;
        this.description = obj.description;
        this.title = obj.title;
        this.name = obj.name;
        this.parent = obj.parent;
        this.prefixedName = obj.prefixedName;
        this.properties = obj.properties;
        this.archive = obj.archive;
    }
}

export class ContentTypeProperty {
    id?: string;
    title?: string;
    dataType?: string;
    defaultValue?: string;
    description?: string;
    facetable?: string;
    indexTokenisationMode?: string;
    indexed?: boolean;
    isMandatory?: boolean;
    isMandatoryEnforced?: boolean;
    isMultiValued?: boolean;
    isProtected?: boolean;

    constructor(obj?: any) {
        this.id = obj.id;
        this.dataType = obj.dataType;
        this.defaultValue = obj.defaultValue;
        this.description = obj.description;
        this.facetable = obj.facetable;
        this.indexTokenisationMode = obj.indexTokenisationMode;
        this.indexed = obj.indexed;
        this.isMandatory = obj.isMandatory;
        this.isMandatoryEnforced = obj.isMandatoryEnforced;
        this.isMultiValued = obj.isMultiValued;
        this.isProtected = obj.isProtected;
        this.title = obj.title;
    }
}
