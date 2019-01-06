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

import { Util } from '../../../util/util';
import { element, by, protractor } from 'protractor';

export class TreeViewPage {

    treeViewTitle = element(by.cssContainingText('app-tree-view div', 'TREE VIEW TEST'));
    nodeIdInput = element(by.css('input[placeholder="Node Id"]'));
    noNodeMessage = element(by.id('adf-tree-view-missing-node'));
    nodesOnPage = element.all(by.css('mat-tree-node'));

    checkTreeViewTitleIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.treeViewTitle);
    }

    getNodeId() {
        Util.waitUntilElementIsVisible(this.nodeIdInput);
        return this.nodeIdInput.getAttribute('value');
    }

    clickNode(nodeName) {
        let node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"] button'));
        Util.waitUntilElementIsClickable(node);
        return node.click();
    }

    checkNodeIsDisplayedAsClosed(nodeName) {
        let node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="false"]'));
        return Util.waitUntilElementIsVisible(node);
    }

    checkNodeIsDisplayedAsOpen(nodeName) {
        let node = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="true"]'));
        return Util.waitUntilElementIsVisible(node);
    }

    checkClickedNodeName(nodeName) {
        let clickedNode = element(by.cssContainingText('span', ' CLICKED NODE: ' + nodeName + ''));
        return Util.waitUntilElementIsVisible(clickedNode);
    }

    checkNodeIsNotDisplayed(nodeName) {
        let node = element(by.id('' + nodeName + '-tree-child-node'));
        return Util.waitUntilElementIsNotVisible(node);
    }

    clearNodeIdInput() {
        Util.waitUntilElementIsVisible(this.nodeIdInput);
        this.nodeIdInput.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    checkNoNodeIdMessageIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.noNodeMessage);
    }

    addNodeId(nodeId) {
        Util.waitUntilElementIsVisible(this.nodeIdInput);
        this.nodeIdInput.click();
        this.nodeIdInput.clear();
        this.nodeIdInput.sendKeys(nodeId + ' ');
        this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
    }

    checkErrorMessageIsDisplayed() {
        let clickedNode = element(by.cssContainingText('span', 'An Error Occurred '));
        return Util.waitUntilElementIsVisible(clickedNode);
    }

    getTotalNodes() {
        return this.nodesOnPage.count();
    }
}
