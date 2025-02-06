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

import { DownloadStatus } from './download-status';

export interface Download {
    /**
     * number of files added so far in the zip
     */
    filesAdded?: number;
    /**
     * number of bytes added so far in the zip
     */
    bytesAdded?: number;
    /**
     * the id of the download node
     */
    id?: string;
    /**
     * the total number of files to be added in the zip
     */
    totalFiles?: number;
    /**
     * the total number of bytes to be added in the zip
     */
    totalBytes?: number;
    /**
     * the current status of the download node creation
     */
    status?: DownloadStatus;
}
