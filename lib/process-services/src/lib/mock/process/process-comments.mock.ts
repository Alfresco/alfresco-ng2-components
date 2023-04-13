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

import { CommentModel } from '@alfresco/adf-core';

export const mockProcessInstanceComments = [
    new CommentModel({ message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} }),
    new CommentModel({ message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} }),
    new CommentModel({ message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} })
];
