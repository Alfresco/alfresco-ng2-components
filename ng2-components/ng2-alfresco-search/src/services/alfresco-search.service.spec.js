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
var core_1 = require("@angular/core");
var alfresco_search_service_1 = require("./alfresco-search.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var alfresco_search_service_mock_1 = require("../assets/alfresco-search.service.mock");
describe('AlfrescoSearchService', function () {
    var service;
    var apiService;
    var injector;
    beforeEach(function () {
        injector = core_1.ReflectiveInjector.resolveAndCreate([
            alfresco_search_service_1.AlfrescoSearchService,
            ng2_alfresco_core_1.AlfrescoSettingsService,
            ng2_alfresco_core_1.AlfrescoApiService,
            ng2_alfresco_core_1.AlfrescoAuthenticationService,
            ng2_alfresco_core_1.StorageService
        ]);
        service = injector.get(alfresco_search_service_1.AlfrescoSearchService);
        apiService = injector.get(ng2_alfresco_core_1.AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(alfresco_search_service_mock_1.fakeApi);
    });
    it('should call search API with no additional options', function (done) {
        var searchTerm = 'searchTerm63688';
        spyOn(alfresco_search_service_mock_1.fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.resolve(alfresco_search_service_mock_1.fakeSearch));
        service.getNodeQueryResults(searchTerm).subscribe(function () {
            expect(alfresco_search_service_mock_1.fakeApi.core.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, undefined);
            done();
        });
    });
    it('should call search API with additional options', function (done) {
        var searchTerm = 'searchTerm63688', options = {
            include: ['path'],
            rootNodeId: '-root-',
            nodeType: 'cm:content'
        };
        spyOn(alfresco_search_service_mock_1.fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.resolve(alfresco_search_service_mock_1.fakeSearch));
        service.getNodeQueryResults(searchTerm, options).subscribe(function () {
            expect(alfresco_search_service_mock_1.fakeApi.core.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, options);
            done();
        });
    });
    it('should return search results returned from the API', function (done) {
        service.getNodeQueryResults('').subscribe(function (res) {
            expect(res).toBeDefined();
            expect(res).toEqual(alfresco_search_service_mock_1.fakeSearch);
            done();
        });
    });
    it('should notify errors returned from the API', function (done) {
        spyOn(alfresco_search_service_mock_1.fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.reject(alfresco_search_service_mock_1.fakeError));
        service.getNodeQueryResults('').subscribe(function () { }, function (res) {
            expect(res).toBeDefined();
            expect(res).toEqual(alfresco_search_service_mock_1.fakeError);
            done();
        });
    });
    it('should notify a general error if the API does not return a specific error', function (done) {
        spyOn(alfresco_search_service_mock_1.fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.reject(null));
        service.getNodeQueryResults('').subscribe(function () { }, function (res) {
            expect(res).toBeDefined();
            expect(res).toEqual('Server error');
            done();
        });
    });
});
//# sourceMappingURL=alfresco-search.service.spec.js.map