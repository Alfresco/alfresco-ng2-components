/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { OutcomeDefinition, SystemOutcomeName } from '../definition/form-definition.model';

export interface OutcomeHostOptions {
    readOnly: boolean;
    showSaveButton: boolean;
    showCompleteButton: boolean;
}

const SAVE = SystemOutcomeName.Save;
const COMPLETE = SystemOutcomeName.Complete;
const START_PROCESS = SystemOutcomeName.StartProcess;

export const isOutcomeShown = (outcome: OutcomeDefinition, { readOnly, showCompleteButton, showSaveButton }: OutcomeHostOptions): boolean => {
    if (!outcome.name) {
        return false;
    }
    if (outcome.name === COMPLETE) {
        return showCompleteButton;
    }
    if (outcome.name === START_PROCESS) {
        return false;
    }
    if (readOnly) {
        return outcome.isSelected;
    }
    return outcome.name === SAVE ? showSaveButton : true;
};

export const isOutcomeEnabled = (outcome: OutcomeDefinition, formValid: boolean, { readOnly }: OutcomeHostOptions): boolean =>
    !readOnly && (outcome.name === SAVE || outcome.skipValidation || formValid);
