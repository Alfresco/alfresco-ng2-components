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

import { Component, OnInit, ViewChild, ChildNode } from '@angular/core';
import { Router } from '@angular/router';
import {
    PaginationComponent,
    DataColumn,
    DataRow,
    ObjectDataColumn
} from 'ng2-alfresco-datatable';
import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS,
    DocumentList,
    ShareDataRow,
    RowFilter,
    MinimalNodeEntity,
    ImageResolver
} from 'ng2-alfresco-documentlist';
import {
    MDL,
    AlfrescoContentService,
    CONTEXT_MENU_DIRECTIVES,
    AlfrescoPipeTranslate,
    AlfrescoSettingsService
} from 'ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS } from 'ng2-alfresco-upload';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import { FormService } from 'ng2-activiti-form';
import { PatientModel } from './patient.model';
import { TagModel, TagCache, TagFilter } from './tag.model';
import { TagService } from './tag.service';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'patients-component',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.css'],
    directives: [
        DOCUMENT_LIST_DIRECTIVES,
        MDL,
        ALFRESCO_ULPOAD_COMPONENTS,
        VIEWERCOMPONENT,
        CONTEXT_MENU_DIRECTIVES,
        PaginationComponent
    ],
    providers: [DOCUMENT_LIST_PROVIDERS, FormService, TagService],
    pipes: [AlfrescoPipeTranslate]
})
export class PatientsComponent implements OnInit {

    private DEFAULT_PATH: string = '/Sites/swsdp/documentLibrary';

    currentPath: string = this.DEFAULT_PATH;

    urlFile: string;
    fileName: string;
    mimeType: string;
    fileShowed: boolean = false;

    acceptedFilesType: string = '.jpg,.pdf,.js';

    @ViewChild(DocumentList)
    documentList: DocumentList;

    newPatient: PatientModel;
    debugMode: boolean = false;

    tags: TagCache = {};
    tagFilters: TagFilter[] = [];
    selectedNode: MinimalNodeEntity;
    selectedNodeProperties: NodePropertyModel[] = [];
    selectedNodePropertiesName: string;
    tagFilter: RowFilter;
    folderImageResolver: ImageResolver;
    ticket: string = localStorage.getItem('ticket-ECM');
    ecmHost: string;
    detailsAvatarImage: string;
    isVisitFolder: boolean = false;
    private patientLayout: DataColumn[] = [];
    private fileLayout: DataColumn[] = [];
    emptyimgSrc: string = "app/img/anonymous.gif";

    constructor(private contentService: AlfrescoContentService,
                private router: Router,
                private tagService: TagService,
                private alfrescoSettingsService: AlfrescoSettingsService) {
        this.newPatient = new PatientModel();
        this.ecmHost = alfrescoSettingsService.ecmHost;
        this.tagFilter = (row: ShareDataRow) => {
            let selectedTags = this.tagFilters
                .filter(f => f.isSelected)
                .map(f => f.id);

            if (selectedTags.length > 0) {
                let properties = row.node.entry.properties;
                if (properties) {
                    let tags = properties['cm:taggable'];
                    if (tags && tags instanceof Array && tags.length > 0) {

                        let result = false;

                        for (let i = 0; i < selectedTags.length; i++) {
                            if (tags.indexOf(selectedTags[i]) > -1) {
                                result = true;
                                break;
                            }
                        }

                        return result;
                    }
                }
                return false;
            }

            return true;
        };

        this.folderImageResolver = (row: DataRow, col: DataColumn) => {
            let isFolder = <boolean> row.getValue('isFolder');
            if (isFolder) {
                let value = row.getValue(col.key);
                return this.alfrescoSettingsService.ecmHost + `/alfresco/api/-default-/public/alfresco/versions/1/nodes/` +
                    value + '/content?attachment=false&alf_ticket=' + this.ticket;
            }
            return null;
        };

        this.patientLayout = this.getPatientLayout();
        this.fileLayout = this.getFileLayout();
    }

    isAdmin() {
        if (localStorage.getItem(`username`) === 'admin') {
            return true;
        } else {
            return false;
        }
    }

    resetFilters() {
        if (this.tagFilters && this.tagFilters.length > 0) {
            this.tagFilters.map(f => f.isSelected = false);
            this.documentList.reload();
        }
    }

    patientDetails(event: any) {
        this.router.navigate(['/patientdetails', event.value.entry.id]);
    }

    showFile(event) {
        if (event.value.entry.isFile) {
            this.fileName = event.value.entry.name;
            this.mimeType = event.value.entry.content.mimeType;
            this.urlFile = this.contentService.getContentUrl(event.value);
            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }

    onFolderChanged(event?: any) {
        if (event) {
            this.selectedNode = null;
            this.selectedNodeProperties = null;


            this.currentPath = event.path;
            this.loadTags();
            if (this.currentPath === this.DEFAULT_PATH) {
                this.folderImageResolver = (row: DataRow, col: DataColumn) => {
                    let isFolder = <boolean> row.getValue('isFolder');
                    if (isFolder) {
                        let value = row.getValue(col.key);
                        return this.alfrescoSettingsService.ecmHost + `/alfresco/api/-default-/public/alfresco/versions/1/nodes/` +
                            value + '/content?attachment=false&alf_ticket=' + this.ticket;
                    }
                    return null;
                };
                this.documentList.data.setColumns(this.patientLayout);
                this.isVisitFolder = false;
            } else {
                this.documentList.data.setColumns(this.fileLayout);
                this.folderImageResolver = (row: DataRow, col: DataColumn) => {
                    return 'app/img/checklist.svg';
                };
                this.isVisitFolder = true;
            }
        }
    }

    ngOnInit() {
        // this.loadTags();
    }

    onNodeClicked(event?: any) {
        console.log(event);
        if (event && event.value) {
            this.selectedNodeProperties = null;
            this.selectedNode = <MinimalNodeEntity> event.value;
            this.selectedNodePropertiesName = event.value.entry.name;
            if(this.isVisitFolder){
                this.detailsAvatarImage = 'app/img/checklist.svg';
            }else{
                this.detailsAvatarImage = this.ecmHost + '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + this.selectedNodePropertiesName + '/content?attachment=false&alf_ticket=' + this.ticket;
            }
            if (this.selectedNode) {
                this.selectedNodeProperties = this.getNodeProperties(this.selectedNode);
                console.log(this.selectedNodeProperties);
            }
        }
    }

    onFilterChanged(event) {
        setTimeout(() => {
            this.documentList.reload();
        }, 500);
    }

    addTag(event){
        let self = this;
        let nodeId = event.value.entry.id;
        let dialog = document.querySelector('dialog');
        if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
        dialog.querySelector('.close').addEventListener('click', function() {
            dialog.close();
        });
        dialog.querySelector('.save').addEventListener('click', function() {
            self.setNodeTags(nodeId, dialog.querySelector('#node-tags').value);
            dialog.close();
        });
    }

    setNodeTags(nodeId: string, value: string) {
        if (nodeId && value) {
            let tags = value.split(',').map(val => {
                return {
                    tag: val.trim()
                }
            });

            this.tagService.addTags(nodeId, tags).then(
                data => {
                    console.log(data);
                    // TODO: share seems to have issues with returning newly created tags
                    // it sometimes takes several seconds for changes to global tags to propagate
                    // and become visible
                    /*
                     this.getTags().then(
                     res => {
                     console.log('after tags updated');
                     console.log(res);
                     this.tags = res || [];
                     this.documentList.reload();
                     },
                     this.handleError
                     );
                     */
                },
                this.handleError
            );
        }
    }


    scheduleAppointment(event?: any) {
        this.router.navigate(['/startvisit', event.value.entry.id]);
    }

    private getNodeProperties(node: MinimalNodeEntity): NodePropertyModel[] {
        let result = [];

        if (node && node.entry && node.entry.properties) {
            let props = node.entry.properties;
            Object.keys(props).forEach(key => {
                result.push(new NodePropertyModel(key, props[key]));
            });
        }

        return result;
    }

    private loadTags() {
        this.tagService.getTags().then(
            (tags: TagModel[]) => {
                this.tagFilters = tags.map((tag) => new TagFilter(tag.id, tag.tag));
                tags.forEach(tag => this.tags[tag.id] = tag);
            },
            this.handleError
        );
    }

    private handleError(err) {
        console.log(err);
    }

    private getPatientLayout(): DataColumn[] {
        return [
            new ObjectDataColumn({
                key: 'name',
                type: 'image'
            }),
            new ObjectDataColumn({
                title: 'First Name',
                key: 'properties.hc:firstName',
                sortable: true,
                cssClass: 'desktop-only'
            }),
            new ObjectDataColumn({
                title: 'Last Name',
                key: 'properties.hc:lastName',
                sortable: true,
                cssClass: 'desktop-only'
            }),
            new ObjectDataColumn({
                title: 'Doctor',
                key: 'properties.hc:doctor',
                sortable: true,
                cssClass: 'desktop-only'
            }),
            new ObjectDataColumn({
                title: 'Created On',
                key: 'createdAt',
                type: 'date',
                format: 'shortDate',
                sortable: true,
                cssClass: 'desktop-only'
            })
        ];
    }

    private getFileLayout(): DataColumn[] {
        return [
            new ObjectDataColumn({
                key: '$thumbnail',
                type: 'image'
            }),
            new ObjectDataColumn({
                title: 'Display Name',
                key: 'name',
                sortable: true,
                cssClass: 'full-width ellipsis-cell'
            }),
            new ObjectDataColumn({
                title: 'Created By',
                key: 'createdByUser.displayName',
                sortable: true,
                cssClass: 'desktop-only'
            }),
            new ObjectDataColumn({
                title: 'Created On',
                key: 'createdAt',
                type: 'date',
                format: 'shortDate',
                sortable: true,
                cssClass: 'desktop-only'
            })
        ];
    }
}

class NodePropertyModel {

    prefix: string;
    name: string;
    value: string;
    fullName: string;

    constructor(name: string, value: string) {
        this.fullName = name;
        this.name = name;
        if (name) {
            let idx = name.indexOf(':');
            if (idx > -1) {
                this.prefix = name.substring(0, idx);
                this.name = name.substring(idx + 1);
            }
        }
        this.value = value;
    }
}
