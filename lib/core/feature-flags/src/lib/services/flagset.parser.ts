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

import { WritableFlagChangeset } from '../interfaces/features.interface';

interface SerializedFlagSet {
    [key: string]: {
        current: boolean;
        fictive?: boolean;
    };
}

export class FlagSetParser {
    static serialize(flags: WritableFlagChangeset): SerializedFlagSet {
        return Object.keys(flags).reduce(
            (acc, key) => ({
                ...acc,
                [key]: {
                    current: flags[key].current,
                    fictive: flags[key].fictive
                }
            }),
            {}
        );
    }

    static deserialize(serializedFlags: SerializedFlagSet): WritableFlagChangeset {
        return Object.keys(serializedFlags).reduce(
            (acc, key) => ({
                ...acc,
                [key]: {
                    current: serializedFlags[key].current,
                    previous: null,
                    ...(serializedFlags[key].fictive ? { fictive: true } : {})
                }
            }),
            {}
        );
    }
}
