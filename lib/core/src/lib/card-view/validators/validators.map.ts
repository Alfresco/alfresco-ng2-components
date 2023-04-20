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

import { CardViewItemMatchValidator, MatchValidatorParams } from './card-view-item-match.valiator';
import { CardViewItemMinMaxValidator, MinMaxValidatorParams } from './card-view-item-minmax.valiator';
import { CardViewItemLengthValidator, LengthValidatorParams } from './card-view-item-length.valiator';

const validators = {
    minmax: (parameters: MinMaxValidatorParams) => new CardViewItemMinMaxValidator(parameters.minValue, parameters.maxValue),
    regex: (parameters: MatchValidatorParams) => new CardViewItemMatchValidator(parameters.expression),
    length: (parameters: LengthValidatorParams) => new CardViewItemLengthValidator(parameters.minLength, parameters.maxLength)
};
export default validators;
