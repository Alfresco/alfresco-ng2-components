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

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ObjectUtils } from 'ng2-alfresco-core';
import { WidgetComponent } from './../widget.component';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'dropdown-widget',
    templateUrl: './dropdown.widget.html',
    styleUrls: ['./dropdown.widget.css']
})
export class DropdownWidget extends WidgetComponent implements OnInit {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private http: Http) {
        super();
    }

    ngOnInit() {
        if (this.field &&
            this.field.optionType === 'rest' &&
            this.field.restUrl &&
            this.field.restIdProperty &&
            this.field.restLabelProperty) {

            let url = `${this.field.restUrl}`;
            this.http.get(url).subscribe(
                response => {
                    let json: any = response.json();
                    this.loadFromJson(json);
                },
                this.handleError
            );
        }
    }

    // TODO: support 'restResponsePath'
    loadFromJson(json: any): boolean {
        if (this.field && json && json instanceof Array) {
            let options = json.map(obj => {
                return {
                    id: ObjectUtils.getValue(obj, this.field.restIdProperty).toString(),
                    name: ObjectUtils.getValue(obj, this.field.restLabelProperty).toString()
                };
            });
            this.field.options = options;
            this.field.updateForm();
            return true;
        }
        return false;
    }


    handleError(error: any) {
        let errMsg = DropdownWidget.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : DropdownWidget.GENERIC_ERROR_MESSAGE;
        }
        console.error(errMsg);
    }

}
