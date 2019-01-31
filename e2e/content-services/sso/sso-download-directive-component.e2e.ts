import { SettingsPage } from '../../pages/adf/settingsPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import TestConfig = require('../../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { LoginSSOPage } from '../../pages/adf/loginSSOPage';
import { LoginPage } from '../../pages/adf/loginPage';
import { AcsUserModel } from "../../models/ACS/acsUserModel";
import { UploadActions } from "../../actions/ACS/upload.actions";
import { FileModel } from "../../models/ACS/fileModel";
import resources = require('../../util/resources');
import AlfrescoApi = require('alfresco-js-api-node');
import {Test} from "tslint";

describe('SSO - Download Directive', () => {

    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const loginSsoPage = new LoginSSOPage();
    const loginPage = new LoginPage();
    let silentLogin;
    let implicitFlow;
    let uploadActions = new UploadActions();
    let user = new AcsUserModel();

    let firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(user);

        await this.alfrescoJsApi.login(user.id, user.password);

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, '-my-');

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);

        Object.assign(pngFileModel, pngUploadedFile.entry);

        done();
    });

    afterAll(async (done) => {
        let nodesPromise = await contentServicesPage.getContentList().getAllNodeIdInList();

        nodesPromise.forEach(async (currentNodePromise) => {
            await currentNodePromise.then(async (currentNode) => {
                if (currentNode && currentNode !== 'Node id') {
                    await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, currentNode);
                }
            });
        });

        done();
    });

    afterEach(() => {
        navigationBarPage.clickLogoutButton();
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    it('[C261050] Should be possible login in the PS with SSO', () => {
        silentLogin = false;
        implicitFlow = true;
        settingsPage.setProviderEcmSso(silentLogin, implicitFlow);
        loginSsoPage.clickOnSSOButton();
        loginSsoPage.loginAPS(user.id, user.password);
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
        browser.sleep(20000);
    });

});
