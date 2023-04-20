/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export const presetsDefaultModel = {
    '-trashcan-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'name',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'path',
            type: 'location',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.LOCATION',
            sortable: true
        },
        {
            key: 'content.sizeInBytes',
            type: 'fileSize',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SIZE',
            sortable: true
        },
        {
            key: 'archivedAt',
            type: 'date',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.DELETED_ON',
            format: 'timeAgo',
            sortable: true
        },
        {
            key: 'archivedByUser.displayName',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.DELETED_BY',
            sortable: true
        }
    ],
    '-sites-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'title',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'visibility',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.STATUS',
            sortable: true
        }
    ],
    '-mysites-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'title',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'visibility',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.STATUS',
            sortable: true
        }
    ],
    '-favorites-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'name',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'path',
            type: 'location',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.LOCATION',
            sortable: true
        },
        {
            key: 'content.sizeInBytes',
            type: 'fileSize',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SIZE',
            sortable: true
        },
        {
            key: 'modifiedAt',
            type: 'date',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_ON',
            format: 'timeAgo',
            sortable: true
        },
        {
            key: 'modifiedByUser.displayName',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_BY',
            sortable: true
        }
    ],
    '-recent-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'name',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'path',
            type: 'location',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.LOCATION',
            cssClass: 'ellipsis-cell',
            sortable: true
        },
        {
            key: 'content.sizeInBytes',
            type: 'fileSize',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SIZE',
            sortable: true
        },
        {
            key: 'modifiedAt',
            type: 'date',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_ON',
            format: 'timeAgo',
            sortable: true
        }
    ],
    '-sharedlinks-': [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'name',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'path',
            type: 'location',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.LOCATION',
            cssClass: 'ellipsis-cell',
            sortable: true
        },
        {
            key: 'content.sizeInBytes',
            type: 'fileSize',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SIZE',
            sortable: true
        },
        {
            key: 'modifiedAt',
            type: 'date',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_ON',
            format: 'timeAgo',
            sortable: true
        },
        {
            key: 'modifiedByUser.displayName',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_BY',
            sortable: true
        },
        {
            key: 'sharedByUser.displayName',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SHARED_BY',
            sortable: true
        }
    ],
    default: [
        {
            key: '$thumbnail',
            type: 'image',
            srTitle: 'ADF-DOCUMENT-LIST.LAYOUT.THUMBNAIL',
            sortable: false
        },
        {
            key: 'name',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.NAME',
            cssClass: 'full-width ellipsis-cell',
            sortable: true
        },
        {
            key: 'content.sizeInBytes',
            type: 'fileSize',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.SIZE',
            sortable: true
        },
        {
            key: 'modifiedAt',
            type: 'date',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_ON',
            format: 'timeAgo',
            sortable: true
        },
        {
            key: 'modifiedByUser.displayName',
            type: 'text',
            title: 'ADF-DOCUMENT-LIST.LAYOUT.MODIFIED_BY',
            sortable: true
        }
    ]
};
