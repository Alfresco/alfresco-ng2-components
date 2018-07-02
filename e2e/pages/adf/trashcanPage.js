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

var Util = require('../../util/util');

var TrashcanPage = function () {

    var rows = by.css("adf-document-list div[class*='adf-datatable-body'] div[class*='adf-datatable-row']");
    var tableBody = element.all(by.css("adf-document-list div[class='adf-datatable-body']")).first();
    var pagination = element(by.css("adf-pagination"));

    this.numberOfResultsDisplayed = function () {
        return element.all(rows).count();
    };

    this.waitForTableBody = function (){
        Util.waitUntilElementIsVisible(tableBody);
    };

    this.waitForPagination = function (){
        Util.waitUntilElementIsVisible(pagination);
    };

};
module.exports = TrashcanPage;
