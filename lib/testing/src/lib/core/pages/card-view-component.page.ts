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

import { CardViewTextItemPage } from './card-view-items/card-view-text-item.page';
import { CardViewSelectItemPage } from './card-view-items/card-view-select-item.page';
import { CardViewBooleanItemPage } from './card-view-items/card-view-bool-item.page';
import { CardViewKeyValuePairsItemPage } from './card-view-items/card-view-keyvaluepairs-item.page';

export class CardViewComponentPage {

    cardViewTextItem(name: String) {
        return new CardViewTextItemPage(name);
    }

    cardViewSelectItem(name: String) {
        return new CardViewSelectItemPage(name);
    }

    cardViewBooleanItem(name: String) {
        return new CardViewBooleanItemPage(name);
    }

    cardViewValueKeyPairsItem(name: String) {
        return new CardViewKeyValuePairsItemPage(name);
    }
}
