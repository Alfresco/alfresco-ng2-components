"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var PdfPasswordDialogComponent = /** @class */ (function () {
    function PdfPasswordDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    PdfPasswordDialogComponent.prototype.ngOnInit = function () {
        this.passwordFormControl = new forms_1.FormControl('', [forms_1.Validators.required]);
    };
    PdfPasswordDialogComponent.prototype.isError = function () {
        return this.data.reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;
    };
    PdfPasswordDialogComponent.prototype.isValid = function () {
        return !this.passwordFormControl.hasError('required');
    };
    PdfPasswordDialogComponent.prototype.submit = function () {
        this.dialogRef.close(this.passwordFormControl.value);
    };
    PdfPasswordDialogComponent = __decorate([
        core_1.Component({
            selector: 'adf-pdf-viewer-password-dialog',
            templateUrl: './pdfViewer-password-dialog.html',
            styleUrls: ['./pdfViewer-password-dialog.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object])
    ], PdfPasswordDialogComponent);
    return PdfPasswordDialogComponent;
}());
exports.PdfPasswordDialogComponent = PdfPasswordDialogComponent;
//# sourceMappingURL=pdfViewer-password-dialog.js.map