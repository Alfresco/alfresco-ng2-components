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

import { element, by, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TreeViewPage {

    treeViewTitle = element(by.cssContainingText('app-tree-view div', 'TREE VIEW TEST'));
    nodeIdInput = element(by.css('input[placeholder="Node Id"]'));
    noNodeMessage = element(by.id('adf-tree-view-missing-node'));
    nodesOnPage = element.all(by.css('mat-tree-node'));

    checkTreeViewTitleIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.treeViewTitle);
    }

    getNodeId() {
        BrowserVisibility.waitUntilElementIsVisible(this.nodeIdInput);
        return this.nodeIdInput.getAttribute('value');
    }

    clickNode(nodeName) {
        const node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"] button'));
        return BrowserActions.click(node);
    }

    checkNodeIsDisplayedAsClosed(nodeName) {
        const node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="false"]'));
        return BrowserVisibility.waitUntilElementIsVisible(node);
    }

    checkNodeIsDisplayedAsOpen(nodeName) {
        const node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="true"]'));
        return BrowserVisibility.waitUntilElementIsVisible(node);
    }

    checkClickedNodeName(nodeName) {
        const clickedNode = element(by.cssContainingText('span', ' CLICKED NODE: ' + nodeName + ''));
        return BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    checkNodeIsNotDisplayed(nodeName) {
        const node = element(by.id('' + nodeName + '-tree-child-node'));
        return BrowserVisibility.waitUntilElementIsNotVisible(node);
    }

    clearNodeIdInput() {
        BrowserVisibility.waitUntilElementIsVisible(this.nodeIdInput);
        this.nodeIdInput.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    checkNoNodeIdMessageIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.noNodeMessage);
    }

    addNodeId(nodeId) {
        BrowserActions.click(this.nodeIdInput);
        this.nodeIdInput.clear();
        this.nodeIdInput.sendKeys(nodeId + ' ');
        this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
    }

    checkErrorMessageIsDisplayed() {
        const clickedNode = element(by.cssContainingText('span', 'An Error Occurred '));
        return BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    getTotalNodes() {
        return this.nodesOnPage.count();
    }
}
