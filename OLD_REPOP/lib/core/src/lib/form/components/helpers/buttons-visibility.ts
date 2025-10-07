/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormOutcomeModel } from '../widgets';

interface IsOutcomeButtonVisibleProps {
    isFormReadOnly: boolean;
    showCompleteButton: boolean;
    showSaveButton: boolean;
}

export const isOutcomeButtonVisible = (outcome: FormOutcomeModel, props: IsOutcomeButtonVisibleProps): boolean => {
    const { isFormReadOnly, showCompleteButton, showSaveButton } = props;

    if (outcome?.name) {
        if (outcome.name === FormOutcomeModel.COMPLETE_ACTION) {
            return showCompleteButton;
        }
        if (isFormReadOnly) {
            return outcome.isSelected;
        }
        if (outcome.name === FormOutcomeModel.SAVE_ACTION) {
            return showSaveButton;
        }
        if (outcome.name === FormOutcomeModel.START_PROCESS_ACTION) {
            return false;
        }
        return true;
    }
    return false;
};
