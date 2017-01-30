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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var document_list_service_1 = require("./../services/document-list.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ERROR_FOLDER_ALREADY_EXIST = 409;
var DocumentMenuAction = (function () {
    function DocumentMenuAction(documentListService, translate) {
        this.documentListService = documentListService;
        this.translate = translate;
        this.success = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.actions = [];
        this.folderName = '';
        if (translate) {
            translate.addTranslationFolder('ng2-alfresco-documentlist', 'node_modules/ng2-alfresco-documentlist/src');
        }
    }
    DocumentMenuAction.prototype.ngOnInit = function () { };
    DocumentMenuAction.prototype.createFolder = function (name) {
        var _this = this;
        this.cancel();
        this.documentListService.createFolder(name, this.currentFolderPath)
            .subscribe(function (res) {
            var relativeDir = _this.currentFolderPath;
            _this.folderName = '';
            _this.success.emit({ value: relativeDir });
        }, function (error) {
            var errorMessagePlaceholder = _this.getErrorMessage(error.response);
            if (errorMessagePlaceholder) {
                _this.message = _this.formatString(errorMessagePlaceholder, [name]);
                _this.error.emit({ message: _this.message });
                console.log(_this.message);
            }
            else {
                _this.error.emit(error);
                console.log(error);
            }
        });
    };
    DocumentMenuAction.prototype.showDialog = function () {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        this.dialog.nativeElement.showModal();
    };
    DocumentMenuAction.prototype.cancel = function () {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    };
    DocumentMenuAction.prototype.getErrorMessage = function (response) {
        if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
            var errorMessage = void 0;
            errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            return errorMessage.value;
        }
    };
    DocumentMenuAction.prototype.formatString = function (message, keys) {
        var i = keys.length;
        while (i--) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
        }
        return message;
    };
    DocumentMenuAction.prototype.isFolderNameEmpty = function () {
        return this.folderName === '' ? true : false;
    };
    return DocumentMenuAction;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DocumentMenuAction.prototype, "currentFolderPath", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DocumentMenuAction.prototype, "success", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DocumentMenuAction.prototype, "error", void 0);
__decorate([
    core_1.ViewChild('dialog'),
    __metadata("design:type", Object)
], DocumentMenuAction.prototype, "dialog", void 0);
DocumentMenuAction = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-menu-action',
        styles: [".container {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;     -webkit-flex-direction: row;     flex-direction: row;     background-color: #fafafa;     border-bottom: 1px solid transparent;     border-top: 1px solid #e5e5e5;     -webkit-box-shadow: 0 2px 4px rgba(0,0,0,.2);     box-shadow: 0 2px 4px rgba(0,0,0,.2);     height: 53px;     position: relative;     -webkit-transition: height .35s cubic-bezier(0.4,0.0,1,1),border-color .4s;     transition: height .35s cubic-bezier(0.4,0.0,1,1),border-color .4s;     z-index: 5; }  .action {     max-width: 394px;     min-width: 150px; }  .action {     -webkit-align-items: flex-end;     align-items: flex-end;     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;     -webkit-box-sizing: border-box;     box-sizing: border-box;     padding: 13px 0 11px 30px;     -webkit-transition: padding .35s cubic-bezier(0.4, 0.0, 1, 1);     transition: padding .35s cubic-bezier(0.4, 0.0, 1, 1); }  .mdl-menu__item-primary-content {     box-sizing: border-box;     display: -webkit-flex;     display: -ms-flexbox;     display: flex;     -webkit-align-items: center;     -ms-flex-align: center;     align-items: center; }  .mdl-menu__item-primary-content {     -webkit-order: 0;     -ms-flex-order: 0;     order: 0;     -webkit-flex-grow: 2;     -ms-flex-positive: 2;     flex-grow: 2;     text-decoration: none; }  .mdl-menu__item-primary-content {     box-sizing: border-box;     display: -webkit-flex;     display: -ms-flexbox;     display: flex;     -webkit-align-items: center;     -ms-flex-align: center;     align-items: center;  }  .mdl-menu__item-icon {     margin-right: 32px;     margin-top: 10px;     margin-left: 10px; }  .mdl-menu--bottom-left {     width: 200px; }  .mdl-menu__text {     float: right;     margin-right: 22px; }"],
        template: "<div class=\"container\">     <div class=\"action\">         <button id=\"actions\" class=\"mdl-button mdl-js-button mdl-button--raised\">             <i class=\"material-icons\">add</i> {{ 'BUTTON.ACTION_CREATE' | translate }}         </button>         <ul alfresco-mdl-menu class=\"mdl-menu--bottom-left\"             [attr.for]=\"'actions'\">             <li class=\"mdl-menu__item\"                 (click)=\"showDialog()\" >                 <i style=\"float: left;\" class=\"material-icons mdl-menu__item-icon\">folder</i>                 <span class=\"mdl-menu__text\">{{ 'BUTTON.ACTION_NEW_FOLDER' | translate }}</span>             </li>         </ul>     </div> </div>  <dialog class=\"mdl-dialog\" #dialog>     <h4 class=\"mdl-dialog__title\">{{ 'BUTTON.ACTION_NEW_FOLDER' | translate }}</h4>     <div class=\"mdl-dialog__content\">         <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">             <input                     type=\"text\"                     class=\"mdl-textfield__input\"                     id=\"name\"                     required                     [(ngModel)]=\"folderName\"                     placeholder=\"Folder name\"                     data-automation-id=\"name\"                     autocapitalize=\"none\" #name/>         </div>     </div>     <div class=\"mdl-dialog__actions\">         <button type=\"button\" [disabled]=\"isFolderNameEmpty()\" (click)=\"createFolder(folderName)\" class=\"mdl-button\">{{ 'BUTTON.CREATE' | translate }}</button>         <button type=\"button\" (click)=\"cancel()\" class=\"mdl-button close\">{{ 'BUTTON.CANCEL' | translate}}</button>     </div> </dialog>"
    }),
    __metadata("design:paramtypes", [document_list_service_1.DocumentListService,
        ng2_alfresco_core_1.AlfrescoTranslationService])
], DocumentMenuAction);
exports.DocumentMenuAction = DocumentMenuAction;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZG9jdW1lbnQtbWVudS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQU91QjtBQUN2Qiw2RUFBMEU7QUFDMUUsdURBQStEO0FBSy9ELElBQU0sMEJBQTBCLEdBQUcsR0FBRyxDQUFDO0FBUXZDLElBQWEsa0JBQWtCO0lBb0IzQiw0QkFDWSxtQkFBd0MsRUFDeEMsU0FBcUM7UUFEckMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxjQUFTLEdBQVQsU0FBUyxDQUE0QjtRQWhCakQsWUFBTyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBRzdCLFVBQUssR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUszQixZQUFPLEdBQXlCLEVBQUUsQ0FBQztRQUluQyxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBTXBCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDWixTQUFTLENBQUMsb0JBQW9CLENBQUMsMkJBQTJCLEVBQUUsNENBQTRDLENBQUMsQ0FBQztRQUM5RyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFDQUFRLEdBQVIsY0FBWSxDQUFDO0lBRU4seUNBQVksR0FBbkIsVUFBb0IsSUFBWTtRQUFoQyxpQkFxQkM7UUFwQkcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2FBQzlELFNBQVMsQ0FDTixVQUFBLEdBQUc7WUFDQyxJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDekMsS0FBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDckIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDLEVB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NzRELFFBQVEsRUFBRSxpb0RBQWlvRDtLQUM5b0QsQ0FBQztxQ0FzQm1DLDJDQUFtQjtRQUM3Qiw4Q0FBMEI7R0F0QnhDLGtCQUFrQixDQWlHOUI7QUFqR1ksZ0RBQWtCIiwiZmlsZSI6ImNvbXBvbmVudHMvZG9jdW1lbnQtbWVudS1hY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBPbkluaXQsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb2N1bWVudExpc3RTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9kb2N1bWVudC1saXN0LnNlcnZpY2UnO1xuaW1wb3J0IHsgQWxmcmVzY29UcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICduZzItYWxmcmVzY28tY29yZSc7XG5pbXBvcnQgeyBDb250ZW50QWN0aW9uTW9kZWwgfSBmcm9tICcuLy4uL21vZGVscy9jb250ZW50LWFjdGlvbi5tb2RlbCc7XG5cbmRlY2xhcmUgbGV0IGRpYWxvZ1BvbHlmaWxsOiBhbnk7XG5cbmNvbnN0IEVSUk9SX0ZPTERFUl9BTFJFQURZX0VYSVNUID0gNDA5O1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHNlbGVjdG9yOiAnYWxmcmVzY28tZG9jdW1lbnQtbWVudS1hY3Rpb24nLFxuICAgIHN0eWxlczogW1wiLmNvbnRhaW5lciB7ICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDsgICAgIGRpc3BsYXk6IC1tb3otYm94OyAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7ICAgICBkaXNwbGF5OiAtd2Via2l0LWZsZXg7ICAgICBkaXNwbGF5OiBmbGV4OyAgICAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogcm93OyAgICAgZmxleC1kaXJlY3Rpb246IHJvdzsgICAgIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7ICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7ICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTVlNTsgICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMCwwLDAsLjIpOyAgICAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMCwwLDAsLjIpOyAgICAgaGVpZ2h0OiA1M3B4OyAgICAgcG9zaXRpb246IHJlbGF0aXZlOyAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiBoZWlnaHQgLjM1cyBjdWJpYy1iZXppZXIoMC40LDAuMCwxLDEpLGJvcmRlci1jb2xvciAuNHM7ICAgICB0cmFuc2l0aW9uOiBoZWlnaHQgLjM1cyBjdWJpYy1iZXppZXIoMC40LDAuMCwxLDEpLGJvcmRlci1jb2xvciAuNHM7ICAgICB6LWluZGV4OiA1OyB9ICAuYWN0aW9uIHsgICAgIG1heC13aWR0aDogMzk0cHg7ICAgICBtaW4td2lkdGg6IDE1MHB4OyB9ICAuYWN0aW9uIHsgICAgIC13ZWJraXQtYWxpZ24taXRlbXM6IGZsZXgtZW5kOyAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kOyAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7ICAgICBkaXNwbGF5OiAtbW96LWJveDsgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94OyAgICAgZGlzcGxheTogLXdlYmtpdC1mbGV4OyAgICAgZGlzcGxheTogZmxleDsgICAgIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDsgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7ICAgICBwYWRkaW5nOiAxM3B4IDAgMTFweCAzMHB4OyAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiBwYWRkaW5nIC4zNXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAxLCAxKTsgICAgIHRyYW5zaXRpb246IHBhZGRpbmcgLjM1cyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDEsIDEpOyB9ICAubWRsLW1lbnVfX2l0ZW0tcHJpbWFyeS1jb250ZW50IHsgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7ICAgICBkaXNwbGF5OiAtd2Via2l0LWZsZXg7ICAgICBkaXNwbGF5OiAtbXMtZmxleGJveDsgICAgIGRpc3BsYXk6IGZsZXg7ICAgICAtd2Via2l0LWFsaWduLWl0ZW1zOiBjZW50ZXI7ICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyOyAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgfSAgLm1kbC1tZW51X19pdGVtLXByaW1hcnktY29udGVudCB7ICAgICAtd2Via2l0LW9yZGVyOiAwOyAgICAgLW1zLWZsZXgtb3JkZXI6IDA7ICAgICBvcmRlcjogMDsgICAgIC13ZWJraXQtZmxleC1ncm93OiAyOyAgICAgLW1zLWZsZXgtcG9zaXRpdmU6IDI7ICAgICBmbGV4LWdyb3c6IDI7ICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7IH0gIC5tZGwtbWVudV9faXRlbS1wcmltYXJ5LWNvbnRlbnQgeyAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDsgICAgIGRpc3BsYXk6IC13ZWJraXQtZmxleDsgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94OyAgICAgZGlzcGxheTogZmxleDsgICAgIC13ZWJraXQtYWxpZ24taXRlbXM6IGNlbnRlcjsgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7ICAgICBhbGlnbi1pdGVtczogY2VudGVyOyAgfSAgLm1kbC1tZW51X19pdGVtLWljb24geyAgICAgbWFyZ2luLXJpZ2h0OiAzMnB4OyAgICAgbWFyZ2luLXRvcDogMTBweDsgICAgIG1hcmdpbi1sZWZ0OiAxMHB4OyB9ICAubWRsLW1lbnUtLWJvdHRvbS1sZWZ0IHsgICAgIHdpZHRoOiAyMDBweDsgfSAgLm1kbC1tZW51X190ZXh0IHsgICAgIGZsb2F0OiByaWdodDsgICAgIG1hcmdpbi1yaWdodDogMjJweDsgfVwiXSxcbiAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPiAgICAgPGRpdiBjbGFzcz1cXFwiYWN0aW9uXFxcIj4gICAgICAgICA8YnV0dG9uIGlkPVxcXCJhY3Rpb25zXFxcIiBjbGFzcz1cXFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLXJhaXNlZFxcXCI+ICAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29uc1xcXCI+YWRkPC9pPiB7eyAnQlVUVE9OLkFDVElPTl9DUkVBVEUnIHwgdHJhbnNsYXRlIH19ICAgICAgICAgPC9idXR0b24+ICAgICAgICAgPHVsIGFsZnJlc2NvLW1kbC1tZW51IGNsYXNzPVxcXCJtZGwtbWVudS0tYm90dG9tLWxlZnRcXFwiICAgICAgICAgICAgIFthdHRyLmZvcl09XFxcIidhY3Rpb25zJ1xcXCI+ICAgICAgICAgICAgIDxsaSBjbGFzcz1cXFwibWRsLW1lbnVfX2l0ZW1cXFwiICAgICAgICAgICAgICAgICAoY2xpY2spPVxcXCJzaG93RGlhbG9nKClcXFwiID4gICAgICAgICAgICAgICAgIDxpIHN0eWxlPVxcXCJmbG9hdDogbGVmdDtcXFwiIGNsYXNzPVxcXCJtYXRlcmlhbC1pY29ucyBtZGwtbWVudV9faXRlbS1pY29uXFxcIj5mb2xkZXI8L2k+ICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWRsLW1lbnVfX3RleHRcXFwiPnt7ICdCVVRUT04uQUNUSU9OX05FV19GT0xERVInIHwgdHJhbnNsYXRlIH19PC9zcGFuPiAgICAgICAgICAgICA8L2xpPiAgICAgICAgIDwvdWw+ICAgICA8L2Rpdj4gPC9kaXY+ICA8ZGlhbG9nIGNsYXNzPVxcXCJtZGwtZGlhbG9nXFxcIiAjZGlhbG9nPiAgICAgPGg0IGNsYXNzPVxcXCJtZGwtZGlhbG9nX190aXRsZVxcXCI+e3sgJ0JVVFRPTi5BQ1RJT05fTkVXX0ZPTERFUicgfCB0cmFuc2xhdGUgfX08L2g0PiAgICAgPGRpdiBjbGFzcz1cXFwibWRsLWRpYWxvZ19fY29udGVudFxcXCI+ICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRsLXRleHRmaWVsZCBtZGwtanMtdGV4dGZpZWxkIG1kbC10ZXh0ZmllbGQtLWZsb2F0aW5nLWxhYmVsXFxcIj4gICAgICAgICAgICAgPGlucHV0ICAgICAgICAgICAgICAgICAgICAgdHlwZT1cXFwidGV4dFxcXCIgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwibWRsLXRleHRmaWVsZF9faW5wdXRcXFwiICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcIm5hbWVcXFwiICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cXFwiZm9sZGVyTmFtZVxcXCIgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cXFwiRm9sZGVyIG5hbWVcXFwiICAgICAgICAgICAgICAgICAgICAgZGF0YS1hdXRvbWF0aW9uLWlkPVxcXCJuYW1lXFxcIiAgICAgICAgICAgICAgICAgICAgIGF1dG9jYXBpdGFsaXplPVxcXCJub25lXFxcIiAjbmFtZS8+ICAgICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gICAgIDxkaXYgY2xhc3M9XFxcIm1kbC1kaWFsb2dfX2FjdGlvbnNcXFwiPiAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBbZGlzYWJsZWRdPVxcXCJpc0ZvbGRlck5hbWVFbXB0eSgpXFxcIiAoY2xpY2spPVxcXCJjcmVhdGVGb2xkZXIoZm9sZGVyTmFtZSlcXFwiIGNsYXNzPVxcXCJtZGwtYnV0dG9uXFxcIj57eyAnQlVUVE9OLkNSRUFURScgfCB0cmFuc2xhdGUgfX08L2J1dHRvbj4gICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgKGNsaWNrKT1cXFwiY2FuY2VsKClcXFwiIGNsYXNzPVxcXCJtZGwtYnV0dG9uIGNsb3NlXFxcIj57eyAnQlVUVE9OLkNBTkNFTCcgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPiAgICAgPC9kaXY+IDwvZGlhbG9nPlwiXG59KVxuZXhwb3J0IGNsYXNzIERvY3VtZW50TWVudUFjdGlvbiBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKVxuICAgIGN1cnJlbnRGb2xkZXJQYXRoOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KClcbiAgICBzdWNjZXNzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdkaWFsb2cnKVxuICAgIGRpYWxvZzogYW55O1xuXG4gICAgYWN0aW9uczogQ29udGVudEFjdGlvbk1vZGVsW10gPSBbXTtcblxuICAgIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIGZvbGRlck5hbWU6IHN0cmluZyA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZG9jdW1lbnRMaXN0U2VydmljZTogRG9jdW1lbnRMaXN0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IEFsZnJlc2NvVHJhbnNsYXRpb25TZXJ2aWNlKSB7XG5cbiAgICAgICAgaWYgKHRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgdHJhbnNsYXRlLmFkZFRyYW5zbGF0aW9uRm9sZGVyKCduZzItYWxmcmVzY28tZG9jdW1lbnRsaXN0JywgJ25vZGVfbW9kdWxlcy9uZzItYWxmcmVzY28tZG9jdW1lbnRsaXN0L3NyYycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7fVxuXG4gICAgcHVibGljIGNyZWF0ZUZvbGRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudExpc3RTZXJ2aWNlLmNyZWF0ZUZvbGRlcihuYW1lLCB0aGlzLmN1cnJlbnRGb2xkZXJQYXRoKVxuICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmVEaXIgPSB0aGlzLmN1cnJlbnRGb2xkZXJQYXRoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGRlck5hbWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzLmVtaXQoe3ZhbHVlOiByZWxhdGl2ZURpcn0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlUGxhY2Vob2xkZXIgPSB0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvck1lc3NhZ2VQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5mb3JtYXRTdHJpbmcoZXJyb3JNZXNzYWdlUGxhY2Vob2xkZXIsIFtuYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVtaXQoe21lc3NhZ2U6IHRoaXMubWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IuZW1pdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93RGlhbG9nKCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlhbG9nLm5hdGl2ZUVsZW1lbnQuc2hvd01vZGFsKSB7XG4gICAgICAgICAgICBkaWFsb2dQb2x5ZmlsbC5yZWdpc3RlckRpYWxvZyh0aGlzLmRpYWxvZy5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpYWxvZy5uYXRpdmVFbGVtZW50LnNob3dNb2RhbCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW5jZWwoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpYWxvZykge1xuICAgICAgICAgICAgdGhpcy5kaWFsb2cubmF0aXZlRWxlbWVudC5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cml2ZSB0aGUgZXJyb3IgbWVzc2FnZSB1c2luZyB0aGUgZXJyb3Igc3RhdHVzIGNvZGVcbiAgICAgKiBAcGFyYW0gcmVzcG9uc2UgLSBvYmplY3QgdGhhdCBjb250YWluIHRoZSBIVFRQIHJlc3BvbnNlXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldEVycm9yTWVzc2FnZShyZXNwb25zZTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmJvZHkgJiYgcmVzcG9uc2UuYm9keS5lcnJvci5zdGF0dXNDb2RlID09PSBFUlJPUl9GT0xERVJfQUxSRUFEWV9FWElTVCkge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTogYW55O1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gdGhpcy50cmFuc2xhdGUuZ2V0KCdGSUxFX1VQTE9BRC5NRVNTQUdFUy5GT0xERVJfQUxSRUFEWV9FWElTVCcpO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZS52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgYSBwbGFjZWhvbGRlciB7MH0gaW4gYSBtZXNzYWdlIHdpdGggdGhlIGlucHV0IGtleXNcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSAtIHRoZSBtZXNzYWdlIHRoYXQgY29uYWlucyB0aGUgcGxhY2Vob2xkZXJcbiAgICAgKiBAcGFyYW0ga2V5cyAtIGFycmF5IG9mIHZhbHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgbWVzc2FnZSB3aXRob3V0IHBsYWNlaG9sZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBmb3JtYXRTdHJpbmcobWVzc2FnZTogc3RyaW5nLCBrZXlzOiBhbnkgW10pIHtcbiAgICAgICAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxceycgKyBpICsgJ1xcXFx9JywgJ2dtJyksIGtleXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH1cblxuICAgIGlzRm9sZGVyTmFtZUVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJOYW1lID09PSAnJyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG59XG4iXX0=
