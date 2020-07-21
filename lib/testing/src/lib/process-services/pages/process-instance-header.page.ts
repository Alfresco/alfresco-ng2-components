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

    async isIdFieldPresent(): Promise<boolean> {
        try {
            await this.id.checkLabelIsPresent();
            return true;
        } catch (e) {
            return false;
        }
        
    }

    async getIdFieldValue(): Promise<string> {
        return this.id.getFieldValue();
    }

    async checkStatusFieldIsPresent(): Promise<void> {
        await this.id.checkLabelIsPresent();
    }

    async getStatusFieldValue(): Promise<string> {
        return this.id.getFieldValue();
    }
}
