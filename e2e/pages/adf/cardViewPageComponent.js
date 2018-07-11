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

var CardViewComponentPage = function (){

   const addButton = element(by.className('card-view__key-value-pairs__add-btn'));
   const keyValueRow = 'card-view__key-value-pairs__row';
   const selectValue = 'mat-option';
   const valueInputField = element(by.xpath("//*[contains(@id,'input') and @placeholder='Value']"));
   const nameInputField = element(by.xpath("//*[contains(@id,'input') and @placeholder='Name']"));
   const consoleLog = element(by.className('console'));
   const deleteButton = element(by.className('card-view__key-value-pairs__remove-btn')); 
   const select = element(by.css('mat-select[data-automation-class="select-box"]'));
   const listContent = element(by.className('mat-select-content'));
   const selectedValue = element(by.css('.mat-select-value-text span'));

    this.clickOnAddButton = function() {
        Util.waitUntilElementIsVisible(addButton);
        addButton.click();
        return this;
    }; 

    this.setName = function(name) {
        Util.waitUntilElementIsVisible(nameInputField);
        nameInputField.sendKeys(name);
        return this;
    }; 

    this.setValue = function(value) {
        Util.waitUntilElementIsVisible(valueInputField);
        valueInputField.sendKeys(value);
        return this;
    }; 


    this.waitForOutput = function(){
        Util.waitUntilElementIsVisible(consoleLog);
        return this;
    };

    this.getOutputText = function(index){
       return consoleLog.all(by.css('p')).get(index).getText()
    };

    this.deletePairsValues = function(){
       Util.waitUntilElementIsVisible(deleteButton);
       deleteButton.click();
       return this;
    };

    this.checkNameAndValueVisibility = (index) => {
        Util.waitUntilElementIsNotOnPage(this.getKeyValueRow(index));
        return this;
    };

    this.getKeyValueRow = (index) => {
       return element.all(by.css(keyValueRow)).get(index);

    };

    this.getMatSelectValue = (index) => {
        return element.all(by.className(selectValue)).get(index);
    };

    this.clickComboBox = () => {
       select.click();
       Util.waitUntilElementIsVisible(listContent);
    };

    this.selectValueFromComboBox = (index) => {
        this.getMatSelectValue(index).click();
        Util.waitUntilElementIsVisible(consoleLog);
        return this; 
    };

    this.getSelectionValue = () => {
        return selectedValue.getText();
    };

}
module.exports = CardViewComponentPage;