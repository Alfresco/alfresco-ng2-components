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

import { element, by, ElementFinder, ElementArrayFinder, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TreeViewPage {

    treeViewTitle: ElementFinder = element(by.cssContainingText('app-tree-view div', 'TREE VIEW TEST'));
    nodeIdInput: ElementFinder = element(by.css('input[placeholder="Node Id"]'));
    noNodeMessage: ElementFinder = element(by.id('adf-tree-view-missing-node'));
    nodesOnPage: ElementArrayFinder = element.all(by.css('mat-tree-node'));

    async checkTreeViewTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.treeViewTitle);
    }

    async getNodeId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.nodeIdInput);
        return await this.nodeIdInput.getAttribute('value');
    }

    async clickNode(nodeName): Promise<void> {
        const node: ElementFinder = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"] button'));
        await BrowserActions.click(node);
    }

    async checkNodeIsDisplayedAsClosed(nodeName): Promise<void> {
        const node: ElementFinder = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="false"]'));
        await BrowserVisibility.waitUntilElementIsVisible(node);
    }

    async checkNodeIsDisplayedAsOpen(nodeName): Promise<void> {
        const node: ElementFinder = element(by.css('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="true"]'));
        await BrowserVisibility.waitUntilElementIsVisible(node);
    }

    async checkClickedNodeName(nodeName): Promise<void> {
        const clickedNode: ElementFinder = element(by.cssContainingText('span', ' CLICKED NODE: ' + nodeName + ''));
        await BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    async checkNodeIsNotDisplayed(nodeName): Promise<void> {
        const node: ElementFinder = element(by.id('' + nodeName + '-tree-child-node'));
        await BrowserVisibility.waitUntilElementIsNotVisible(node);
    }

    async clearNodeIdInput(): Promise<void> {
        await BrowserActions.click(this.nodeIdInput);
        await BrowserActions.clearWithBackSpace(this.nodeIdInput);
    }

    async checkNoNodeIdMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noNodeMessage);
    }

    async addNodeId(nodeId): Promise<void> {
        await BrowserActions.click(this.nodeIdInput);
        await BrowserActions.clearSendKeys(this.nodeIdInput, nodeId);
        await this.nodeIdInput.sendKeys('a');
        await this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
    }

    async checkErrorMessageIsDisplayed(): Promise<void> {
        const clickedNode: ElementFinder = element(by.cssContainingText('span', 'An Error Occurred '));
        await BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    async getTotalNodes() {
        return await this.nodesOnPage.count();
    }
}
