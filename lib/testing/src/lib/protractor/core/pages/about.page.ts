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

import { $ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { DataTableComponentPage } from './data-table-component.page';

export class AboutPage {

    moduleColumns = {
        id: 'id',
        title: 'title',
        installDate: 'installDate',
        installState: 'installState',
        versionMin: 'versionMin'
    };

    licenseColumns = {
        issuedAt: 'issuedAt',
        expiresAt: 'expiresAt',
        remainingDays: 'remainingDays',
        holder: 'holder',
        mode: 'mode'
    };

    statusColumns = {
        isReadOnly: 'isReadOnly',
        isAuditEnabled: 'isAuditEnabled'
    };

    packageColumns = {
        name: 'name',
        version: 'version'
    };

    appTitle = $('[data-automation-id="adf-github-app-title"]');
    sourceCodeTitle = $('[data-automation-id="adf-github-source-code-title"]');
    githubUrl = $('[data-automation-id="adf-github-url"]');
    githubVersion = $('[data-automation-id="adf-github-version"]');
    bpmHost = $('[data-automation-id="adf-process-service-host"]');
    ecmHost = $('[data-automation-id="adf-content-service-host"]');
    productVersionTitle = $('[data-automation-id="adf-about-product-version-title"]');
    bpmEdition = $('[data-automation-id="adf-about-bpm-edition"]');
    ecmEdition = $('[data-automation-id="adf-about-ecm-edition"]');
    bpmVersion = $('[data-automation-id="adf-about-bpm-version"]');
    ecmVersion = $('[data-automation-id="adf-about-ecm-version"]');
    ecmStatusTitle = $('[data-automation-id="adf-about-ecm-status-title"]');
    ecmLicenseTitle = $('[data-automation-id="adf-about-ecm-license-title"]');
    ecmModulesTitle = $('[data-automation-id="adf-about-ecm-modules-title"]');
    aboutModulesTitle = $('[data-automation-id="adf-about-modules-title"]');

    dataTable = new DataTableComponentPage();

    getDataTable(): DataTableComponentPage {
        return this.dataTable;
    }

    async checkStatusColumnsIsDisplayed(): Promise<void> {
        await  this.checkColumnIsDisplayed(this.statusColumns.isAuditEnabled);
        await  this.checkColumnIsDisplayed(this.statusColumns.isReadOnly);
    }

    async checkPackageColumnsIsDisplayed(): Promise<void> {
        await  this.checkColumnIsDisplayed(this.packageColumns.name);
        await  this.checkColumnIsDisplayed(this.packageColumns.version);
    }

    async checkLicenseColumnsIsDisplayed(): Promise<void> {
        await  this.checkColumnIsDisplayed(this.licenseColumns.expiresAt);
        await  this.checkColumnIsDisplayed(this.licenseColumns.issuedAt);
        await  this.checkColumnIsDisplayed(this.licenseColumns.remainingDays);
        await  this.checkColumnIsDisplayed(this.licenseColumns.holder);
        await  this.checkColumnIsDisplayed(this.licenseColumns.mode);
    }

    async checkModulesColumnsIsDisplayed(): Promise<void> {
        await  this.checkColumnIsDisplayed(this.moduleColumns.id);
        await  this.checkColumnIsDisplayed(this.moduleColumns.installDate);
        await  this.checkColumnIsDisplayed(this.moduleColumns.installState);
        await  this.checkColumnIsDisplayed(this.moduleColumns.versionMin);
        await  this.checkColumnIsDisplayed(this.moduleColumns.title);
    }

    async checkAboutListIsLoaded() {
        await this.dataTable.tableIsLoaded();
        await this.dataTable.waitTillContentLoaded();
    }

    async checkAppTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    async checkAboutModulesTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.aboutModulesTitle);
    }

    async checkSourceCodeTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sourceCodeTitle);
    }

    async checkGithubUrlIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.githubUrl);
    }

    async checkGithubVersionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.githubVersion);
    }

    async checkBpmHostIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.githubUrl);
    }

    async checkEcmHostIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.githubVersion);
    }

    async checkProductVersionTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.productVersionTitle);
    }
    async checkBpmEditionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmEdition);
    }

    async checkEcmEditionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmEdition);
    }

    async checkBpmVersionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmVersion);
    }
    async checkEcmVersionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmVersion);
    }
    async checkEcmStatusTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmStatusTitle);
    }

    async checkEcmLicenseTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmLicenseTitle);
    }

    async checkEcmModulesTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmModulesTitle);
    }

    async checkColumnIsDisplayed(column: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($(`div[data-automation-id="auto_id_${column}"]`));
    }

}
