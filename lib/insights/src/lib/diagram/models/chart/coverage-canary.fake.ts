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

/**
 * Fake/dummy helper used only to verify that newly added source files are
 * correctly picked up by the SonarCloud coverage reporting pipeline.
 * It has no runtime usage outside of its accompanying unit test.
 */
export class CoverageCanary {
    static isEven(value: number): boolean {
        return value % 2 === 0;
    }

    static double(value: number): number {
        return value * 2;
    }
}
