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

import { SitePaging } from '@alfresco/js-api';

/* We are using functions instead of constants here to pass a new instance of the object each time */
export const getFakeSitePaging = (): SitePaging => ({
    list: {
        pagination: {
            count: 2,
            hasMoreItems: true,
            totalItems: 2,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-1',
                    description: 'fake-test-site',
                    id: 'fake-test-site',
                    preset: 'site-dashboard',
                    title: 'fake-test-site'
                }
            },
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-2',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'swsdp',
                    preset: 'site-dashboard',
                    title: 'fake-test-2'
                }
            }
        ]
    }
});

export const getFakeSitePagingNoMoreItems = (): SitePaging => ({
    list: {
        pagination: {
            count: 2,
            hasMoreItems: false,
            totalItems: 2,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-1',
                    description: 'fake-test-site',
                    id: 'fake-test-site',
                    preset: 'site-dashboard',
                    title: 'fake-test-site'
                }
            },
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-2',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'swsdp',
                    preset: 'site-dashboard',
                    title: 'fake-test-2'
                }
            }
        ]
    }
});

export const getFakeSitePagingFirstPage = (): SitePaging => ({
    list: {
        pagination: {
            count: 2,
            hasMoreItems: true,
            totalItems: 2,
            skipCount: 0,
            maxItems: 4
        },
        entries: [
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-1',
                    description: 'fake-test-site',
                    id: 'fake-test-site',
                    preset: 'site-dashboard',
                    title: 'fake-test-site'
                }
            },
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-2',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'swsdp',
                    preset: 'site-dashboard',
                    title: 'fake-test-2'
                }
            }
        ]
    }
});

export const getFakeSitePagingLastPage = (): SitePaging => ({
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            totalItems: 2,
            skipCount: 2,
            maxItems: 4
        },
        entries: [
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-3',
                    description: 'fake-test-3',
                    id: 'fake-test-3',
                    preset: 'site-dashboard',
                    title: 'fake-test-3'
                }
            },
            {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'fake-test-4',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'fake-test-4',
                    preset: 'site-dashboard',
                    title: 'fake-test-4'
                }
            }
        ]
    }
});

export const getFakeSitePagingWithMembers = () => new SitePaging({
    list: {
        entries: [{
            entry: {
                visibility: 'MODERATED',
                guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                description: 'This is a Sample Alfresco Team site.',
                id: 'MODERATED-SITE',
                preset: 'site-dashboard',
                title: 'FAKE-MODERATED-SITE'
            },
            relations: {
                members: {
                    list: {
                        pagination: {
                            count: 3,
                            hasMoreItems: false,
                            skipCount: 0,
                            maxItems: 100
                        },
                        entries: [
                            {
                                entry: {
                                    role: 'SiteManager',
                                    person: {
                                        firstName: 'Administrator',
                                        emailNotificationsEnabled: true,
                                        company: {},
                                        id: 'admin',
                                        enabled: true,
                                        email: 'admin@alfresco.com'
                                    },
                                    id: 'admin'
                                }
                            },
                            {
                                entry: {
                                    role: 'SiteCollaborator',
                                    person: {
                                        lastName: 'Beecher',
                                        userStatus: 'Helping to design the look and feel of the new web site',
                                        jobTitle: 'Graphic Designer',
                                        statusUpdatedAt: '2011-02-15T20:20:13.432+0000',
                                        mobile: '0112211001100',
                                        emailNotificationsEnabled: true,
                                        description: 'Alice is a demo user for the sample Alfresco Team site.',
                                        telephone: '0112211001100',
                                        enabled: false,
                                        firstName: 'Alice',
                                        skypeId: 'abeecher',
                                        avatarId: '198500fc-1e99-4f5f-8926-248cea433366',
                                        location: 'Tilbury, UK',
                                        company: {
                                            organization: 'Moresby, Garland and Wedge',
                                            address1: '200 Butterwick Street',
                                            address2: 'Tilbury',
                                            address3: 'UK',
                                            postcode: 'ALF1 SAM1'
                                        },
                                        id: 'abeecher',
                                        email: 'abeecher@example.com'
                                    },
                                    id: 'abeecher'
                                }
                            }
                        ]
                    }
                }
            }
        }, {
            entry: {
                visibility: 'PUBLIC',
                guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                description: 'This is a Sample Alfresco Team site.',
                id: 'PUBLIC-SITE',
                preset: 'site-dashboard',
                title: 'FAKE-SITE-PUBLIC'
            }
        }, {
            entry: {
                visibility: 'PRIVATE',
                guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                description: 'This is a Sample Alfresco Team site.',
                id: 'MEMBER-SITE',
                preset: 'site-dashboard',
                title: 'FAKE-PRIVATE-SITE-MEMBER'
            },
            relations: {
                members: {
                    list: {
                        pagination: {
                            count: 3,
                            hasMoreItems: false,
                            skipCount: 0,
                            maxItems: 100
                        },
                        entries: [
                            {
                                entry: {
                                    role: 'SiteManager',
                                    person: {
                                        firstName: 'Administrator',
                                        emailNotificationsEnabled: true,
                                        company: {},
                                        id: 'admin',
                                        enabled: true,
                                        email: 'admin@alfresco.com'
                                    },
                                    id: 'test'
                                }
                            }
                        ]
                    }
                }
            }
        }
        ]
    }
});
