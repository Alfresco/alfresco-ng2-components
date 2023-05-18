/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Output, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { AppConfigService, AppConfigValues, StorageService, AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { ENTER } from '@angular/cdk/keycodes';

export const HOST_REGEX = '^(http|https):\/\/.*[^/]$';

@Component({
    selector: 'adf-host-settings',
    templateUrl: 'host-settings.component.html',
    host: {
        class: 'adf-host-settings'
    },
    styleUrls: ['./host-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HostSettingsComponent implements OnInit {
    /**
     * Tells the component which provider options are available. Possible valid values
     * are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO.
     */
    @Input()
    providers: string[] = ['BPM', 'ECM', 'ALL'];

    showSelectProviders = true;

    form: UntypedFormGroup;

    /** Emitted when the URL is invalid. */
    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    error = new EventEmitter<string>();

    /** Emitted when the user cancels the changes. */
    @Output()
    cancel = new EventEmitter<boolean>();

    /** Emitted when the changes are successfully applied. */
    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    success = new EventEmitter<boolean>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private storageService: StorageService,
        private alfrescoApiService: AlfrescoApiService,
        private appConfig: AppConfigService,
        private auth: AuthenticationService
    ) {}

    ngOnInit() {
        if (this.providers.length === 1) {
            this.showSelectProviders = false;
        }

        const providerSelected = this.appConfig.get<string>(AppConfigValues.PROVIDERS);

        const authType = this.appConfig.get<string>(AppConfigValues.AUTHTYPE, 'BASIC');

        this.form = this.formBuilder.group({
            providersControl: [providerSelected, Validators.required],
            authType
        });

        this.addFormGroups();

        if (authType === 'OAUTH') {
            this.addOAuthFormGroup();
            this.addIdentityHostFormControl();
        }

        this.form.get('authType').valueChanges.subscribe((value) => {
            if (value === 'BASIC') {
                this.form.removeControl('oauthConfig');
                this.form.removeControl('identityHost');
            } else {
                this.addOAuthFormGroup();
                this.addIdentityHostFormControl();
            }
        });

        this.providersControl.valueChanges.subscribe(() => {
            this.removeFormGroups();
            this.addFormGroups();
        });
    }

    private removeFormGroups() {
        this.form.removeControl('bpmHost');
        this.form.removeControl('ecmHost');
    }

    private addFormGroups() {
        this.addBPMFormControl();
        this.addECMFormControl();
    }

    private addOAuthFormGroup() {
        const oauthFormGroup = this.createOAuthFormGroup();
        this.form.addControl('oauthConfig', oauthFormGroup);
    }

    private addBPMFormControl() {
        if ((this.isBPM() || this.isALL() || this.isOAUTH()) && !this.bpmHost) {
            const bpmFormControl = this.createBPMFormControl();
            this.form.addControl('bpmHost', bpmFormControl);
        }
    }

    private addIdentityHostFormControl() {
        const identityHostFormControl = this.createIdentityFormControl();
        this.form.addControl('identityHost', identityHostFormControl);
    }

    private addECMFormControl() {
        if ((this.isECM() || this.isALL()) && !this.ecmHost) {
            const ecmFormControl = this.createECMFormControl();
            this.form.addControl('ecmHost', ecmFormControl);
        }
    }

    private createOAuthFormGroup(): UntypedFormGroup {
        const oauth = this.appConfig.oauth2;

        return this.formBuilder.group({
            host: [oauth.host, [Validators.required, Validators.pattern(HOST_REGEX)]],
            clientId: [oauth.clientId, Validators.required],
            redirectUri: [oauth.redirectUri, Validators.required],
            redirectUriLogout: [oauth.redirectUriLogout],
            scope: [oauth.scope, Validators.required],
            secret: oauth.secret,
            silentLogin: oauth.silentLogin,
            implicitFlow: oauth.implicitFlow,
            codeFlow: oauth.codeFlow,
            publicUrls: [oauth.publicUrls]
        });
    }

    private createBPMFormControl(): UntypedFormControl {
        return new UntypedFormControl(this.appConfig.get<string>(AppConfigValues.BPMHOST), [Validators.required, Validators.pattern(HOST_REGEX)]);
    }

    private createIdentityFormControl(): UntypedFormControl {
        return new UntypedFormControl(this.appConfig.get<string>(AppConfigValues.IDENTITY_HOST), [Validators.required, Validators.pattern(HOST_REGEX)]);
    }

    private createECMFormControl(): UntypedFormControl {
        return new UntypedFormControl(this.appConfig.get<string>(AppConfigValues.ECMHOST), [Validators.required, Validators.pattern(HOST_REGEX)]);
    }

    onCancel() {
        this.cancel.emit(true);
    }

    onSubmit(values: any) {
        this.storageService.setItem(AppConfigValues.PROVIDERS, values.providersControl);

        if (this.isBPM()) {
            this.saveBPMValues(values);
        } else if (this.isECM()) {
            this.saveECMValues(values);
        } else if (this.isALL()) {
            this.saveECMValues(values);
            this.saveBPMValues(values);
        }

        if (this.isOAUTH()) {
            this.saveOAuthValues(values);
        }

        this.storageService.setItem(AppConfigValues.AUTHTYPE, values.authType);

        this.alfrescoApiService.reset();
        this.auth.reset();
        this.alfrescoApiService.getInstance().invalidateSession();
        this.success.emit(true);
    }

    keyDownFunction(event: any) {
        if (event.keyCode === ENTER && this.form.valid) {
            this.onSubmit(this.form.value);
        }
    }

    private saveOAuthValues(values: any) {
        if (values.oauthConfig.publicUrls && (typeof values.oauthConfig.publicUrls === 'string')) {
            values.oauthConfig.publicUrls = values.oauthConfig.publicUrls.split(',');
        }

        this.storageService.setItem(AppConfigValues.OAUTHCONFIG, JSON.stringify(values.oauthConfig));
        this.storageService.setItem(AppConfigValues.IDENTITY_HOST, values.identityHost);
    }

    private saveBPMValues(values: any) {
        this.storageService.setItem(AppConfigValues.BPMHOST, values.bpmHost);
    }

    private saveECMValues(values: any) {
        this.storageService.setItem(AppConfigValues.ECMHOST, values.ecmHost);
    }

    isBPM(): boolean {
        return this.providersControl.value === 'BPM';
    }

    isECM(): boolean {
        return this.providersControl.value === 'ECM';
    }

    isALL(): boolean {
        return this.providersControl.value === 'ALL';
    }

    isOAUTH(): boolean {
        return this.form.get('authType').value === 'OAUTH';
    }

    get supportsCodeFlow(): boolean {
        return this.auth.supportCodeFlow;
    }

    get providersControl(): UntypedFormControl {
        return this.form.get('providersControl') as UntypedFormControl;
    }

    get bpmHost(): UntypedFormControl {
        return this.form.get('bpmHost') as UntypedFormControl;
    }

    get ecmHost(): UntypedFormControl {
        return this.form.get('ecmHost') as UntypedFormControl;
    }

    get host(): UntypedFormControl {
        return this.oauthConfig.get('host') as UntypedFormControl;
    }

    get identityHost(): UntypedFormControl {
        return this.form.get('identityHost') as UntypedFormControl;
    }

    get clientId(): UntypedFormControl {
        return this.oauthConfig.get('clientId') as UntypedFormControl;
    }

    get scope(): UntypedFormControl {
        return this.oauthConfig.get('scope') as UntypedFormControl;
    }

    get secret(): UntypedFormControl {
        return this.oauthConfig.get('secret') as UntypedFormControl;
    }

    get implicitFlow(): UntypedFormControl {
        return this.oauthConfig.get('implicitFlow') as UntypedFormControl;
    }

    get codeFlow(): UntypedFormControl {
        return this.oauthConfig.get('codeFlow') as UntypedFormControl;
    }

    get silentLogin(): UntypedFormControl {
        return this.oauthConfig.get('silentLogin') as UntypedFormControl;
    }

    get redirectUri(): UntypedFormControl {
        return this.oauthConfig.get('redirectUri') as UntypedFormControl;
    }

    get publicUrls(): UntypedFormControl {
        return this.oauthConfig.get('publicUrls') as UntypedFormControl;
    }

    get redirectUriLogout(): UntypedFormControl {
        return this.oauthConfig.get('redirectUriLogout') as UntypedFormControl;
    }

    get oauthConfig(): UntypedFormControl {
        return this.form.get('oauthConfig') as UntypedFormControl;
    }

}
