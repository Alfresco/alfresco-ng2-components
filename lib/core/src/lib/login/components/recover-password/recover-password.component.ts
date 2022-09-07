/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

//import { AlfrescoApiService, AppConfigService, AuthenticationService, CardViewArrayItemModel, CardViewBoolItemModel, CardViewDateItemModel, CardViewDatetimeItemModel, CardViewFloatItemModel, CardViewIntItemModel, CardViewKeyValuePairsItemModel, CardViewMapItemModel, CardViewSelectItemModel, CardViewTextItemModel, LogService, TranslationService, UserPreferencesService } from '@alfresco/adf-core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../../../../..';
//import { MatDialogRef } from '@angular/material/dialog';
// import { FormBuilder } from '@angular/forms';
// import { DomSanitizer } from '@angular/platform-browser';
// import { ActivatedRoute, Router } from '@angular/router';
// import { of } from 'rxjs';

@Component({
  selector: 'aaa-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit{

    recoverPasswordForm: FormGroup;
    saveInProgress : boolean = false;
    passwordResetStatus : boolean = false;
    properties = [{label: 'My Label', value: 'My value'}];


    @ViewChild('DialogBodyContainer') dialogBodyContainer: ElementRef;



    constructor(private formBuilder: FormBuilder,
        private translateService: TranslationService,
                //private matDialogRef: MatDialogRef<RecoverPasswordComponent>,
                //@Inject(MAT_DIALOG_DATA) private data: any
               ) {
                this.translateService.loadTranslation('en');
                this.translateService.use('en');
               }



    ngOnInit(): void {

        this.recoverPasswordForm = this.formBuilder.group({
            emailId:['',[Validators.required, Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9.-]{2,}$')]]
        })
    }



    sendInstructions() {
        this.saveInProgress = true;
        console.log("Sending Email to ", this.recoverPasswordForm.controls.emailId.value);
        this.passwordResetStatus = true;
        //this.matDialogRef.close();
    }



    isSaveDisabled(): boolean {
        return !this.recoverPasswordForm.valid || this.saveInProgress;
    }






}
