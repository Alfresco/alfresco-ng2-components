/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
export declare var result: {
    list: {
        entries: {
            entry: {
                id: string;
                name: string;
                isFile: boolean;
                content: {
                    mimeType: string;
                };
                createdByUser: {
                    displayName: string;
                };
                modifiedByUser: {
                    displayName: string;
                };
            };
        }[];
    };
};
export declare var results: {
    list: {
        entries: {
            entry: {
                id: string;
                name: string;
                isFile: boolean;
                content: {
                    mimeType: string;
                };
                createdByUser: {
                    displayName: string;
                };
                modifiedByUser: {
                    displayName: string;
                };
            };
        }[];
    };
};
export declare var folderResult: {
    list: {
        entries: {
            entry: {
                id: string;
                name: string;
                isFile: boolean;
                isFolder: boolean;
                createdByUser: {
                    displayName: string;
                };
                modifiedByUser: {
                    displayName: string;
                };
            };
        }[];
    };
};
export declare var noResult: {
    list: {
        entries: any[];
    };
};
export declare var errorJson: {
    error: {
        errorKey: string;
        statusCode: number;
        briefSummary: string;
        stackTrace: string;
        descriptionURL: string;
    };
};
