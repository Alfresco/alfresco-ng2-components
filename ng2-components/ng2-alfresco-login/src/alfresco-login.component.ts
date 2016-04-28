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
import {Component, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators} from 'angular2/common';
import {AlfrescoAuthenticationService} from './alfresco-authentication.service';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
declare let componentHandler;
declare let __moduleName:string;

@Component({
    selector: 'alfresco-login',
    moduleId: __moduleName,
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
    templateUrl: './alfresco-login.component.html',
    styleUrls: ['./alfresco-login.component.css'],
    pipes: [TranslatePipe]

})
export class AlfrescoLoginComponent {
    @Input() method:string = 'GET';
    translate: TranslateService;

    form:ControlGroup;
    error:boolean = false;

    /**
     * Constructor
     * @param fb
     * @param auth
     * @param router
     */
    constructor(fb:FormBuilder,
                public auth:AlfrescoAuthenticationService,
                public router:Router,
                translate:TranslateService
                ) {
        this.form = fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.required]
        });

        this.translationInit(translate);
    }

    /**
     * Method called on submit form
     * @param value
     * @param event
     */
    onSubmit(value:any, event) {
        if (event) {
            event.preventDefault();
        }
        this.auth.login(this.method, value.username, value.password)
            .subscribe(
            (token:any) => this.router.navigate(['Home']),
            () => {
                this.error = true;
            }
        );
    }

    /**
     * The method return if a field is valid or not
     * @param field
     * @returns {boolean}
     */
    isErrorStyle(field:ControlGroup) {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
        if (field.valid) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Initial configuration for Multi language
     * @param translate
     */
    translationInit(translate: TranslateService) {
        this.translate = translate;
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';

        this.translate.setDefaultLang('en');

        this.translate.use(userLang);
    }
}
