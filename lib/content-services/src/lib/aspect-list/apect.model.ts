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

export class AspectListModel {
    list?: AspectModel;

    constructor(obj: any) {
        this.list = obj.list;
    }
}

export class AspectModel {
    pagination?: AspectPaginationModel;
    entries?: AspectEntryModel[];

    constructor(obj: any) {
        this.pagination = obj.pagination;
        this.entries = obj.entries;
    }
}

export class AspectEntryModel {
    entry?: AspectDetailModel;

    constructor(obj: any) {
        this.entry = obj.entry;
    }
}

export class AspectDetailModel {
    parentName?: string;
    name?: string;
    prefixedName?: string;
    description?: string;
    title?: string;
    properties?: AspectPropertyModel[];

    constructor(obj: any) {
        this.parentName = obj.parentName;
        this.name = obj.name;
        this.prefixedName = obj.prefixedName;
        this.description = obj.description;
        this.title = obj.title;
        this.properties = obj.properties;
    }
}

export class AspectPropertyModel {
    name?: string;
    prefixedName?: string;
    title?: string;
    dataType?: string;
    facetable?: any;
    indexTokenisationMode?: any;
    multiValued?: any;
    mandatoryEnforced?: any;
    mandatory?: any;
    indexed?: any;
    constraintRefs?: any[];

    constructor(obj: any) {
        this.name = obj.name;
        this.prefixedName = obj.prefixedName;
        this.title = obj.title;
        this.dataType = obj.dataType;
        this.facetable = obj.facetable;
        this.indexTokenisationMode = obj.indexTokenisationMode;
        this.multiValued = obj.multiValued;
        this.mandatoryEnforced = obj.mandatoryEnforced;
        this.mandatory = obj.mandatory;
        this.indexed = obj.indexed;
        this.constraintRefs = obj.constraintRefs;
    }
}

export class AspectPaginationModel {
    count?: number;
    hasMoreItems?: string;
    totalItems?: number;
    skipCount?: number;
    maxItems?: number;

    constructor(obj: any) {
        this.count = obj.count;
        this.hasMoreItems = obj.hasMoreItems;
        this.totalItems = obj.totalItems;
        this.skipCount = obj.skipCount;
        this.maxItems = obj.maxItems;
    }
}
