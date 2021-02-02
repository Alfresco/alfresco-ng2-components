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

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentTypeModelEntry } from './content-type.model';

const elementContent: ContentTypeModelEntry = {
    entry: {
        id: 'cm:content',
        title: 'Content',
        description: 'Binary Content',
        parent: 'cm:object',
        archive: 'true',
        properties: [
            {
                dataType: 'd:content',
                defaultValue: '',
                id: 'd:content',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                isProtected: false,
                title: 'Content'
            },
            {
                dataType: 'd:text',
                defaultValue: '',
                id: 'cm:name',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                isProtected: false,
                title: 'PropertyA'
            }
        ]
    }
};

const elementFolder: ContentTypeModelEntry = {
    entry: {
        id: 'cm:folder',
        title: 'Folder',
        description: 'Basic Folder',
        parent: 'cm:object',
        archive: 'true',
        properties: [
            {
                dataType: 'd:text',
                defaultValue: '',
                id: 'cm:name',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                isProtected: false,
                title: 'PropertyA'
            },
            {
                dataType: 'd:text',
                defaultValue: '',
                id: 'cm:name2',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                isProtected: false,
                title: 'PropertyB'
            },
            {
                dataType: 'd:text',
                defaultValue: '',
                id: 'cm:name3',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                isProtected: false,
                title: 'PropertyC'
            }
        ]
    }
};

const elementCustom: ContentTypeModelEntry = {
    entry: {
        id: 'ck:pippobaudo',
        title: 'PIPPO-BAUDO',
        description: 'Doloro reaepgfihawpefih peahfa powfj p[qwofhjaq[ fq[owfj[qowjf[qowfgh[qowh f[qowhfj [qwohf',
        parent: 'cm:content',
        properties: [
            {
                dataType: 'ck:propA',
                defaultValue: 'HERE I AM',
                description: 'A property',
                indexTokenisationMode: 'TRUE',
                indexed: true,
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyA'
            },
            {
                dataType: 'ck:propB',
                defaultValue: 'HERE I AM',
                description: 'A property',
                indexTokenisationMode: 'TRUE',
                indexed: true,
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyB'
            },
            {
                dataType: 'ck:propC',
                defaultValue: 'HERE I AM',
                description: 'A property',
                indexTokenisationMode: 'TRUE',
                indexed: true,
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyC'
            }
        ]
    }
};

const customTypes: Map<string, ContentTypeModelEntry> = new Map([['cm:content', elementContent], ['cm:folder', elementFolder], ['ck:pippobaudo', elementCustom]]);

@Injectable({
    providedIn: 'root'
})
export class ContentTypeService {

    constructor() {
    }

    getContentTypeByPrefix(prefixedType: string): Observable<ContentTypeModelEntry> {
        if (prefixedType) {
            return of(customTypes.get(prefixedType));
        } else {
            return of(null);
        }
    }

    getContentTypeChildren(nodeType: string): Observable<ContentTypeModelEntry[]> {
        if (nodeType) {
            return of([elementContent, elementFolder, elementCustom]);
        } else {
            return of([]);
        }

    }
}
