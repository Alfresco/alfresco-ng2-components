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

import { Component, EventEmitter, Output, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { UserPreferencesService } from '../services/user-preferences.service';

@Component({
    selector: 'adf-host-settings',
    templateUrl: 'host-settings.component.html',
    host: {
        'class': 'adf-host-settings'
    },
    styleUrls: ['host-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HostSettingsComponent implements OnInit {

    HOST_REGEX: string = '^(http|https):\/\/.*[^/]$';

    @Input()
    providers;

    form: FormGroup;

    /** Emitted when the URL is invalid. */
    @Output()
    error = new EventEmitter<string>();

    /** Emitted when the ecm host URL is changed.
     * @deprecated in 2.4.0
     */
    @Output()
    ecmHostChange = new EventEmitter<string>();

    @Output()
    cancel = new EventEmitter<boolean>();

    @Output()
    success = new EventEmitter<boolean>();

    /** Emitted when the bpm host URL is changed.
     * @deprecated in 2.4.0
     */
    @Output()
    bpmHostChange = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        private userPreference: UserPreferencesService) {
    }

    ngOnInit() {

        let providerSelected = this.userPreference.providers;

        this.form = this.fb.group({
            providersControl: [providerSelected, Validators.required]
        });

        this.addFormGroups();

        this.providersControl.valueChanges.subscribe( () => {
            this.removeFormGroups();
            this.addFormGroups();
        }) ;
    }

    private removeFormGroups() {
        this.form.removeControl('oauthConfig');
        this.form.removeControl('bpmHost');
        this.form.removeControl('ecmHost');
    }

    private addFormGroups() {
        this.addBPMFormControl();
        this.addECMFormControl();
        this.addOAuthFormGroup();
    }

    private addOAuthFormGroup() {
        if (this.isOAUTH() && !this.oauthConfig) {
            const oauthFormGroup = this.createOAuthFormGroup();
            this.form.addControl('oauthConfig', oauthFormGroup);
        }
    }

    private addBPMFormControl() {
        if ((this.isBPM() || this.isALL() || this.isOAUTH()) && !this.bpmHost) {
            const bpmFormControl = this.createBPMFormControl();
            this.form.addControl('bpmHost', bpmFormControl);
        }
    }

    private addECMFormControl() {
        if ((this.isECM() || this.isALL()) && !this.ecmHost) {
            const ecmFormControl = this.createECMFormControl();
            this.form.addControl('ecmHost', ecmFormControl);
        }
    }

    private createOAuthFormGroup(): AbstractControl {
        const oAuthConfig = this.userPreference.oauthConfig;
        if (oAuthConfig) {
            return this.fb.group({
                host: [oAuthConfig.host, [Validators.required, Validators.pattern(this.HOST_REGEX)]],
                clientId: [oAuthConfig.clientId, Validators.required],
                redirectUri: [oAuthConfig.redirectUri, Validators.required],
                scope: [oAuthConfig.scope, Validators.required],
                secret: oAuthConfig.secret,
                silentLogin: oAuthConfig.silentLogin,
                implicitFlow: oAuthConfig.implicitFlow
            });
        }
    }

    private createBPMFormControl(): AbstractControl {
        return new FormControl (this.userPreference.bpmHost, [Validators.required, Validators.pattern(this.HOST_REGEX)]);
    }

    private createECMFormControl(): AbstractControl {
        return new FormControl (this.userPreference.ecmHost, [Validators.required, Validators.pattern(this.HOST_REGEX)]);
    }

    onCancel() {
        this.cancel.emit(true);
    }

    onSubmit(values: any) {
        this.userPreference.providers = values.providers;
        if (this.isBPM()) {
            this.saveBPMValues(values);
        } else if (this.isECM()) {
            this.saveECMValues(values);
        } else if (this.isALL()) {
            this.saveECMValues(values);
            this.saveBPMValues(values);
        } else if (this.isOAUTH()) {
            this.saveOAuthValues(values);
        }
        this.success.emit(true);
    }

    private saveOAuthValues(values: any) {
        this.userPreference.oauthConfig = values.oauthConfig;
        this.userPreference.bpmHost = values.bpmHost;
    }

    private saveBPMValues(values: any) {
        this.userPreference.bpmHost = values.bpmHost;
    }

    private saveECMValues(values: any) {
        this.userPreference.ecmHost = values.ecmHost;
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
        return this.providersControl.value === 'OAUTH';
    }

    get providersControl(): AbstractControl {
        return this.form.get('providersControl');
    }

    get bpmHost(): AbstractControl {
        return this.form.get('bpmHost');
    }

    get ecmHost(): AbstractControl {
        return this.form.get('ecmHost');
    }

    get host(): AbstractControl {
        return this.oauthConfig.get('host');
    }

    get clientId(): AbstractControl {
        return this.oauthConfig.get('clientId');
    }

    get scope(): AbstractControl {
        return this.oauthConfig.get('scope');
    }

    get secretId(): AbstractControl {
        return this.oauthConfig.get('secretId');
    }

    get implicitFlow(): AbstractControl {
        return this.oauthConfig.get('implicitFlow');
    }

    get silentLogin(): AbstractControl {
        return this.oauthConfig.get('silentLogin');
    }

    get redirectUri(): AbstractControl {
        return this.oauthConfig.get('redirectUri');
    }

    get oauthConfig(): AbstractControl {
        return this.form.get('oauthConfig');
    }

}
