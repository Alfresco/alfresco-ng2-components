/**
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
import {Component} from 'angular2/core';
import {DOCUMENT_LIST_DIRECTIVES, DOCUMENT_LIST_PROVIDERS} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';
import {MDL} from 'ng2-alfresco-core/material';

@Component({
    selector: 'files-component',
    template: `
        <div class="container-fluid p-10">
            <div class="row">
                <div class="col-md-2">
                    <ul class="list-unstyled">
                        <li>
                            <label mdl class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
                                <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" [(ngModel)]="thumbnails">
                                <span class="mdl-checkbox__label">Thumbnails</span>
                            </label>
                        </li>
                        <li>
                            <label mdl class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-2">
                                <input type="checkbox" id="checkbox-2" class="mdl-checkbox__input" [(ngModel)]="breadcrumb">
                                <span class="mdl-checkbox__label">Breadcrumb</span>
                            </label>
                        </li>
                        <li>
                            <label mdl class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-3">
                                <input type="checkbox" id="checkbox-3" class="mdl-checkbox__input" [(ngModel)]="navigation">
                                <span class="mdl-checkbox__label">Navigation</span>
                            </label>
                        </li>
                        <li>
                            <label mdl class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-4">
                                <input type="checkbox" id="checkbox-4" class="mdl-checkbox__input" [(ngModel)]="downloads">
                                <span class="mdl-checkbox__label">Downloads</span>
                            </label>
                        </li>
                    </ul>
                    <hr>
                    <ul class="list-unstyled" style="font-size: 10px">
                        <li *ngFor="#event of events">
                            <strong>{{event.name}}</strong>: {{event.value.displayName}}
                        </li>
                    </ul>
                </div>
                <div class="col-md-10">
                    <alfresco-document-list #list
                        [thumbnails]="thumbnails"
                        [breadcrumb]="breadcrumb"
                        [navigate]="navigation"
                        [downloads]="downloads"
                        (itemClick)="onItemClick($event)">
                        <quick-folder-actions>
                            <quick-folder-action title="Delete" handler="system1"></quick-folder-action>
                        </quick-folder-actions>
                        <folder-actions>
                            <folder-action title="Default folder action 1" handler="system1"></folder-action>
                            <folder-action title="Custom folder action" (execute)="myFolderAction1($event)"></folder-action>
                        </folder-actions>
                        <quick-document-actions>
                            <quick-document-action icon="glyphicon glyphicon-pushpin" handler="system1"></quick-document-action>
                        </quick-document-actions>
                        <document-actions>
                            <document-action title="System action" handler="system2"></document-action>
                            <document-action title="Custom action" (execute)="myCustomAction1($event)"></document-action>
                        </document-actions>
                    </alfresco-document-list>
                </div>
            </div>
        </div>
    `,
    directives: [DOCUMENT_LIST_DIRECTIVES, MDL],
    providers: [DOCUMENT_LIST_PROVIDERS]
})
export class FilesComponent {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
    navigation: boolean = true;
    downloads: boolean = true;

    events: any[] = [];

    onItemClick($event) {
        console.log($event.value);
        this.events.push({
            name: 'Item Clicked',
            value: $event.value
        });
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.displayName);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.displayName);
    }
}
