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

import { CardTextItemPage } from '../../core/pages/card-view/card-view-text-item.page';
import { CardDateItemPage } from '../../core/pages/card-view/card-view-date-item.page';

export class ProcessInstanceHeaderPage {

    status = new CardTextItemPage('status');
    endDate = new CardDateItemPage('ended');
    category = new CardTextItemPage('category');
    businessKey = new CardTextItemPage('businessKey');
    startedBy = new CardTextItemPage('createdBy');
    startDate = new CardDateItemPage('created');
    id = new CardTextItemPage('id');
    description = new CardTextItemPage('description');

    async isIdFieldDisplayed(): Promise<boolean> {
        try {
            await this.id.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getIdFieldValue(): Promise<string> {
        return this.id.getFieldValue();
    }

    async isStatusFieldDisplayed(): Promise<boolean> {
        try {
            await this.status.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getStatusFieldValue(): Promise<string> {
        return this.status.getFieldValue();
    }

    async isEndDateFieldDisplayed(): Promise<boolean> {
        try {
            await this.endDate.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getEndDateFieldValue(): Promise<string> {
        return this.endDate.getDateValue();
    }

    async isCategoryFieldDisplayed(): Promise<boolean> {
        try {
            await this.category.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getCategoryFieldValue(): Promise<string> {
        return this.category.getFieldValue();
    }

    async isBusinessKeyFieldDisplayed(): Promise<boolean> {
        try {
            await this.businessKey.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getBusinessKeyFieldValue(): Promise<string> {
        return this.businessKey.getFieldValue();
    }

    async isStartedByFieldDisplayed(): Promise<boolean> {
        try {
            await this.startedBy.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getStartedByFieldValue(): Promise<string> {
        return this.startedBy.getFieldValue();
    }

    async isStartDateFieldDisplayed(): Promise<boolean> {
        try {
            await this.startDate.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getStartDateFieldValue(): Promise<string> {
        return this.startDate.getDateValue();
    }

    async isDescriptionFieldDisplayed(): Promise<boolean> {
        try {
            await this.description.checkLabelIsVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getDescriptionFieldValue(): Promise<string> {
        return this.description.getFieldValue();
    }

    async checkDetailsAreDisplayed(): Promise<void> {
        await this.status.checkLabelIsVisible();
        await this.endDate.checkLabelIsVisible();
        await this.category.checkLabelIsVisible();
        await this.businessKey.checkLabelIsVisible();
        await this.startedBy.checkLabelIsVisible();
        await this.startDate.checkLabelIsVisible();
        await this.id.checkLabelIsVisible();
        await this.description.checkLabelIsVisible();
    }
}
