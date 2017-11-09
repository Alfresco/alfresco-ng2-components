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

 /* tslint:disable:component-selector  */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var document_list_component_1 = require('./../document-list.component');
var document_list_service_mock_1 = require('./../../assets/document-list.service.mock');
var content_action_model_1 = require('./../../models/content-action.model');
var content_action_list_component_1 = require('./content-action-list.component');
describe('ContentColumnList', function () {
  var documentList;
  var actionList;
  beforeEach(function () {
    var documentListService = new document_list_service_mock_1.DocumentListServiceMock();
    documentList = new document_list_component_1.DocumentListComponent(documentListService, null, null);
    actionList = new content_action_list_component_1.ContentActionListComponent(documentList);
  });
  it('should register action', function () {
    spyOn(documentList.actions, 'push').and.callThrough();
    var action = new content_action_model_1.ContentActionModel();
    var result = actionList.registerAction(action);
    expect(result).toBeTruthy();
    expect(documentList.actions.push).toHaveBeenCalledWith(action);
  });
  it('should require document list instance to register action', function () {
    actionList = new content_action_list_component_1.ContentActionListComponent(null);
    var action = new content_action_model_1.ContentActionModel();
    expect(actionList.registerAction(action)).toBeFalsy();
  });
  it('should require action instance to register', function () {
    spyOn(documentList.actions, 'push').and.callThrough();
    var result = actionList.registerAction(null);
    expect(result).toBeFalsy();
    expect(documentList.actions.push).not.toHaveBeenCalled();
  });
});  //# sourceMappingURL=content-action-list.component.spec.js.map
