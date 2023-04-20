/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { element, by, protractor, $, $$ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TreeViewPage {

    treeViewTitle = element(by.cssContainingText('app-tree-view div', 'TREE VIEW TEST'));
    nodeIdInput = $('input[data-placeholder="Node Id"]');
    noNodeMessage = $('#adf-tree-view-missing-node');
    nodesOnPage = $$('mat-tree-node');

    async checkTreeViewTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.treeViewTitle);
    }

    async getNodeId(): Promise<string> {
        return BrowserActions.getInputValue(this.nodeIdInput);
    }

    async clickNode(nodeName: string): Promise<void> {
        const node = $('mat-tree-node[id="' + nodeName + '-tree-child-node"] button');
        await BrowserActions.click(node);
    }

    async checkNodeIsDisplayedAsClosed(nodeName: string): Promise<void> {
        const node = $('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="false"]');
        await BrowserVisibility.waitUntilElementIsVisible(node);
    }

    async checkNodeIsDisplayedAsOpen(nodeName: string): Promise<void> {
        const node = $('mat-tree-node[id="' + nodeName + '-tree-child-node"][aria-expanded="true"]');
        await BrowserVisibility.waitUntilElementIsVisible(node);
    }

    async checkClickedNodeName(nodeName: string): Promise<void> {
        const clickedNode = element(by.cssContainingText('span', ' CLICKED NODE: ' + nodeName + ''));
        await BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    async checkNodeIsNotDisplayed(nodeName: string): Promise<void> {
        const node = $('#' + nodeName + '-tree-child-node');
        await BrowserVisibility.waitUntilElementIsNotVisible(node);
    }

    async clearNodeIdInput(): Promise<void> {
        await BrowserActions.click(this.nodeIdInput);
        await BrowserActions.clearWithBackSpace(this.nodeIdInput);
    }

    async checkNoNodeIdMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noNodeMessage);
    }

    async addNodeId(nodeId: string): Promise<void> {
        await BrowserActions.click(this.nodeIdInput);
        await BrowserActions.clearSendKeys(this.nodeIdInput, nodeId);
        await this.nodeIdInput.sendKeys('a');
        await this.nodeIdInput.sendKeys(protractor.Key.BACK_SPACE);
    }

    async checkErrorMessageIsDisplayed(): Promise<void> {
        const clickedNode = element(by.cssContainingText('span', 'An Error Occurred '));
        await BrowserVisibility.waitUntilElementIsVisible(clickedNode);
    }

    async getTotalNodes(): Promise<number> {
        return this.nodesOnPage.count();
    }
}
