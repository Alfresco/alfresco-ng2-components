/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class SizeDetails {
    id: string;
    sizeInBytes: string;
    calculatedAt: string;
    numberOfFiles: number;
    status: SizeDetails.StatusEnum;
    jobId: string;

    constructor(entry: SizeDetails) {
        this.id = entry.id;
        this.sizeInBytes = entry.sizeInBytes;
        this.calculatedAt = entry.calculatedAt;
        this.numberOfFiles = entry.numberOfFiles;
        this.status = entry.status;
        this.jobId = entry.jobId;
    }
}
export namespace SizeDetails {
    export type StatusEnum = 'IN-PROGRESS' | 'COMPLETED' | 'NOT-INITIATED';
    export const StatusEnum = {
        IN_PROGRESS: 'IN-PROGRESS' as StatusEnum,
        COMPLETE: 'COMPLETED' as StatusEnum,
        NOT_INITIATED: 'NOT-INITIATED' as StatusEnum
    };
}
