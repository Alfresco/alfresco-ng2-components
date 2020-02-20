/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

export let fakeRendition = {
    entry: {
        id: 'pdf',
        content: {
            mimeType: 'application/pdf',
            mimeTypeName: 'Adobe PDF Document'
        },
        status: 'NOT_CREATED'
    }
};

export let fakeRenditionCreated = {
    entry: {
        id: 'pdf',
        content: {
            mimeType: 'application/pdf',
            mimeTypeName: 'Adobe PDF Document'
        },
        status: 'CREATED'
    }
};

export let fakeRenditionsList = {
    list: {
        pagination: {
            count: 6,
            hasMoreItems: false,
            totalItems: 6,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    id: 'avatar',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'avatar32',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'doclib',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'imgpreview',
                    content: {
                        mimeType: 'image/jpeg',
                        mimeTypeName: 'JPEG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'medium',
                    content: {
                        mimeType: 'image/jpeg',
                        mimeTypeName: 'JPEG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'pdf',
                    content: {
                        mimeType: 'application/pdf',
                        mimeTypeName: 'Adobe PDF Document'
                    },
                    status: 'NOT_CREATED'
                }
            }
        ]
    }
};

export let fakeRenditionsListWithACreated = {
    list: {
        pagination: {
            count: 6,
            hasMoreItems: false,
            totalItems: 6,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    id: 'avatar',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'avatar32',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'doclib',
                    content: {
                        mimeType: 'image/png',
                        mimeTypeName: 'PNG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'imgpreview',
                    content: {
                        mimeType: 'image/jpeg',
                        mimeTypeName: 'JPEG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'medium',
                    content: {
                        mimeType: 'image/jpeg',
                        mimeTypeName: 'JPEG Image'
                    },
                    status: 'NOT_CREATED'
                }
            },
            {
                entry: {
                    id: 'pdf',
                    content: {
                        mimeType: 'application/pdf',
                        mimeTypeName: 'Adobe PDF Document'
                    },
                    status: 'CREATED'
                }
            }
        ]
    }
};
