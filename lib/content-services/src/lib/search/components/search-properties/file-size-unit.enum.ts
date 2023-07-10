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

export class FileSizeUnit {
    static readonly KB = new FileSizeUnit('KB', 1000);
    static readonly MB = new FileSizeUnit('MB', 1000000);
    static readonly GB = new FileSizeUnit('GB', 1000000000);

    private constructor(readonly abbreviation: string, readonly bytes: number) {}
}
