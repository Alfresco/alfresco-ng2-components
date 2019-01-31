import { SettingsPage } from '../../pages/adf/settingsPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import TestConfig = require('../../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { LoginSSOPage } from '../../pages/adf/loginSSOPage';
import { LoginPage } from '../../pages/adf/loginPage';
import { UploadActions } from "../../actions/ACS/upload.actions";
import { FileModel } from "../../models/ACS/fileModel";
import resources = require('../../util/resources');
import AlfrescoApi = require('alfresco-js-api-node');

describe('SSO - Download Directive', () => {

    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const loginSsoPage = new LoginSSOPage();
    const loginPage = new LoginPage();
    let silentLogin;
    let implicitFlow;
    let uploadActions = new UploadActions();



    let firstPdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    let pdfUploadedFile, pngUploadedFile;

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: TestConfig.adf.url
    });

    beforeAll(async(done) => {

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, firstPdfFileModel.location, firstPdfFileModel.name, '-my-');

        pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        done();
    });

    afterAll(async (done) => {
        try {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pdfUploadedFile.entry.id);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pngUploadedFile.entry.id);
        } catch (error) {
        }
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
        settingsPage.setProviderEcmSso(TestConfig.adf.hostECM, TestConfig.adf.hostSso, silentLogin, implicitFlow);
        loginSsoPage.clickOnSSOButton();
        loginSsoPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        navigationBarPage.clickContentServicesButton();
        contentServicesPage.checkAcsContainer();
    });

});
