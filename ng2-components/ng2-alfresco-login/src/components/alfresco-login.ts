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

import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from 'angular2/common';
import { AlfrescoAuthenticationService } from '../services/alfresco-authentication';
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
declare let componentHandler;
declare let __moduleName: string;

@Component({
  selector: 'alfresco-login',
  moduleId: __moduleName,
  directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './alfresco-login.html',
  styleUrls: ['./alfresco-login.css'],
  pipes: [TranslatePipe]

})
export class AlfrescoLoginComponent {
  @Output()
  onSuccess = new EventEmitter();
  @Output()
  onError = new EventEmitter();
  translate: TranslateService;

  form: ControlGroup;
  error: boolean = false;
  success: boolean = false;

  formError: { [id: string]: string };

  private _message: { [id: string]: { [id: string]: string }
  };

  /**
   * Constructor
   * @param _fb
   * @param auth
   * @param router
   */
  constructor(private _fb: FormBuilder,
              public auth: AlfrescoAuthenticationService,
              public router: Router,
              translate: TranslateService) {

    this.formError = {
      'username': '',
      'password': ''
    };

    this.form = this._fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      password: ['', Validators.required]
    });

    this._message = {
      'username': {
        'required': 'LOGIN.MESSAGES.USERNAME-REQUIRED',
        'minlength': 'LOGIN.MESSAGES.USERNAME-MIN'
      },
      'password': {
        'required': 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
      }
    };
    this.translationInit(translate);

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(null);
  }

  /**
   * Method called on submit form
   * @param value
   * @param event
   */
  onSubmit(value: any, event) {
    this.error = false;
    if (event) {
      event.preventDefault();
    }
    this.auth.login(value.username, value.password)
      .subscribe(
        (token: any) => {
          try {
            this.success = true;
            this.onSuccess.emit({
              value: 'Login OK'
            });
            this.router.navigate(['Home']);
          } catch (error) {
            console.error(error.message);
          }

        },
        (err: any) => {
          this.error = true;
          this.onError.emit({
            value: 'Login KO'
          });
          console.log(err);
          this.success = false;
        },
        () => console.log('Login done')
      );
  }

  /**
   * The method check the error in the form and push the error in the formError object
   * @param data
   */
  onValueChanged(data: any) {
    for (let field in this.formError) {
      if (field) {
        this.formError[field] = '';
        let hasError = this.form.controls[field].errors || (this.form.controls[field].dirty && !this.form.controls[field].valid);
        if (hasError) {
          for (let key in this.form.controls[field].errors) {
            if (key) {
              this.formError[field] += this._message[field][key] + '';
            }
          }
        }
      }
    }
  }

  /**
   * The method return if a field is valid or not
   * @param field
   * @returns {boolean}
   */
  isErrorStyle(field: ControlGroup) {
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

    this.translate.setDefaultLang(userLang);

    this.translate.use(userLang);
  }
}
