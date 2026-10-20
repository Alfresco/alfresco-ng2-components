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

import type { RowAddress } from './signal-form';

/** The events a form emits, named as form rules name them. */
export const SignalFormEventType = {
    /** A widget was clicked, for example a button. */
    Click: 'click',
    /** A repeatable section gained or lost a row; the event's field is the section. */
    RowCountChanged: 'onRowCountChanged',
    /** The host refreshed the form's values. */
    DataRefreshed: 'dataRefreshed'
} as const;

export type SignalFormEventType = (typeof SignalFormEventType)[keyof typeof SignalFormEventType];

/** Something that happened on a form or one of its fields, for listeners such as form rules. */
export interface SignalFormEvent {
    type: SignalFormEventType;
    /** The field, or repeatable section, the event is about; absent for an event of the whole form. */
    fieldId?: string;
    /** The repeatable section row the field is in, for a field of a row. */
    row?: RowAddress;
}
