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

import { Component, OnInit, Optional, ViewChild , EventEmitter, Output,Input,OnDestroy,ElementRef} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlfrescoTranslationService,
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,RenditionsService, AlfrescoApiService  } from 'ng2-alfresco-core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';


import {
    DocumentActionsService,
    DocumentList,
    ContentActionHandler,
    DocumentActionModel,
    FolderActionModel
} from 'ng2-alfresco-documentlist';
import { FormService } from 'ng2-activiti-form';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Component({
    selector: 'files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit{
  // currentPath: string = '/Sites/swsdp/documentLibrary';
	currentPath: string = '/User Homes';
    rootFolderId: string = '-root-';
   relativePath='/User Homes/tera@dev-tera.siftgrid.com/78f832b8/cb66073a';
    currentFolderId: string = null;
 searchTerm: string = '';
     authenticated: boolean;
    // ecmHost: string = 'https://' + 'alfresco.siftgrid.com' + ':443';
	   ecmHost: string = 'http://' + 'localhost' + ':8080';
    bpmHost: string = 'http://' + 'localhost' + ':9999';
ticket: string;
    errorMessage: string = null;
    fileNodeId: any;
    fileShowed: boolean = false;
    multipleFileUpload: boolean = false;
    folderUpload: boolean = false;
    acceptedFilesTypeShow: boolean = false;
    versioning: boolean = false;
	isPdfAvailable: boolean = false;

    acceptedFilesType: string = '.jpg,.pdf,.js';

    get uploadRootFolderId(): string {
        return this.currentFolderId || this.rootFolderId;
    }

    get uploadFolderPath(): string {
        return this.currentFolderId ? '/' : this.currentPath;
    }

    @ViewChild(DocumentList)
    documentList: DocumentList;
 @Output()
    expand = new EventEmitter();
    constructor(private documentActions: DocumentActionsService,
                public auth: AlfrescoAuthenticationService,
                private formService: FormService,
                private router: Router,
                @Optional() private route: ActivatedRoute,
			   public settingsService: AlfrescoSettingsService,
                private translate: AlfrescoTranslationService,
				private http: Http,
				private rendination: RenditionsService,
				private apiService: AlfrescoApiService
               
				
				) {
				 settingsService.ecmHost = this.ecmHost;
        settingsService.setProviders('ECM');
if (this.auth.getTicketEcm()) {
            this.ticket = this.auth.getTicketEcm();
        }
				
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
		
		
		
    }
    login() {
        this.auth.login('admin', 'bizruntime@123').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.auth.getTicketEcm();
				this.authenticated = true;
				//this.rendination.isRenditionAvailable('25735d71-ed1d-46cc-9d8d-8d7e3f084fd2', 'pdf');
				//this.rendination.createRendition('25735d71-ed1d-46cc-9d8d-8d7e3f084fd2', 'pdf')
				//this.addTenant();
				//this.addperson(this.ticket);
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
	 createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('admin:admin')); 
  }
	  onSearchSubmit(event) {
        this.router.navigate(['/search', {
            q: event.value
        }]);
    }

    onItemClicked(event: MinimalNodeEntity) {
        if (event.entry.isFile) {
            this.fileNodeId = event.entry.id;
            this.fileShowed = true;
        } else if (event.entry.isFolder) {
            this.router.navigate(['/files', event.entry.id]);
        }
    }

    onSearchTermChange(event) {
        this.searchTerm = event.value;
    }

    onExpandToggle(event) {
        this.expand.emit(event);
    }

	
	
	 addTenant(){

      let url = 'http://52.228.43.163:8080/alfresco/s/api/tenants';
           let headers = new Headers();
		    this.createAuthorizationHeader(headers);
			let userInfo = {tenantDomain : "dev-beta6.siftgrid.com" , tenantAdminPassword: "bizruntime@123" , tenantContentStoreRoot : "C:/ALFRES~1/alf_data/contentstore/dev-gamma.siftgrid.com"};
             let body = JSON.stringify(userInfo);           
		   let options = new RequestOptions({ headers: headers });

            this.http.post(url, body, options).map(res => res.json()).
                subscribe((response) => {
                    console.log(response);
					
					
					
									
                },
                (error) => { console.log(error); },
                () => { console.log("completed."); });
				
				this.getTickt();
				   
   
   }
   
    getTickt() {
	console.log("inside get  Ticket")
        this.auth.login('admin@dev-beta6.siftgrid.com', 'bizruntime@123').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.auth.getTicketEcm();
				this.authenticated = true;
				this.addperson(this.ticket);
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }
   
   
    addperson(ticket){

      let url = 'http://52.228.43.163:8080/alfresco/service/api/people?alf_ticket='+ticket;
            let headers = new Headers({ 'Content-Type': 'application/json' });
			let userInfo = {userName : "testuser" , password: "testpassword" , firstName : "testfirst", lastName : "testlast", email : "testemail@test.com",  disableAccount: false, quote: -1, groups: []};
             let body = JSON.stringify(userInfo);           
		   let options = new RequestOptions({ headers: headers });

            this.http.post(url, body, options).map(res => res.json()).
                subscribe((response) => {
                    console.log(response)
                },
                (error) => { console.log(error); },
                () => { console.log("completed."); });
        
   
   }
	
	
	
	
   onToggleSearch(event) {
        let expandedHeaderClass = 'header-search-expanded',
            header = document.querySelector('header');
        if (event.expanded) {
            header.classList.add(expandedHeaderClass);
        } else {
            header.classList.remove(expandedHeaderClass);
        }
    }

    changeLanguage(lang: string) {
        this.translate.use(lang);
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        //document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }

    private setEcmHost() {
        if (localStorage.getItem(`ecmHost`)) {
            this.settingsService.ecmHost = localStorage.getItem(`ecmHost`);
            this.ecmHost = localStorage.getItem(`ecmHost`);
        } else {
            this.settingsService.ecmHost = this.ecmHost;
        }
    }

    private setBpmHost() {
        if (localStorage.getItem(`bpmHost`)) {
            this.settingsService.bpmHost = localStorage.getItem(`bpmHost`);
            this.bpmHost = localStorage.getItem(`bpmHost`);
        } else {
            this.settingsService.bpmHost = this.bpmHost;
        }
    }

    private setProvider() {
        if (localStorage.getItem(`providers`)) {
            this.settingsService.setProviders(localStorage.getItem(`providers`));
        }
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.entry.name);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.entry.name);
    }

    showFile(event) {
        if (event.value.entry.isFile) {
            this.fileNodeId = event.value.entry.id;
            this.fileShowed = true;
			//this.rendination.isRenditionAvailable(this.fileNodeId, 'pdf');
			//this.rendination.isConversionPossible(this.fileNodeId, 'pdf');
		    //this.rendination.createRendition(this.fileNodeId, 'pdf');
			//this.rendination.getRenditionsListByNodeId(this.fileNodeId);
					
			
        } else {
            this.fileShowed = false;
        }
    }

    onFolderChanged(event?: any) {
        if (event) {
            this.currentPath = event.path;
        }
    }

    onBreadcrumbPathChanged(event?: any) {
        if (event) {
            this.currentPath = event.value;
        }
    }

    toggleMultipleFileUpload() {
        this.multipleFileUpload = !this.multipleFileUpload;
        return this.multipleFileUpload;
    }

    toggleFolder() {
        this.multipleFileUpload = false;
        this.folderUpload = !this.folderUpload;
        return this.folderUpload;
    }

    toggleAcceptedFilesType() {
        this.acceptedFilesTypeShow = !this.acceptedFilesTypeShow;
        return this.acceptedFilesTypeShow;
    }

    toggleVersioning() {
        this.versioning = !this.versioning;
        return this.versioning;
    }

    ngOnInit() {
	this.login();
	
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.currentFolderId = params.hasOwnProperty('id') ? params['id'] : null;
            });
        }
        if (this.auth.isBpmLoggedIn()) {
            this.formService.getProcessDefinitions().subscribe(
                defs => this.setupBpmActions(defs || []),
                err => console.log(err)
            );
        } else {
            console.log('You are not logged in');
        }
    }

    viewActivitiForm(event?: any) {
        this.router.navigate(['/activiti/tasksnode', event.value.entry.id]);
    }

    onNavigationError(err: any) {
        if (err) {
            this.errorMessage = err.message || 'Navigation error';
        }
    }

    resetError() {
        this.errorMessage = null;
    }

    private setupBpmActions(actions: any[]) {
        actions.map(def => {
            let documentAction = new DocumentActionModel();
            documentAction.title = 'Activiti: ' + (def.name || 'Unknown process');
            documentAction.handler = this.getBpmActionHandler(def);
            this.documentList.actions.push(documentAction);

            let folderAction = new FolderActionModel();
            folderAction.title = 'Activiti: ' + (def.name || 'Unknown process');
            folderAction.handler = this.getBpmActionHandler(def);
            this.documentList.actions.push(folderAction);
        });
    }

    private getBpmActionHandler(processDefinition: any): ContentActionHandler {
        return function (obj: any, target?: any) {
            window.alert(`Starting BPM process: ${processDefinition.id}`);
        }.bind(this);
    }
}
