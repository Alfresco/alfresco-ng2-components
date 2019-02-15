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

import { Util } from '../../../util/util';
import { DataTablePage } from '../dataTablePage';
import { element, by } from 'protractor';

export class ProcessListCloudComponent {

    processList = element(by.css('adf-cloud-process-list'));
    noProcessFound = element.all(by.css("p[class='adf-empty-content__title']")).first();
    noOfColumns = element.all(by.css('adf-cloud-process-list adf-datatable .adf-datatable-header .adf-datatable-row .adf-datatable-table-cell-header'));
    id = element(by.css('div[data-automation-id="auto_id_entry.id"]'));
    name = element(by.css('div[data-automation-id="auto_id_entry.name"]'));
    status = element(by.css('div[data-automation-id="auto_id_entry.status"]'));
    startDate = element(by.css('div[data-automation-id="auto_id_entry.startDate"]'));
    appName = element(by.css('div[data-automation-id="auto_id_entry.appName"]'));
    businessKey = element(by.css('div[data-automation-id="auto_id_entry.businessKey"]'));
    description = element(by.css('div[data-automation-id="auto_id_entry.description"]'));
    initiator = element(by.css('div[data-automation-id="auto_id_entry.initiator"]'));
    lastModified = element(by.css('div[data-automation-id="auto_id_entry.lastModified"]'));
    processName = element(by.css('div[data-automation-id="auto_id_entry.processName"]'));
    processId = element(by.css('div[data-automation-id="auto_id_entry.processId"]'));
    processDefinitionId = element(by.css('div[data-automation-id="auto_id_entry.processDefinitionId"]'));
    processDefinitionKey = element(by.css('div[data-automation-id="auto_id_entry.processDefinitionKey"]'));


    dataTable = new DataTablePage(this.processList);

    getDataTable() {
        return this.dataTable;
    }

    checkProcessListIsLoaded() {
        Util.waitUntilElementIsVisible(this.processList);
        return this;
    }

    getNoProcessFoundMessage() {
        Util.waitUntilElementIsVisible(this.noProcessFound);
        return this.noProcessFound.getText();
    }

    getAllRowsByColumn(column) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

    getNoOfCoulmns() {
        return this.noOfColumns.count();
    }

    checkCloumnIdIsDisplayed() {
        Util.waitUntilElementIsVisible(this.id);
        return this;
    }

    checkCloumnNameIsDisplayed() {
        Util.waitUntilElementIsVisible(this.name);
        return this;
    }

    checkCloumnStatusIsDisplayed() {
        Util.waitUntilElementIsVisible(this.status);
        return this;
    }

    checkCloumnStartDateIsDisplayed() {
        Util.waitUntilElementIsVisible(this.startDate);
        return this;
    }

    checkCloumnAppNameIsDisplayed() {
        Util.waitUntilElementIsVisible(this.appName);
        return this;
    }

    checkCloumnBusinessKeyIsDisplayed() {
        Util.waitUntilElementIsVisible(this.businessKey);
        return this;
    }

    checkCloumnDescriptionIsDisplayed() {
        Util.waitUntilElementIsVisible(this.description);
        return this;
    }

    checkCloumnInitiatorIsDisplayed() {
        Util.waitUntilElementIsVisible(this.initiator);
        return this;
    }

    checkCloumnLastModifiedIsDisplayed() {
        Util.waitUntilElementIsVisible(this.lastModified);
        return this;
    }

    checkCloumnProcessNameIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processName);
        return this;
    }

    checkCloumnProcessIdIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processId);
        return this;
    }

    checkCloumnProcessDefinitionIdIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processDefinitionId);
        return this;
    }

    checkCloumnProcessDefinitionKeyIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processDefinitionKey);
        return this;
    }

}
