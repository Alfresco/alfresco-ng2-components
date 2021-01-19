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
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@alfresco/adf-core';
import { Observable, of, Subject } from 'rxjs';
import { AspectEntryModel } from './apect.model';
import { AspectListDialogComponentData } from './aspect-list-dialog-data.interface';
import { AspectListDialogComponent } from './aspect-list-dialog.component';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AspectListService {

    constructor(private appConfigService: AppConfigService, private dialog: MatDialog) {
    }

    getAspects(): Observable<AspectEntryModel[]> {
        const visibleAspectList = this.getVisibleAspects();
        return of({
            list: {
                pagination: {
                    count: 167,
                    hasMoreItems: 'TRUE',
                    totalItems: 167,
                    skipCount: 0,
                    maxItems: 100
                },
                entries: [
                    {
                        entry: {
                            name: 'customModelManagement',
                            prefixedname: 'cmm:customModelManagement',
                            title: 'Marker aspect to indicate the model is created as a custom model by CMM service.',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:UserPasswordDeliveryChannelAspect',
                            name: 'DeliveryChannelAspect',
                            prefixedname: 'slideshare:DeliveryChannelAspect',
                            description: 'Applied to a node that represents a SlideShare delivery channel',
                            title: 'SlideShare Delivery Channel Aspect',
                            properties: [
                                {
                                    name: 'channelPassword',
                                    prefixedname: 'pub:channelPassword',
                                    title: 'The authenticated channel password',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channelUsername',
                                    prefixedname: 'pub:channelUsername',
                                    title: 'The authenticated channel username',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:AssetAspect',
                            name: 'AssetAspect',
                            prefixedname: 'slideshare: AssetAspect',
                            description: ' Applied to a node that has been published to SlideShare',
                            title: 'SlideShare Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URL',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:AssetAspect',
                            name: 'AssetAspect',
                            prefixedname: 'linkedin: AssetAspect',
                            description: ' Applied to a node that has been published to Linkedct',
                            title: 'LinkedIn Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URL',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'gantt',
                            prefixedname: 'dl:gantt',
                            title: 'Gantt',
                            properties: [
                                {
                                    name: 'ganttPercentComplete',
                                    prefixedname: 'dl:ganttPercentComplete',
                                    title: '% Complete',
                                    dataType: 'd:int',
                                    defaultValue: 0,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'dl:percentage'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'ganttStartDate',
                                    prefixedname: 'dl:ganttStartDate',
                                    title: 'Start Date',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'ganttEndDate',
                                    prefixedname: 'dl:ganttEndDate',
                                    title: 'End Date',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:OAuth2DeliveryChannelAspect',
                            name: 'DeliveryChannelAspect',
                            prefixedname: 'facebook: DeliveryChannelAspect',
                            description: ' Applied to a node that represents a Facebook delivery channel',
                            title: 'Facebook Delivery Channel Aspect',
                            properties: [
                                {
                                    name: 'oauth2Token',
                                    prefixedname: 'pub:oauth2Token',
                                    title: 'The value of the OAuth2 token',
                                    dataType: '([\'][A-Za-z][$\']): encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:emailed',
                            name: 'emailed',
                            prefixedname: 'emailserver: emailed',
                            title: 'Emailed',
                            properties: [
                                {
                                    name: 'addressee',
                                    prefixedname: 'cm:addressee',
                                    title: 'To',
                                    description: ' To',
                                    dataType: '([\'][A-Za-z][$\']): text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'sentdate',
                                    prefixedname: 'cm:sentdate',
                                    title: 'Sent Date',
                                    description: ' Sent Date',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'addressees',
                                    prefixedname: 'cm:addressees',
                                    title: 'All Recipients',
                                    description: ' All Recipients',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'originator',
                                    prefixedname: 'cm:originator',
                                    title: 'From',
                                    description: ' From',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'subjectline',
                                    prefixedname: 'cm:subjectline',
                                    title: 'Subject',
                                    description: ' Subject',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'attached',
                            prefixedname: 'emailserver: attached',
                            title: 'Attached',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'aliasable',
                            prefixedname: 'emailserver: aliasable',
                            description: ' Email Alias',
                            title: 'Email Alias',
                            properties: [
                                {
                                    name: 'alias',
                                    prefixedname: 'emailserver: alias',
                                    title: 'Alias',
                                    description: ' Alias',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'restrictable',
                            prefixedname: 'dp: restrictable',
                            description: ' Applied to documents that should have restricted distribution',
                            title: 'Restrictable',
                            properties: [
                                {
                                    name: 'offlineExpiresAfter',
                                    prefixedname: 'dp: offlineExpiresAfter',
                                    title: 'Offline Expires After(hours)',
                                    description: ' Enter the number hours the content can remain accessible once offline',
                                    dataType: 'd:long',
                                    defaultValue: 0,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:UserPasswordDeliveryChannelAspect',
                            name: 'DeliveryChannelAspect',
                            prefixedname: 'youtube: DeliveryChannelAspect',
                            description: ' Applied to a node that represents a YouTube delivery channel',
                            title: 'YouTube Delivery Channel',
                            properties: [
                                {
                                    name: 'channelPassword',
                                    prefixedname: 'pub:channelPassword',
                                    title: 'The authenticated channel password',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channelUsername',
                                    prefixedname: 'pub:channelUsername',
                                    title: 'The authenticated channel username',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:AssetAspect',
                            name: 'AssetAspect',
                            prefixedname: 'youtube: AssetAspect',
                            description: ' Applied to a node that has been published to YouTube',
                            title: 'YouTube Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URl',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'actions',
                            prefixedname: 'act: actions',
                            title: 'Rules',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'actionexecutionhistory',
                            prefixedname: 'act: actionexecutionhistory',
                            title: 'Action Execution History',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'archived',
                            prefixedname: 'sys: archived',
                            description: ' Archived Node',
                            title: 'Archived',
                            properties: [
                                {
                                    name: 'archivedDate',
                                    prefixedname: 'sys: archivedDate',
                                    title: 'Archived Date',
                                    description: ' Archived Date',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'archivedOriginalParentAssoc',
                                    prefixedname: 'sys: archivedOriginalParentAssoc',
                                    dataType: 'd:childassocref',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'archivedOriginalOwner',
                                    prefixedname: 'sys: archivedOriginalOwner',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'archivedBy',
                                    prefixedname: 'sys: archivedBy',
                                    title: 'Archived By',
                                    description: ' Archived By',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'unmovable',
                            prefixedname: 'sys: unmovable',
                            title: 'Unmovable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'archivedLockable',
                            prefixedname: 'sys: archivedLockable',
                            title: 'Archived Lockable',
                            properties: [
                                {
                                    name: 'archivedLockLifetime',
                                    prefixedname: 'sys: archivedLockLifetime',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'archivedLockType',
                                    prefixedname: 'sys: archivedLockType',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'archivedExpiryDate',
                                    prefixedname: 'sys: archivedExpiryDate',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'archivedLockAdditionalInfo',
                                    prefixedname: 'sys: archivedLockAdditionalInfo',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'archivedLockOwner',
                                    prefixedname: 'sys: archivedLockOwner',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'noContent',
                            prefixedname: 'sys: noContent',
                            title: 'NoContent',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'referenceable',
                            prefixedname: 'sys: referenceable',
                            description: ' Referenceable',
                            title: 'Referenceable',
                            properties: [
                                {
                                    name: 'node - uuid',
                                    prefixedname: 'sys: node- uuid',
                                    title: 'Node Identifier',
                                    description: ' Node Identifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'store - protocol',
                                    prefixedname: 'sys: store- protocol',
                                    title: 'Store Protocol',
                                    description: ' Store Protocol',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'store - identifier',
                                    prefixedname: 'sys: store- identifier',
                                    title: 'Store Identifier',
                                    description: ' Store Identifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'node - dbid',
                                    prefixedname: 'sys: node - dbid',
                                    title: 'Node DB Identifier',
                                    description: ' Node DB Identifier',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'localized',
                            prefixedname: 'sys: localized',
                            title: 'Translation',
                            properties: [
                                {
                                    name: 'locale',
                                    prefixedname: 'sys: locale',
                                    title: 'Locale',
                                    description: ' Locale',
                                    dataType: 'd:locale',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'pendingFixAcl',
                            prefixedname: 'sys: pendingFixAcl',
                            title: 'Pending fix ACl',
                            properties: [
                                {
                                    name: 'sharedAclToReplace',
                                    prefixedname: 'sys: sharedAclToReplace',
                                    title: 'Shared Acl To Replace',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: false
                                },
                                {
                                    name: 'inheritFromAcl',
                                    prefixedname: 'sys: inheritFromAcl',
                                    title: 'Inherit From',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: false
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'webdavNoContent',
                            prefixedname: 'sys: webdavNoContent',
                            title: 'NoContent',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'undeletable',
                            prefixedname: 'sys: undeletable',
                            title: 'Undeletable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'aspect_root',
                            prefixedname: 'sys: aspect_root',
                            title: 'Root',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'incomplete',
                            prefixedname: 'sys: incomplete',
                            title: 'Incomplete',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'temporary',
                            prefixedname: 'sys: temporary',
                            title: 'Temporary',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'pendingDelete',
                            prefixedname: 'sys: pendingDelete',
                            title: 'Pending Delete',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'cascadeUpdate',
                            prefixedname: 'sys: cascadeUpdate',
                            title: 'Cascade update',
                            properties: [
                                {
                                    name: 'cascadeTx',
                                    prefixedname: 'sys: cascadeTx',
                                    title: 'Cascade Tx',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'cascadeCRc',
                                    prefixedname: 'sys: cascadeCRc',
                                    title: 'Cascade CRc',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'softDelete',
                            prefixedname: 'sys: softDelete',
                            title: 'SoftDelete',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'archiveRoot',
                            prefixedname: 'sys: archiveRoot',
                            description: ' Aspect attached to root of archive store',
                            title: 'Archive Root',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'archived - assocs',
                            prefixedname: 'sys: archived - assocs',
                            properties: [
                                {
                                    name: 'archivedChildAssocs',
                                    prefixedname: 'sys: archivedChildAssocs',
                                    dataType: 'd:childassocref',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: false
                                },
                                {
                                    name: 'archivedSourceAssocs',
                                    prefixedname: 'sys: archivedSourceAssocs',
                                    dataType: 'd:assocref',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: false
                                },
                                {
                                    name: 'archivedParentAssocs',
                                    prefixedname: 'sys: archivedParentAssocs',
                                    dataType: 'd:childassocref',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: false
                                },
                                {
                                    name: 'archivedTargetAssocs',
                                    prefixedname: 'sys: archivedTargetAssocs',
                                    dataType: 'd:assocref',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: false
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'hidden',
                            prefixedname: 'sys: hidden',
                            title: 'Hidden',
                            properties: [
                                {
                                    name: 'clientVisibilityMask',
                                    prefixedname: 'sys: clientVisibilityMask',
                                    dataType: 'd:int',
                                    defaultValue: 0,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'clientControlled',
                                    prefixedname: 'sys: clientControlled',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'cascadeHidden',
                                    prefixedname: 'sys: cascadeHidden',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'hiddenFlag',
                                    prefixedname: 'sys: hiddenFlag',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'cascadeIndexControl',
                                    prefixedname: 'sys: cascadeIndexControl',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'CMISUpdateContext',
                            prefixedname: 'sys: CMISUpdateContext',
                            title: 'CMIS Update Context',
                            properties: [
                                {
                                    name: 'gotFirstChunk',
                                    prefixedname: 'sys: gotFirstChunk',
                                    title: 'Got First Content Chunk',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'assignees',
                            prefixedname: 'bpm:assignees',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'groupAssignee',
                            prefixedname: 'bpm:groupAssignee',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'assignee',
                            prefixedname: 'bpm:assignee',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'workflowPackage',
                            prefixedname: 'bpm:workflowPackage',
                            description: ' The collection of content routed through the workflow',
                            title: 'Workflow Package',
                            properties: [
                                {
                                    name: 'workflowDefinitionId',
                                    prefixedname: 'bpm:workflowDefinitionId',
                                    title: 'Workflow Definition Id',
                                    description: ' Workflow Definition Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'workflowDefinitionName',
                                    prefixedname: 'bpm:workflowDefinitionName',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'isSystemPackage',
                                    prefixedname: 'bpm:isSystemPackage',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'workflowInstanceId',
                                    prefixedname: 'bpm:workflowInstanceId',
                                    title: 'Workflow Instance Id',
                                    description: ' Workflow Instance Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'endAutomatically',
                            prefixedname: 'bpm:endAutomatically',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'groupAssignees',
                            prefixedname: 'bpm:groupAssignees',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:AssetAspect',
                            name: 'AssetAspect',
                            prefixedname: 'twitter: AssetAspect',
                            description: ' Applied to a node that has been published to Twitter',
                            title: 'Twitter Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URl',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'activitiProcessApp',
                            prefixedname: 'abs: activitiProcessApp',
                            title: 'Activiti Process App',
                            properties: [
                                {
                                    name: 'appDefinitionName',
                                    prefixedname: 'abs: appDefinitionName',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'internal',
                            prefixedname: 'lnk:internal',
                            title: 'Internal Link',
                            properties: [
                                {
                                    name: 'isInternal',
                                    prefixedname: 'lnk:isInternal',
                                    title: 'Is Internal',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'moderatedInvitationStats',
                            prefixedname: 'imwf:moderatedInvitationStats',
                            properties: [
                                {
                                    name: 'inviteeUserName',
                                    prefixedname: 'imwf:inviteeUserName',
                                    title: 'Invitee Username',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'reviewComments',
                                    prefixedname: 'imwf:reviewComments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeComments',
                                    prefixedname: 'imwf:inviteeComments',
                                    title: 'Invitee Comments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resourceType',
                                    prefixedname: 'imwf:resourceType',
                                    title: 'Resource Type',
                                    dataType: 'd:text',
                                    defaultValue: 'WEB_SITE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeRole',
                                    prefixedname: 'imwf:inviteeRole',
                                    title: 'Invitee Role',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'clientName',
                                    prefixedname: 'imwf:clientName',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resourceName',
                                    prefixedname: 'imwf:resourceName',
                                    title: 'Resource Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'modifiedAt',
                                    prefixedname: 'imwf:modifiedAt',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'synced',
                            prefixedname: 'sync:synced',
                            properties: [
                                {
                                    name: 'remoteVersionLabel',
                                    prefixedname: 'sync:remoteVersionLabel',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'thisVersionLabel',
                                    prefixedname: 'sync:thisVersionLabel',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'archived',
                            prefixedname: 'sync:archived',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'deleteOnPrem',
                            prefixedname: 'sync:deleteOnPrem',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'syncSetMemberNode',
                            prefixedname: 'sync:syncSetMemberNode',
                            properties: [
                                {
                                    name: 'remoteModified',
                                    prefixedname: 'sync:remoteModified',
                                    title: 'Remote Modified',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'syncRequested',
                                    prefixedname: 'sync:syncRequested',
                                    title: 'Has a sync been requested',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'syncLock',
                                    prefixedname: 'sync:syncLock',
                                    title: 'Was this node locked by sync?',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'directSync',
                                    prefixedname: 'sync:directSync',
                                    title: 'Direct / Indirect Sync',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'otherNodeRefString',
                                    prefixedname: 'sync:otherNodeRefString',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'remoteModifier',
                                    prefixedname: 'sync:remoteModifier',
                                    title: 'Remote Modifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'syncTime',
                                    prefixedname: 'sync:syncTime',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'syncOwner',
                                    prefixedname: 'sync:syncOwner',
                                    title: 'Username(on Source Repo) of Sync Set Owner',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'transientError',
                            prefixedname: 'sync:transientError',
                            properties: [
                                {
                                    name: 'transientErrorCode',
                                    prefixedname: 'sync:transientErrorCode',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'failed',
                            prefixedname: 'sync:failed',
                            properties: [
                                {
                                    name: 'errorCode',
                                    prefixedname: 'sync:errorCode',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'errorDetails',
                                    prefixedname: 'sync:errorDetails',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'errorTime',
                                    prefixedname: 'sync:errorTime',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'nominatedInvitationStats',
                            prefixedname: 'inwf:nominatedInvitationStats',
                            properties: [
                                {
                                    name: 'resourceName',
                                    prefixedname: 'inwf:resourceName',
                                    title: 'Resource Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviterUserName',
                                    prefixedname: 'inwf:inviterUserName',
                                    title: 'Invited By',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeRole',
                                    prefixedname: 'inwf:inviteeRole',
                                    title: 'Invitee Role',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeUserName',
                                    prefixedname: 'inwf:inviteeUserName',
                                    title: 'Invitee Username',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeEmail',
                                    prefixedname: 'inwf:inviteeEmail',
                                    title: 'Invitee Email Address',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeLastName',
                                    prefixedname: 'inwf:inviteeLastName',
                                    title: 'Invitee Last Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resourceTitle',
                                    prefixedname: 'inwf:resourceTitle',
                                    title: 'Resource Title',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resourceDescription',
                                    prefixedname: 'inwf:resourceDescription',
                                    title: 'Resource Description',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resourceType',
                                    prefixedname: 'inwf:resourceType',
                                    title: 'Resource Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'inviteeFirstName',
                                    prefixedname: 'inwf:inviteeFirstName',
                                    title: 'Invitee First Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'emailed',
                            prefixedname: 'cm:emailed',
                            description: ' Emailed',
                            title: 'Emailed',
                            properties: [
                                {
                                    name: 'addressee',
                                    prefixedname: 'cm:addressee',
                                    title: 'To',
                                    description: ' To',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'sentdate',
                                    prefixedname: 'cm:sentdate',
                                    title: 'Sent Date',
                                    description: ' Sent Date',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'addressees',
                                    prefixedname: 'cm:addressees',
                                    title: 'All Recipients',
                                    description: ' All Recipients',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'originator',
                                    prefixedname: 'cm:originator',
                                    title: 'From',
                                    description: ' From',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'subjectline',
                                    prefixedname: 'cm:subjectline',
                                    title: 'Subject',
                                    description: ' Subject',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'audio',
                            prefixedname: 'audio:audio',
                            description: ' Subset of the standard xmpDM Audio metadata',
                            title: 'Audio',
                            properties: [
                                {
                                    name: 'sampleRate',
                                    prefixedname: 'audio:sampleRate',
                                    title: 'Sample Rate',
                                    description: ' Sample Rate',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'releaseDate',
                                    prefixedname: 'audio:releaseDate',
                                    title: 'Release Date',
                                    description: ' Release Date',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channelType',
                                    prefixedname: 'audio:channelType',
                                    title: 'Channel Type',
                                    description: '"Audio Channel Type", typically one of Mono, Stereo, 5.1 or 7.1',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'engineer',
                                    prefixedname: 'audio:engineer',
                                    title: 'Engineer',
                                    description: ' Recording Engineer',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'genre',
                                    prefixedname: 'audio:genre',
                                    title: 'Genre',
                                    description: ' Genre of the music',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'composer',
                                    prefixedname: 'audio:composer',
                                    title: 'Composer',
                                    description: ' Composer who composed the work',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'album',
                                    prefixedname: 'audio:album',
                                    title: 'Album',
                                    description: ' Album',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'artist',
                                    prefixedname: 'audio:artist',
                                    title: 'Artist',
                                    description: ' Artist who performed the work',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'trackNumber',
                                    prefixedname: 'audio:trackNumber',
                                    title: 'Track Number',
                                    description: ' Track Number of the work in the Album',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'compressor',
                                    prefixedname: 'audio:compressor',
                                    title: 'Compressor',
                                    description: '"Audio Compressor Used", such as MP3 or FLAc',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'sampleType',
                                    prefixedname: 'audio:sampleType',
                                    title: 'Sample Type',
                                    description: ' "Audio Sample Type", typically one of 8Int, 16Int, 32Int or 32Float',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'personDisabled',
                            prefixedname: 'cm:personDisabled',
                            description: ' Indicates that a cm:person type has been disabled.',
                            title: 'Person Disabled',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'replaceable',
                            prefixedname: 'cm:replaceable',
                            title: 'Replacable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'tagscope',
                            prefixedname: 'cm:tagscope',
                            title: 'Tag Scope',
                            properties: [
                                {
                                    name: 'tagScopeSummary',
                                    prefixedname: 'cm:tagScopeSummary',
                                    title: 'Tag Summary',
                                    description: ' Tag Summary',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'tagScopeCache',
                                    prefixedname: 'cm:tagScopeCache',
                                    title: 'Tags',
                                    dataType: 'd:content',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'attachable',
                            prefixedname: 'cm:attachable',
                            description: ' Allows other repository objects to be attached',
                            title: 'Attachable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'rn: renditioned',
                            name: 'thumbnailed',
                            prefixedname: 'cm:thumbnailed',
                            title: 'Thumbnailed',
                            properties: [
                                {
                                    name: 'automaticUpdate',
                                    prefixedname: 'cm:automaticUpdate',
                                    title: 'Automatic Update',
                                    dataType: 'd:boolean',
                                    defaultValue: 'TRUE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'titled',
                            prefixedname: 'cm:titled',
                            description: ' Titled',
                            title: 'Titled',
                            properties: [
                                {
                                    name: 'title',
                                    prefixedname: 'cm:title',
                                    title: 'Title',
                                    description: ' Content Title',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'cm:description',
                                    title: 'Description',
                                    description: ' Content Description',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'rendition',
                            prefixedname: 'rn: rendition',
                            title: 'Rendition',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'failedThumbnailSource',
                            prefixedname: 'cm:failedThumbnailSource',
                            title: 'Failed Thumbnail Source',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:localizable',
                            name: 'translatable',
                            prefixedname: 'cm:translatable',
                            description: ' Translatable',
                            title: 'Translatable',
                            properties: [
                                {
                                    name: 'locale',
                                    prefixedname: 'cm:locale',
                                    title: 'Locale',
                                    description: ' Locale',
                                    dataType: 'd:category',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'preferences',
                            prefixedname: 'cm:preferences',
                            title: 'Preferences',
                            properties: [
                                {
                                    name: 'preferenceValues',
                                    prefixedname: 'cm:preferenceValues',
                                    dataType: 'd:content',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'localizable',
                            prefixedname: 'cm:localizable',
                            description: ' Localizable',
                            title: 'Localizable',
                            properties: [
                                {
                                    name: 'locale',
                                    prefixedname: 'cm:locale',
                                    title: 'Locale',
                                    description: ' Locale',
                                    dataType: 'd:category',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'rn: rendition',
                            name: 'hiddenRendition',
                            prefixedname: 'rn: hiddenRendition',
                            title: 'Hidden Rendition',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'fiveStarRatingSchemeRollups',
                            prefixedname: 'cm:fiveStarRatingSchemeRollups',
                            title: 'Five star rating scheme rollups',
                            properties: [
                                {
                                    name: 'fiveStarRatingSchemeCount',
                                    prefixedname: 'cm:fiveStarRatingSchemeCount',
                                    title: 'Five Star Rating Scheme ratings count',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'fiveStarRatingSchemeTotal',
                                    prefixedname: 'cm:fiveStarRatingSchemeTotal',
                                    title: 'Five Star Rating Scheme ratings total',
                                    dataType: 'd:float',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:classifiable',
                            name: 'taggable',
                            prefixedname: 'cm:taggable',
                            description: ' Taggable',
                            title: 'Taggable',
                            properties: [
                                {
                                    name: 'taggable',
                                    prefixedname: 'cm:taggable',
                                    title: 'Tags',
                                    description: ' Tags',
                                    dataType: 'd:category',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'syndication',
                            prefixedname: 'cm:syndication',
                            title: 'Content syndication',
                            properties: [
                                {
                                    name: 'published',
                                    prefixedname: 'cm:published',
                                    title: 'Published',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'updated',
                                    prefixedname: 'cm:updated',
                                    title: 'Updated',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'templatable',
                            prefixedname: 'cm:templatable',
                            description: ' Templatable',
                            title: 'Templatable',
                            properties: [
                                {
                                    name: 'template',
                                    prefixedname: 'cm:template',
                                    title: 'Template',
                                    description: ' Template',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'lockable',
                            prefixedname: 'cm:lockable',
                            description: ' Lockable',
                            title: 'Lockable',
                            properties: [
                                {
                                    name: 'lockIsDeep',
                                    prefixedname: 'cm:lockIsDeep',
                                    title: 'Deep Lock',
                                    description: ' Deep Lock',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'lockType',
                                    prefixedname: 'cm:lockType',
                                    title: 'Lock Type',
                                    description: ' Lock Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'expiryDate',
                                    prefixedname: 'cm:expiryDate',
                                    title: 'Expiry Date',
                                    description: ' Expiry Date',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'lockOwner',
                                    prefixedname: 'cm:lockOwner',
                                    title: 'Lock Owner',
                                    description: ' Lock Owner',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'lockLifetime',
                                    prefixedname: 'cm:lockLifetime',
                                    title: 'Lock Lifetime',
                                    description: ' Lock Lifetime',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'lockAdditionalInfo',
                                    prefixedname: 'cm:lockAdditionalInfo',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'object',
                            prefixedname: 'webdav: object',
                            title: 'Webdav Object',
                            properties: [
                                {
                                    name: 'deadproperties',
                                    prefixedname: 'webdav: deadproperties',
                                    title: 'Webdav Dead Properties',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'effectivity',
                            prefixedname: 'cm:effectivity',
                            description: ' Effectivity',
                            title: 'Effectivity',
                            properties: [
                                {
                                    name: 'to',
                                    prefixedname: 'cm:to',
                                    title: 'Effective To',
                                    description: ' Effective To',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'from',
                                    prefixedname: 'cm:from',
                                    title: 'Effective From',
                                    description: ' Effective From',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'basable',
                            prefixedname: 'cm:basable',
                            description: ' Basable',
                            title: 'Basable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'complianceable',
                            prefixedname: 'cm:complianceable',
                            description: ' Complianceable',
                            title: 'Complianceable',
                            properties: [
                                {
                                    name: 'removeAfter',
                                    prefixedname: 'cm:removeAfter',
                                    title: 'Remove After',
                                    description: ' Remove After',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'webscriptable',
                            prefixedname: 'cm:webscriptable',
                            title: 'Webscriptable',
                            properties: [
                                {
                                    name: 'webscript',
                                    prefixedname: 'cm:webscript',
                                    title: 'Webscript',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'versionable',
                            prefixedname: 'cm:versionable',
                            description: ' Versionable',
                            title: 'Versionable',
                            properties: [
                                {
                                    name: 'autoVersionOnUpdateProps',
                                    prefixedname: 'cm:autoVersionOnUpdateProps',
                                    title: 'Auto Version - on update properties only',
                                    dataType: 'd:boolean',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'versionLabel',
                                    prefixedname: 'cm:versionLabel',
                                    title: 'Version Label',
                                    description: ' Version Label',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'autoVersion',
                                    prefixedname: 'cm:autoVersion',
                                    title: 'Auto Version',
                                    description: ' Auto Version',
                                    dataType: 'd:boolean',
                                    defaultValue: 'TRUE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'versionType',
                                    prefixedname: 'cm:versionType',
                                    title: 'Version Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'initialVersion',
                                    prefixedname: 'cm:initialVersion',
                                    title: 'Initial Version',
                                    description: ' Initial Version',
                                    dataType: 'd:boolean',
                                    defaultValue: 'TRUE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:classifiable',
                            name: 'generalclassifiable',
                            prefixedname: 'cm:generalclassifiable',
                            description: ' Classifiable',
                            title: 'Classifiable',
                            properties: [
                                {
                                    name: 'categories',
                                    prefixedname: 'cm:categories',
                                    title: 'Categories',
                                    description: ' Categories',
                                    dataType: 'd:category',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'rateable',
                            prefixedname: 'cm:rateable',
                            title: 'Rateable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'referencing',
                            prefixedname: 'cm:referencing',
                            description: ' Referencing',
                            title: 'Referencing',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'mlEmptyTranslation',
                            prefixedname: 'cm:mlEmptyTranslation',
                            title: 'Empty Translation',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'rn: rendition',
                            name: 'visibleRendition',
                            prefixedname: 'rn: visibleRendition',
                            title: 'Visible Rendition',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'annullable',
                            prefixedname: 'cm:annullable',
                            description: ' Indicates that a node can be deleted if a pending activity is cancelled',
                            title: 'Annullable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'ownable',
                            prefixedname: 'cm:ownable',
                            description: ' Ownable',
                            title: 'Ownable',
                            properties: [
                                {
                                    name: 'owner',
                                    prefixedname: 'cm:owner',
                                    title: 'Owner',
                                    description: ' Owner',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'partable',
                            prefixedname: 'cm:partable',
                            description: ' Partable',
                            title: 'Partable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'auditable',
                            prefixedname: 'cm:auditable',
                            description: ' Auditable',
                            title: 'Auditable',
                            properties: [
                                {
                                    name: 'creator',
                                    prefixedname: 'cm:creator',
                                    title: 'Creator',
                                    description: ' Who created this item',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'created',
                                    prefixedname: 'cm:created',
                                    title: 'Created Date',
                                    description: ' Created Date',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'modifier',
                                    prefixedname: 'cm:modifier',
                                    title: 'Modifier',
                                    description: ' Who last modified this item',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'modified',
                                    prefixedname: 'cm:modified',
                                    title: 'Modified Date',
                                    description: ' When this item was last modified',
                                    dataType: 'd:datetime',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'accessed',
                                    prefixedname: 'cm:accessed',
                                    title: 'Last Accessed Date',
                                    description: ' When this item was last accessed',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'geographic',
                            prefixedname: 'cm:geographic',
                            description: ' Geographic',
                            title: 'Geographic',
                            properties: [
                                {
                                    name: 'latitude',
                                    prefixedname: 'cm:latitude',
                                    title: 'Latitude',
                                    description: ' Latitude',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'longitude',
                                    prefixedname: 'cm:longitude',
                                    title: 'Longitude',
                                    description: ' Longitude',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'rendition2',
                            prefixedname: 'rn: rendition2',
                            title: 'Rendition2',
                            properties: [
                                {
                                    name: 'contentUrlHashCode',
                                    prefixedname: 'rn: contentUrlHashCode',
                                    title: 'Hash code of the source content url',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'storeSelector',
                            prefixedname: 'cm:storeSelector',
                            title: 'ContentStore Selector',
                            properties: [
                                {
                                    name: 'storeName',
                                    prefixedname: 'cm:storeName',
                                    title: 'Store Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'cm:storeSelectorConstraint'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'mlDocument',
                            prefixedname: 'cm:mlDocument',
                            title: 'Multilingual Document',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'renditioned',
                            prefixedname: 'rn: renditioned',
                            title: 'Renditioned',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'subscribable',
                            prefixedname: 'cm:subscribable',
                            description: ' Subscribable',
                            title: 'Subscribable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'workingcopy',
                            prefixedname: 'cm:workingcopy',
                            description: ' Working Copy',
                            title: 'Working Copy',
                            properties: [
                                {
                                    name: 'workingCopyOwner',
                                    prefixedname: 'cm:workingCopyOwner',
                                    title: 'Working Copy Owner',
                                    description: ' Working Copy Owner',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'workingCopyMode',
                                    prefixedname: 'cm:workingCopyMode',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'workingCopyLabel',
                                    prefixedname: 'cm:workingCopyLabel',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'indexControl',
                            prefixedname: 'cm:indexControl',
                            description: ' Control Index Behaviour',
                            title: 'Index Control',
                            properties: [
                                {
                                    name: 'isIndexed',
                                    prefixedname: 'cm:isIndexed',
                                    title: 'Is Indexed',
                                    description: ' Is the node indexed and can be found via search.',
                                    dataType: 'd:boolean',
                                    defaultValue: 'TRUE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'isContentIndexed',
                                    prefixedname: 'cm:isContentIndexed',
                                    title: 'Is Content Indexed',
                                    description: ' "Are the nodes d:content properties indexed?"',
                                    dataType: 'd:boolean',
                                    defaultValue: 'TRUE',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'cmisCreatedCheckedOut',
                            prefixedname: 'cm:cmisCreatedCheckedOut',
                            title: 'CMIS Created Checked Out',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'checkedOut',
                            prefixedname: 'cm:checkedOut',
                            title: 'Checked Out',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'likesRatingSchemeRollups',
                            prefixedname: 'cm:likesRatingSchemeRollups',
                            title: 'Likes rating scheme rollups',
                            properties: [
                                {
                                    name: 'likesRatingSchemeTotal',
                                    prefixedname: 'cm:likesRatingSchemeTotal',
                                    title: 'Likes Rating Scheme ratings total',
                                    dataType: 'd:float',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'likesRatingSchemeCount',
                                    prefixedname: 'cm:likesRatingSchemeCount',
                                    title: 'Likes Rating Scheme ratings count',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'projectsummary',
                            prefixedname: 'cm:projectsummary',
                            title: 'Project Summary',
                            properties: [
                                {
                                    name: 'summaryWebscript',
                                    prefixedname: 'cm:summaryWebscript',
                                    title: 'Project Summary Webscript',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'thumbnailModification',
                            prefixedname: 'cm:thumbnailModification',
                            title: 'Thumbnail Modification Data',
                            properties: [
                                {
                                    name: 'lastThumbnailModification',
                                    prefixedname: 'cm:lastThumbnailModification',
                                    title: 'Last thumbnail modifcation data',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'exif',
                            prefixedname: 'exif:exif',
                            description: ' Subset of the standard EXIF metadata',
                            title: 'EXIf',
                            properties: [
                                {
                                    name: 'focalLength',
                                    prefixedname: 'exif: focalLength',
                                    title: 'Focal Length',
                                    description: ' Focal length of the lens, in millimeters',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'software',
                                    prefixedname: 'exif: software',
                                    title: 'Camera Software',
                                    description: ' Software on the camera that took the picture',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'model',
                                    prefixedname: 'exif: model',
                                    title: 'Camera Model',
                                    description: ' Model of the camera that took the picture',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'yResolution',
                                    prefixedname: 'exif: yResolution',
                                    title: 'Vertical Resolution',
                                    description: ' Vertical resolution in pixels per unit',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'xResolution',
                                    prefixedname: 'exif: xResolution',
                                    title: 'Horizontal Resolution',
                                    description: ' Horizontal resolution in pixels per unit',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flash',
                                    prefixedname: 'exif: flash',
                                    title: 'Flash Activated',
                                    description: ' Whether the flash activated when the picture was taken',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'resolutionUnit',
                                    prefixedname: 'exif: resolutionUnit',
                                    title: 'Resolution Unit',
                                    description: ' Unit used for horizontal and vertical resolution',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'fNumber',
                                    prefixedname: 'exif: fNumber',
                                    title: 'F Number',
                                    description: ' F Number',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'isoSpeedRatings',
                                    prefixedname: 'exif: isoSpeedRatings',
                                    title: 'ISO Speed',
                                    description: ' ISO Speed',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'dateTimeOriginal',
                                    prefixedname: 'exif: dateTimeOriginal',
                                    title: 'Date and Time',
                                    description: ' Date and time when original image was generated',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'manufacturer',
                                    prefixedname: 'exif: manufacturer',
                                    title: 'Camera Manufacturer',
                                    description: ' Manufacturer of the camera that took the picture',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'orientation',
                                    prefixedname: 'exif: orientation',
                                    title: 'Orientation',
                                    description: ' Orientation of the picture',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'pixelXDimension',
                                    prefixedname: 'exif: pixelXDimension',
                                    title: 'Image Width',
                                    description: ' The width of the image in pixels',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'pixelYDimension',
                                    prefixedname: 'exif: pixelYDimension',
                                    title: 'Image Height',
                                    description: ' The height of the image in pixels',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'exposureTime',
                                    prefixedname: 'exif: exposureTime',
                                    title: 'Exposure Time',
                                    description: ' Exposure time, in seconds',
                                    dataType: 'd:double',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'classifiable',
                            prefixedname: 'cm:classifiable',
                            description: ' Classifiable',
                            title: 'Classifiable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'referencesnode',
                            prefixedname: 'cm:referencesnode',
                            title: 'References Node',
                            properties: [
                                {
                                    name: 'noderef',
                                    prefixedname: 'cm:noderef',
                                    title: 'Node Reference',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'copiedfrom',
                            prefixedname: 'cm:copiedfrom',
                            title: 'Copied From',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'preventRenditions',
                            prefixedname: 'rn: preventRenditions',
                            title: 'Marker aspect to prevent the creation of renditions for a node.',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:titled',
                            name: 'dublincore',
                            prefixedname: 'cm:dublincore',
                            description: ' Dublin Core',
                            title: 'Dublin Core',
                            properties: [
                                {
                                    name: 'rights',
                                    prefixedname: 'cm:rights',
                                    title: 'Rights',
                                    description: ' Rights',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'title',
                                    prefixedname: 'cm:title',
                                    title: 'Title',
                                    description: ' Content Title',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'type',
                                    prefixedname: 'cm:type',
                                    title: 'Type',
                                    description: ' Type',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'coverage',
                                    prefixedname: 'cm:coverage',
                                    title: 'Coverage',
                                    description: ' Coverage',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'publisher',
                                    prefixedname: 'cm:publisher',
                                    title: 'Publisher',
                                    description: ' Publisher',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'identifier',
                                    prefixedname: 'cm:identifier',
                                    title: 'Identifier',
                                    description: ' Identifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'dcsource',
                                    prefixedname: 'cm:dcsource',
                                    title: 'Source',
                                    description: ' Source',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'cm:description',
                                    title: 'Description',
                                    description: ' Content Description',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'contributor',
                                    prefixedname: 'cm:contributor',
                                    title: 'Contributor',
                                    description: ' Contributor',
                                    dataType: 'd:text',
                                    facetable: 'TRUE',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'subject',
                                    prefixedname: 'cm:subject',
                                    title: 'Subject',
                                    description: ' Subject',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'countable',
                            prefixedname: 'cm:countable',
                            description: ' Countable',
                            title: 'Countable',
                            properties: [
                                {
                                    name: 'hits',
                                    prefixedname: 'cm:hits',
                                    title: 'Hits',
                                    description: ' Hits',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'counter',
                                    prefixedname: 'cm:counter',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'summarizable',
                            prefixedname: 'cm:summarizable',
                            description: ' Summarizable',
                            title: 'Summarizable',
                            properties: [
                                {
                                    name: 'summary',
                                    prefixedname: 'cm:summary',
                                    title: 'Summary',
                                    description: ' Summary',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'transformable',
                            prefixedname: 'cm:transformable',
                            description: ' Transformable',
                            title: 'Transformable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'author',
                            prefixedname: 'cm:author',
                            description: ' Author',
                            title: 'Author',
                            properties: [
                                {
                                    name: 'author',
                                    prefixedname: 'cm:author',
                                    title: 'Author',
                                    description: ' Author',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'commentsRollup',
                            prefixedname: 'fm: commentsRollup',
                            properties: [
                                {
                                    name: 'commentCount',
                                    prefixedname: 'fm: commentCount',
                                    title: 'Comment count rollup for this node',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'discussable',
                            prefixedname: 'fm: discussable',
                            description: ' Allows an object to be discussed',
                            title: 'Discussable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'remoteCredentialsSystemContainer',
                            prefixedname: 'rc: remoteCredentialsSystemContainer',
                            title: 'Remote Credentials System Container',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'docFoldered',
                            prefixedname: 'ia: docFoldered',
                            title: 'Doc folder',
                            properties: [
                                {
                                    name: 'docFolder',
                                    prefixedname: 'ia: docFolder',
                                    title: 'DocFolder',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'version',
                            prefixedname: 'ver2: version',
                            title: 'Version',
                            properties: [
                                {
                                    name: 'frozenNodeType',
                                    prefixedname: 'ver2: frozenNodeType',
                                    dataType: 'd:qname',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenNodeStoreId',
                                    prefixedname: 'ver2: frozenNodeStoreId',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'ver2: description',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenAspects',
                                    prefixedname: 'ver2: frozenAspects',
                                    dataType: 'd:qname',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenCreator',
                                    prefixedname: 'ver2: frozenCreator',
                                    title: 'Creator',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenNodeId',
                                    prefixedname: 'ver2: frozenNodeId',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'versionNumber',
                                    prefixedname: 'ver2: versionNumber',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'versionLabel',
                                    prefixedname: 'ver2: versionLabel',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenModifier',
                                    prefixedname: 'ver2: frozenModifier',
                                    title: 'Modifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenNodeStoreProtocol',
                                    prefixedname: 'ver2: frozenNodeStoreProtocol',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'frozenAccessed',
                                    prefixedname: 'ver2: frozenAccessed',
                                    title: 'Accessed',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenCreated',
                                    prefixedname: 'ver2: frozenCreated',
                                    title: 'Created',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'frozenNodeDbId',
                                    prefixedname: 'ver2: frozenNodeDbId',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'frozenModified',
                                    prefixedname: 'ver2: frozenModified',
                                    title: 'Modified',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'versionStoreRoot',
                            prefixedname: 'ver2: versionStoreRoot',
                            title: 'Version Store Root',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'smf: virtualization',
                            name: 'customConfigSmartFolder',
                            prefixedname: 'smf: customConfigSmartFolder',
                            description: ' A custom Smart Folder',
                            title: 'Custom Smart Folder',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'smartFolderChild',
                            prefixedname: 'smf: smartFolderChild',
                            description: ' A node entry in a Smart Folder container node',
                            title: 'Smart Folder Child',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'smf: virtualization',
                            name: 'systemConfigSmartFolder',
                            prefixedname: 'smf: systemConfigSmartFolder',
                            description: ' A system Smart Folder',
                            title: 'System Smart Folder',
                            properties: [
                                {
                                    name: 'system - template - location',
                                    prefixedname: 'smf: system- template - location',
                                    title: 'Smart Folder Template',
                                    description: ' A system Smart Folder Template location',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'smf: system - template - locations - constraint'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'smartFolder',
                            prefixedname: 'smf: smartFolder',
                            description: ' A Smart Folder container node',
                            title: 'Smart Folder',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'virtualization',
                            prefixedname: 'smf: virtualization',
                            description: ' A container Smart Folder',
                            title: 'Container Smart Folder',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'siteContainer',
                            prefixedname: 'st: siteContainer',
                            title: 'Site Container',
                            properties: [
                                {
                                    name: 'componentId',
                                    prefixedname: 'st: componentId',
                                    title: 'Component Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'customSiteProperties',
                            prefixedname: 'st: customSiteProperties',
                            title: 'Custom Site Properties',
                            properties: [
                                {
                                    name: 'additionalInformation',
                                    prefixedname: 'stcp: additionalInformation',
                                    title: 'Additional Site Information',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'customProperties',
                            prefixedname: 'srft: customProperties',
                            title: 'Facet Custom Properties',
                            properties: [
                                {
                                    name: 'extraInformation',
                                    prefixedname: 'srftcustom: extraInformation',
                                    title: 'Additional Facet Information',
                                    dataType: 'd:any',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'workflow',
                            prefixedname: 'app: workflow',
                            description: ' Workflow',
                            title: 'Workflow',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'app: workflow',
                            name: 'simpleworkflow',
                            prefixedname: 'app: simpleworkflow',
                            description: ' Workflow',
                            title: 'Workflow',
                            properties: [
                                {
                                    name: 'rejectMove',
                                    prefixedname: 'app: rejectMove',
                                    title: 'Move or Copy',
                                    description: ' Move or Copy',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'rejectStep',
                                    prefixedname: 'app: rejectStep',
                                    title: 'Reject Step',
                                    description: ' Reject Step',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'approveFolder',
                                    prefixedname: 'app: approveFolder',
                                    title: 'Approve Folder',
                                    description: ' Approve Folder',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'approveStep',
                                    prefixedname: 'app: approveStep',
                                    title: 'Approve Step',
                                    description: ' Approve Step',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'approveMove',
                                    prefixedname: 'app: approveMove',
                                    title: 'Move or Copy',
                                    description: ' Move or Copy',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'rejectFolder',
                                    prefixedname: 'app: rejectFolder',
                                    title: 'Reject Folder',
                                    description: ' Reject Folder',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'configurable',
                            prefixedname: 'app: configurable',
                            description: ' Configurable',
                            title: 'Configurable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'defaultViewConfig',
                            prefixedname: 'app: defaultViewConfig',
                            title: 'Default View Config',
                            properties: [
                                {
                                    name: 'defaultViewId',
                                    prefixedname: 'app: defaultViewId',
                                    title: 'Default View Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'linked',
                            prefixedname: 'app: linked',
                            title: 'Marker aspect to indicate that the node has been linked.',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'inlineeditable',
                            prefixedname: 'app: inlineeditable',
                            description: ' Inline Editable',
                            title: 'Inline Editable',
                            properties: [
                                {
                                    name: 'editInline',
                                    prefixedname: 'app: editInline',
                                    title: 'Edit Inline',
                                    description: ' Edit Inline',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'feedsource',
                            prefixedname: 'app: feedsource',
                            title: 'Feed Source',
                            properties: [
                                {
                                    name: 'template',
                                    prefixedname: 'app: template',
                                    title: 'Feed Template',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:titled',
                            name: 'uifacets',
                            prefixedname: 'app: uifacets',
                            description: ' UI Facets',
                            title: 'UI Facets',
                            properties: [
                                {
                                    name: 'title',
                                    prefixedname: 'cm:title',
                                    title: 'Title',
                                    description: ' Content Title',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'cm:description',
                                    title: 'Description',
                                    description: ' Content Description',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'icon',
                                    prefixedname: 'app: icon',
                                    title: 'Icon',
                                    description: ' Icon',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'imap:flaggable',
                            name: 'imapContent',
                            prefixedname: 'imap:imapContent',
                            title: 'IMAP File',
                            properties: [
                                {
                                    name: 'flagDraft',
                                    prefixedname: 'imap:flagDraft',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'messageTo',
                                    prefixedname: 'imap:messageTo',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'messageId',
                                    prefixedname: 'imap:messageId',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagDeleted',
                                    prefixedname: 'imap:flagDeleted',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'messageFrom',
                                    prefixedname: 'imap:messageFrom',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagSeen',
                                    prefixedname: 'imap:flagSeen',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'threadIndex',
                                    prefixedname: 'imap:threadIndex',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagAnswered',
                                    prefixedname: 'imap:flagAnswered',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagFlagged',
                                    prefixedname: 'imap:flagFlagged',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagRecent',
                                    prefixedname: 'imap:flagRecent',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'dateSent',
                                    prefixedname: 'imap:dateSent',
                                    title: 'Date Sent',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'messageSubject',
                                    prefixedname: 'imap:messageSubject',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'dateReceived',
                                    prefixedname: 'imap:dateReceived',
                                    title: 'Date Received',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'messageCc',
                                    prefixedname: 'imap:messageCc',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'messageHeaders',
                            prefixedname: 'imap:messageHeaders',
                            title: 'IMAP Message Headers',
                            properties: [
                                {
                                    name: 'messageHeaders',
                                    prefixedname: 'imap:messageHeaders',
                                    title: 'Message Headers',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'imapPreferences',
                            prefixedname: 'imap:imapPreferences',
                            title: 'IMAP Preferences',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'nonSubscribed',
                            prefixedname: 'imap:nonSubscribed',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'nonSelectable',
                            prefixedname: 'imap:nonSelectable',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'flaggable',
                            prefixedname: 'imap:flaggable',
                            properties: [
                                {
                                    name: 'flagAnswered',
                                    prefixedname: 'imap:flagAnswered',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagFlagged',
                                    prefixedname: 'imap:flagFlagged',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagDraft',
                                    prefixedname: 'imap:flagDraft',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagRecent',
                                    prefixedname: 'imap:flagRecent',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagDeleted',
                                    prefixedname: 'imap:flagDeleted',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'flagSeen',
                                    prefixedname: 'imap:flagSeen',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'imapFolder',
                            prefixedname: 'imap:imapFolder',
                            properties: [
                                {
                                    name: 'maxUid',
                                    prefixedname: 'imap:maxUid',
                                    title: 'MAXUId',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'changeToken',
                                    prefixedname: 'imap:changeToken',
                                    title: 'CHANGETOKEn',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'uidValidity',
                                    prefixedname: 'imap:uidValidity',
                                    title: 'UIDVALIDITy',
                                    dataType: 'd:long',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'alien',
                            prefixedname: 'trx: alien',
                            description: ' Nodes with this aspect are either alien nodes or have been invaded by other alien nodes',
                            title: 'Alien Node',
                            properties: [
                                {
                                    name: 'invadedBy',
                                    prefixedname: 'trx: invadedBy',
                                    title: 'Invaded By',
                                    description: ' The repositories that have invaded this node',
                                    dataType: 'd:text',
                                    defaultValue: false,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'enableable',
                            prefixedname: 'trx: enableable',
                            description: ' Enableable',
                            title: 'Enableable',
                            properties: [
                                {
                                    name: 'enabled',
                                    prefixedname: 'trx: enabled',
                                    title: 'Enabled',
                                    description: ' Is this enabled or disabled',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'transferred',
                            prefixedname: 'trx: transferred',
                            description: ' Nodes with this aspect have been transferred from one repository to another',
                            title: 'Transferred Node',
                            properties: [
                                {
                                    name: 'fromContent',
                                    prefixedname: 'trx: fromContent',
                                    title: 'ContentProperties',
                                    description: ' The content URLs transferred with this node',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'fromRepositoryId',
                                    prefixedname: 'trx: fromRepositoryId',
                                    title: 'From Repository Id',
                                    description: ' The id of the repository that transferred this node to this repository',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'repositoryId',
                                    prefixedname: 'trx: repositoryId',
                                    title: 'Source Repository.',
                                    description: ' The repository id that this node originates from.',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'transferRelated',
                            prefixedname: 'trx: transferRelated',
                            description: ' Nodes with this aspect are related to a particular transfer.',
                            title: 'Transfer Related',
                            properties: [
                                {
                                    name: 'transferId',
                                    prefixedname: 'trx: transferId',
                                    title: 'Transfer Id',
                                    description: ' Transfer Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'versionStoreRoot',
                            prefixedname: 'ver: versionStoreRoot',
                            title: 'Version Store Root',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'jsresource',
                            prefixedname: 'surf: jsresource',
                            title: 'JavaScript Resource',
                            properties: [
                                {
                                    name: 'mid',
                                    prefixedname: 'surf: mid',
                                    title: 'mid',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'label',
                                    prefixedname: 'surf: label',
                                    title: 'Label',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'surf: jsresource',
                            name: 'widget',
                            prefixedname: 'surf: widget',
                            title: 'Widget',
                            properties: [
                                {
                                    name: 'mid',
                                    prefixedname: 'surf: mid',
                                    title: 'mid',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'label',
                                    prefixedname: 'surf: label',
                                    title: 'Label',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'widgetType',
                                    prefixedname: 'surf: widgetType',
                                    title: 'Widget Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'surf: jsresource',
                            name: 'service',
                            prefixedname: 'surf: service',
                            title: 'Service',
                            properties: [
                                {
                                    name: 'mid',
                                    prefixedname: 'surf: mid',
                                    title: 'mid',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'label',
                                    prefixedname: 'surf: label',
                                    title: 'Label',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'hasComment',
                            prefixedname: 'hwf: hasComment',
                            title: 'Hybrid workflow comment aspect',
                            properties: [
                                {
                                    name: 'comments',
                                    prefixedname: 'hwf: comments',
                                    title: 'Comments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'hwf: hasComment',
                            name: 'approvalInfo',
                            prefixedname: 'hwf: approvalInfo',
                            title: 'Hybrid workflow comment aspect',
                            properties: [
                                {
                                    name: 'comments',
                                    prefixedname: 'hwf: comments',
                                    title: 'Comments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'requiredApprovalPercentage',
                                    prefixedname: 'hwf: requiredApprovalPercentage',
                                    title: 'Required approval percentage',
                                    dataType: 'd:int',
                                    defaultValue: 50,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraints: [
                                        {
                                            name: 'hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            prefixedname: 'hwf: hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            type: 'MINMAX',
                                            parameters: [
                                                {
                                                    name: 'minValue',
                                                    simpleValue: 1.0
                                                },
                                                {
                                                    name: 'maxValue',
                                                    simpleValue: 100.0
                                                }
                                            ]
                                        }
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'actualApprovalPercentage',
                                    prefixedname: 'hwf: actualApprovalPercentage',
                                    title: 'Actual approval percentage',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'hwf: approvalInfo',
                            name: 'hybridWorklfowInfo',
                            prefixedname: 'hwf: hybridWorklfowInfo',
                            title: 'Hybrid Workflow Info Aspect',
                            properties: [
                                {
                                    name: 'retainStrategy',
                                    prefixedname: 'hwf: retainStrategy',
                                    title: 'Retain cloud- content after completion',
                                    dataType: 'd:text',
                                    defaultValue: 'documentsUnSynced',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'hwf: allowedRetainStratagy'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'comments',
                                    prefixedname: 'hwf: comments',
                                    title: 'Comments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'cloudWorkflowType',
                                    prefixedname: 'hwf: cloudWorkflowType',
                                    title: 'Type',
                                    dataType: 'd:text',
                                    defaultValue: 'task',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'hwf: allowedCloudWorkflowType'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assignment',
                                    prefixedname: 'hwf: assignment',
                                    title: 'Status',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'requiredApprovalPercentage',
                                    prefixedname: 'hwf: requiredApprovalPercentage',
                                    title: 'Required approval percentage',
                                    dataType: 'd:int',
                                    defaultValue: 50,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraints: [
                                        {
                                            name: 'hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            prefixedname: 'hwf: hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            type: 'MINMAX',
                                            parameters: [
                                                {
                                                    name: 'minValue',
                                                    simpleValue: 1.0
                                                },
                                                {
                                                    name: 'maxValue',
                                                    simpleValue: 100.0
                                                }
                                            ]
                                        }
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'actualApprovalPercentage',
                                    prefixedname: 'hwf: actualApprovalPercentage',
                                    title: 'Actual approval percentage',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'hwf: hybridWorklfowInfo',
                            name: 'hybridWorkflow',
                            prefixedname: 'hwf: hybridWorkflow',
                            title: 'Hybrid workflow Aspect',
                            properties: [
                                {
                                    name: 'result',
                                    prefixedname: 'hwf: result',
                                    title: 'Result',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'retainStrategy',
                                    prefixedname: 'hwf: retainStrategy',
                                    title: 'Retain cloud- content after completion',
                                    dataType: 'd:text',
                                    defaultValue: 'documentsUnSynced',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'hwf: allowedRetainStratagy'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'comments',
                                    prefixedname: 'hwf: comments',
                                    title: 'Comments',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'cloudWorkflowType',
                                    prefixedname: 'hwf: cloudWorkflowType',
                                    title: 'Type',
                                    dataType: 'd:text',
                                    defaultValue: 'task',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'hwf: allowedCloudWorkflowType'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assignment',
                                    prefixedname: 'hwf: assignment',
                                    title: 'Status',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'workflowStatus',
                                    prefixedname: 'hwf: workflowStatus',
                                    title: 'Status',
                                    dataType: 'd:text',
                                    defaultValue: 'startedOnPremise',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'hwf: allowedWorkflowStatus'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'workflowPriority',
                                    prefixedname: 'hwf: workflowPriority',
                                    title: 'Due date',
                                    dataType: 'd:int',
                                    defaultValue: 2,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraintRefs: [
                                        'bpm:allowedPriority'
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'requiredApprovalPercentage',
                                    prefixedname: 'hwf: requiredApprovalPercentage',
                                    title: 'Required approval percentage',
                                    dataType: 'd:int',
                                    defaultValue: 50,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    constraints: [
                                        {
                                            name: 'hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            prefixedname: 'hwf: hybridWorkflowModel_approvalInfo_requiredApprovalPercentage_anon_0',
                                            type: 'MINMAX',
                                            parameters: [
                                                {
                                                    name: 'minValue',
                                                    simpleValue: 1.0
                                                },
                                                {
                                                    name: 'maxValue',
                                                    simpleValue: 100.0
                                                }
                                            ]
                                        }
                                    ],
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'actualApprovalPercentage',
                                    prefixedname: 'hwf: actualApprovalPercentage',
                                    title: 'Actual approval percentage',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'onPremiseWorkflowId',
                                    prefixedname: 'hwf: onPremiseWorkflowId',
                                    title: 'On - premise Workflow - id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'workflowDescription',
                                    prefixedname: 'hwf: workflowDescription',
                                    title: 'Description',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'workflowDueDate',
                                    prefixedname: 'hwf: workflowDueDate',
                                    title: 'Due date',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'AssetAspect',
                            prefixedname: 'pub:AssetAspect',
                            description: ' Applied to a node that has been published to an external delivery service',
                            title: 'Published Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URl',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:titled',
                            name: 'published',
                            prefixedname: 'pub:published',
                            description: ' Applied to a published node',
                            title: 'Published',
                            properties: [
                                {
                                    name: 'title',
                                    prefixedname: 'cm:title',
                                    title: 'Title',
                                    description: ' Content Title',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'cm:description',
                                    title: 'Description',
                                    description: ' Content Description',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'OAuth1DeliveryChannelAspect',
                            prefixedname: 'pub:OAuth1DeliveryChannelAspect',
                            description: ' Applied to delivery channels that use OAuth1',
                            title: 'OAuth1 Authenticated Delivery Channel',
                            properties: [
                                {
                                    name: 'oauth1TokenValue',
                                    prefixedname: 'pub:oauth1TokenValue',
                                    title: 'The value of the OAuth1 token',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'oauth1TokenSecret',
                                    prefixedname: 'pub:oauth1TokenSecret',
                                    title: 'The secret of the OAuth1 token',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            parentname: 'cm:titled',
                            name: 'channelInfo',
                            prefixedname: 'pub:channelInfo',
                            description: ' Applied to a node that exists within a Delivery Channel',
                            title: 'Channel Info',
                            properties: [
                                {
                                    name: 'title',
                                    prefixedname: 'cm:title',
                                    title: 'Title',
                                    description: ' Content Title',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channelType',
                                    prefixedname: 'pub:channelType',
                                    title: 'Containing Channel Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'description',
                                    prefixedname: 'cm:description',
                                    title: 'Description',
                                    description: ' Content Description',
                                    dataType: 'd:mltext',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'BOTH',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channel',
                                    prefixedname: 'pub:channel',
                                    title: 'Containing Channel Node',
                                    dataType: 'd:noderef',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'OAuth2DeliveryChannelAspect',
                            prefixedname: 'pub:OAuth2DeliveryChannelAspect',
                            description: ' Applied to delivery channels that use OAuth2',
                            title: 'OAuth2 Authenticated Delivery Channel',
                            properties: [
                                {
                                    name: 'oauth2Token',
                                    prefixedname: 'pub:oauth2Token',
                                    title: 'The value of the OAuth2 token',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'UserPasswordDeliveryChannelAspect',
                            prefixedname: 'pub:UserPasswordDeliveryChannelAspect',
                            description: ' Applied to delivery channels that use OAuth1',
                            title: 'Username and Password Authenticated Delivery Channel',
                            properties: [
                                {
                                    name: 'channelPassword',
                                    prefixedname: 'pub:channelPassword',
                                    title: 'The authenticated channel password',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'channelUsername',
                                    prefixedname: 'pub:channelUsername',
                                    title: 'The authenticated channel username',
                                    dataType: 'd:encrypted',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'shared',
                            prefixedname: 'qshare: shared',
                            properties: [
                                {
                                    name: 'sharedId',
                                    prefixedname: 'qshare: sharedId',
                                    title: 'Shared Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'sharedBy',
                                    prefixedname: 'qshare: sharedBy',
                                    title: 'Shared By',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: 'TRUE',
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'expiryDate',
                                    prefixedname: 'qshare: expiryDate',
                                    title: 'Shared Link Expiry Date',
                                    dataType: 'd:datetime',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: false,
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'parallelReviewStats',
                            prefixedname: 'wf: parallelReviewStats',
                            properties: [
                                {
                                    name: 'approveCount',
                                    prefixedname: 'wf: approveCount',
                                    title: 'Reviewers Who Approved',
                                    description: ' Reviewers who approved',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'reviewerCount',
                                    prefixedname: 'wf: reviewerCount',
                                    title: 'Number of Reviewers',
                                    description: ' Number of reviewers',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'requiredPercent',
                                    prefixedname: 'wf: requiredPercent',
                                    title: 'Required Approval Percentage',
                                    description: ' Required Approval Percentage',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'actualPercent',
                                    prefixedname: 'wf: actualPercent',
                                    title: 'Actual Approval Percentage',
                                    description: ' Actual approval percentage',
                                    dataType: 'd:int',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'blogDetails',
                            prefixedname: 'blg: blogDetails',
                            title: 'Blog Details',
                            properties: [
                                {
                                    name: 'description',
                                    prefixedname: 'blg: description',
                                    title: 'Blog Description',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'password',
                                    prefixedname: 'blg: password',
                                    title: 'Blog User Password',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'blogImplementation',
                                    prefixedname: 'blg: blogImplementation',
                                    title: 'Blog Type',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'userName',
                                    prefixedname: 'blg: userName',
                                    title: 'Blog User Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'name',
                                    prefixedname: 'blg: name',
                                    title: 'Blog Name',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'id',
                                    prefixedname: 'blg: id',
                                    title: 'Blog Identifier',
                                    dataType: 'd:text',
                                    defaultValue: 0,
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'url',
                                    prefixedname: 'blg: url',
                                    title: 'Blog URl',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'blogPost',
                            prefixedname: 'blg: blogPost',
                            title: 'Blog Post',
                            properties: [
                                {
                                    name: 'published',
                                    prefixedname: 'blg: published',
                                    title: 'Blog published',
                                    dataType: 'd:boolean',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'link',
                                    prefixedname: 'blg: link',
                                    title: 'Blog post link',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'lastUpdate',
                                    prefixedname: 'blg: lastUpdate',
                                    title: 'Date last updated',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'posted',
                                    prefixedname: 'blg: posted',
                                    title: 'Date posted',
                                    dataType: 'd:date',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                },
                                {
                                    name: 'postId',
                                    prefixedname: 'blg: postId',
                                    title: 'Blog post identifier',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'two',
                            prefixedname: 'test1: two',
                            properties: [
                                {
                                    name: 'test_name',
                                    prefixedname: 'test1: test_name',
                                    title: 'test_name',
                                    description: ' test_name',
                                    dataType: 'd:text',
                                    defaultValue: 'test',
                                    facetable: false,
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'test2',
                                    prefixedname: 'test1: test2',
                                    title: 'test2 label goes here',
                                    description: ' test2 description goes here',
                                    dataType: 'd:text',
                                    defaultValue: 'test, test2, test3',
                                    facetable: false,
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: 'TRUE',
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'obe',
                            prefixedname: 'test1: obe',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'sample_w',
                            prefixedname: 'test1: sample_w',
                            description: ' sample_w',
                            title: 'sample_w',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'rules',
                            prefixedname: 'rule: rules',
                            title: 'Rules',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'ignoreInheritedRules',
                            prefixedname: 'rule: ignoreInheritedRules',
                            title: 'Ignore Inherited Rules',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            parentname: 'pub:AssetAspect',
                            name: 'AssetAspect',
                            prefixedname: 'flickr: AssetAspect',
                            description: ' Applied to a node that has been published to Flickr',
                            title: 'Flickr Asset',
                            properties: [
                                {
                                    name: 'assetId',
                                    prefixedname: 'pub:assetId',
                                    title: 'Published Asset Id',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'assetUrl',
                                    prefixedname: 'pub:assetUrl',
                                    title: 'Published Asset URl',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'mv_aspect',
                            prefixedname: 'mv1: mv_aspect',
                            title: 'Multivalue',
                            properties: [
                                {
                                    name: 'list',
                                    prefixedname: 'mv1: list',
                                    title: 'List',
                                    dataType: 'd:text',
                                    facetable: false,
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: 'TRUE',
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    },
                    {
                        entry: {
                            name: 'sample',
                            prefixedname: 'mv1: sample',
                            properties: []
                        }
                    },
                    {
                        entry: {
                            name: 'resetPasswordInitialProperties',
                            prefixedname: 'resetpasswordwf: resetPasswordInitialProperties',
                            properties: [
                                {
                                    name: 'userEmail',
                                    prefixedname: 'resetpasswordwf: userEmail',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'userName',
                                    prefixedname: 'resetpasswordwf: userName',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'key',
                                    prefixedname: 'resetpasswordwf: key',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                },
                                {
                                    name: 'clientName',
                                    prefixedname: 'resetpasswordwf: clientName',
                                    dataType: 'd:text',
                                    facetable: 'UNSET',
                                    indexTokenisationMode: 'TRUE',
                                    multiValued: false,
                                    mandatoryEnforced: false,
                                    mandatory: false,
                                    indexed: true
                                }
                            ]
                        }
                    }
                ]
            }
        }).pipe(
            map((result) => this.filterAspectByConfig(visibleAspectList, result?.list?.entries))
        );
    }

    private filterAspectByConfig(visibleAspectList: string[], aspectEntries: any[]): AspectEntryModel[] {
        let result = aspectEntries ? aspectEntries : [];
        if (visibleAspectList?.length > 0 && aspectEntries) {
            result = aspectEntries.filter((value) => {
                return visibleAspectList.includes(value?.entry?.prefixedname);
            });
        }
        return result;
    }

    getVisibleAspects(): string[] {
        let visibleAspectList: string[] = [];
        const aspectVisibleConfg = this.appConfigService.get('aspect-visible');
        if (aspectVisibleConfg) {
            for (const aspectGroup of Object.keys(aspectVisibleConfg)) {
                visibleAspectList = visibleAspectList.concat(aspectVisibleConfg[aspectGroup]);
            }
        }
        return visibleAspectList;
    }

    openAspectListDialog(nodeId?: string): Observable<string[]> {
        const select = new Subject<string[]>();
        select.subscribe({
            complete: this.close.bind(this)
        });

        const data: AspectListDialogComponentData = {
            title: 'ADF-ASPECT-LIST.DIALOG.TITLE',
            description: 'ADF-ASPECT-LIST.DIALOG.DESCRIPTION',
            overTableMessage: 'ADF-ASPECT-LIST.DIALOG.OVER-TABLE-MESSAGE',
            select: select,
            nodeId
        };

        this.openDialog(data, 'adf-aspect-list-dialog', '750px');
        return select;
    }

    private openDialog(data: AspectListDialogComponentData, panelClass: string, width: string) {
        this.dialog.open(AspectListDialogComponent, {
            data,
            panelClass,
            width,
            disableClose: true
        });
    }

    close() {
        this.dialog.closeAll();
    }
}
