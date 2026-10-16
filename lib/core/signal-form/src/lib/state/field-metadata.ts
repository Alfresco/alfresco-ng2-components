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

import { createMetadataKey } from '@angular/forms/signals';

/**
 * Whether a field's typed values (options, people, groups…) are shown as text by name. Read it in a widget with
 * `field()().metadata(TYPED_VALUE_FORMATTING)?.()`.
 */
export const TYPED_VALUE_FORMATTING = createMetadataKey<boolean>();

/**
 * Whether an amount field is shown formatted for the user's locale while it isn't being edited.
 */
export const LOCALE_AMOUNTS = createMetadataKey<boolean>();
