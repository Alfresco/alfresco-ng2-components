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

import { Component, Input } from '@angular/core';
import { AlfrescoAuthenticationService, RenditionsService, AlfrescoApiService} from 'ng2-alfresco-core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
//imported  data

@Component({
    moduleId: module.id,
    selector: 'not-supported-format',
    templateUrl: './notSupportedFormat.component.html',
    styleUrls: ['./notSupportedFormat.component.css']
})
export class NotSupportedFormat {

    @Input()
    nameFile: string;

    @Input()
    urlFile: string;
	
	 @Input()
    nodeId: string;
	
	urlFileContent: string;

   

    loaded: boolean = false;
    isPdfAvailable: boolean = false;
	 authenticated: boolean;
    // ecmHost: string = 'https://' + 'alfresco.siftgrid.com' + ':443';
	   ecmHost: string = 'http://' + '52.228.36.174' + ':8080';
    bpmHost: string = 'http://' + '52.228.36.174' + ':9999';
    ticket: string;
	 constructor(private authService: AlfrescoAuthenticationService, private renditionsService: RenditionsService, private http: Http,private apiService: AlfrescoApiService) {
    }

	

    /**
     * Download file opening it in a new window
     */
    download() {
        window.open(this.urlFile);
    }
	
	
	 openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

//


 openPDF() {
	console.log("inside get  Ticket")
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.authService.getTicketEcm();
				this.authenticated = true;
				window.open('http://52.228.36.174:8080/share/page/document-details?nodeRef=workspace://SpacesStore/'+this.nodeId,'popup','width=600,height=600');
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }

	
	/*
	
	Create   Pdf  Version
	
	*/
	
      
	 ngOnChanges() {
	 console.log("ngOnChanges");
	   if (this.nodeId) {
	   console.log("---------nodeId-------"+this.nodeId);

            this.handlePdfConversion();
			this.getPdfConversionDetails();
			this.getAllRedition();
        }
    }
	
	 createPdfVersion(){
	
	this.openInNewTab('http://52.228.36.174:8080/share/page/document-details?nodeRef=workspace://SpacesStore/d07f5ad6-6fc7-43b6-afcd-34b7daa9dd79');
	
	}

    handlePdfConversion() {
	console.log("inside handlePdfConversion");
	


        this.renditionsService.isRenditionAvailable(this.nodeId, 'pdf').subscribe((conversionPresent) => {
            this.isPdfAvailable = true;
			
            if (conversionPresent) {
			console.log("conversionPresent");
			
                this.renditionsService.getRendition(this.nodeId, 'pdf').subscribe((rendition) => {
                    console.log(rendition);
			    console.log('alfresco  get  rendination content');
				
							
			    
                }, () => {
                    this.isPdfAvailable = false;
                });
            } else {
			console.log("conversionNotPresent");
                this.renditionsService.createRendition(this.nodeId, 'pdf').subscribe((rendition) => {
                    console.log(rendition);
                }, () => {
                    this.isPdfAvailable = false;
                });
            }
        }, (error) => {
            this.isPdfAvailable = false;
            console.error(error);
        });
    }
	
	
	
	
	 getPdfConversionDetails() {
	console.log("-----inside getPdfConversionDetails");
	 let alfrescoApi = this.apiService.getInstance();
     this.renditionsService.getRenditionContent(this.nodeId, 'pdf')
	 
.subscribe(res => {
    console.log(res);
	console.log("-----inside getPdfConversionDetails");
});

    }
	
	 getAllRedition() {
	console.log("-----inside getAllRedition");
	
       this.renditionsService.getRenditionsListByNodeId(this.nodeId).subscribe(res => {
    console.log('Respponse'+res);
	console.log("-----inside getAllRedition");
});

    }
	
	
	
}
