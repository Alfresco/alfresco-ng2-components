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

export const fakeNodeWithPermissions: any = {
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
          {
            id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
            name: 'Company Home'
          },
          {
            id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
            name: 'Sites'
          },
          {
            id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
            name: 'testsite'
          },
          {
            id: '71626fae-0c04-4d0c-a129-20fa4c178716',
            name: 'documentLibrary'
          }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        inherited: [
            {
                authorityId: 'guest',
                name: 'Read',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Read',
                accessStatus: 'ALLOWED'
            }
        ],
        locallySet: [
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Contributor',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: true
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeNodeInheritedOnly = {
    allowableOperations: [ 'updatePermissions' ],
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
          {
            id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
            name: 'Company Home'
          },
          {
            id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
            name: 'Sites'
          },
          {
            id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
            name: 'testsite',
            nodeType: 'st:site'
          },
          {
            id: '71626fae-0c04-4d0c-a129-20fa4c178716',
            name: 'documentLibrary'
          }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        inherited: [
            {
                authorityId: 'guest',
                name: 'Read',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Read',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: true
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeReadOnlyNodeInherited = {
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
          {
            id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
            name: 'Company Home'
          },
          {
            id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
            name: 'Sites'
          },
          {
            id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
            name: 'testsite'
          },
          {
            id: '71626fae-0c04-4d0c-a129-20fa4c178716',
            name: 'documentLibrary'
          }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        inherited: [
            {
                authorityId: 'guest',
                name: 'Read',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Read',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: true
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeNodeWithOnlyLocally: any = {
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
          {
            id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
            name: 'Company Home'
          },
          {
            id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
            name: 'Sites'
          },
          {
            id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
            name: 'testsite'
          },
          {
            id: '71626fae-0c04-4d0c-a129-20fa4c178716',
            name: 'documentLibrary'
          }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        locallySet: [
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Contributor',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: false
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeNodeToRemovePermission: any = {
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
          {
            id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
            name: 'Company Home'
          },
          {
            id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
            name: 'Sites'
          },
          {
            id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
            name: 'testsite'
          },
          {
            id: '71626fae-0c04-4d0c-a129-20fa4c178716',
            name: 'documentLibrary'
          }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        locallySet: [
            {
                authorityId: 'GROUP_EVERYONE',
                name: 'Contributor',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'GROUP_FAKE_1',
                name: 'Contributor',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'FAKE_PERSON_1',
                name: 'Contributor',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: true
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeNodeWithoutPermissions: any = {
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
            {
                id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
                name: 'Company Home'
            },
            {
                id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
                name: 'Sites'
            },
            {
                id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
                name: 'testsite'
            },
            {
                id: '71626fae-0c04-4d0c-a129-20fa4c178716',
                name: 'documentLibrary'
            }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        locallySet: [],
        settable: [],
        isInheritanceEnabled: false
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeSiteNodeResponse: any = {
    list: {
        pagination: {
            count: 1,
            hasMoreItems: false,
            totalItems: 1,
            skipCount: 0,
            maxItems: 100
        },
        context: {},
        entries: [
            {
                entry: {
                    isLink: false,
                    isFile: false,
                    createdByUser: {
                        id: 'admin',
                        displayName: 'Administrator'
                    },
                    modifiedAt: '2018-03-22T15:40:10.093+0000',
                    nodeType: 'st:site',
                    parentId: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
                    aspectNames: [
                        'cm:tagscope',
                        'cm:titled',
                        'cm:auditable'
                    ],
                    createdAt: '2018-03-22T15:39:50.821+0000',
                    isFolder: true,
                    search: {
                        score: 10.292057
                    },
                    modifiedByUser: {
                        id: 'admin',
                        displayName: 'Administrator'
                    },
                    name: 'testsite',
                    location: 'nodes',
                    id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
                    properties: {
                        'st:siteVisibility': 'PUBLIC',
                        'cm:title': 'TEST_SITE',
                        'st:sitePreset': 'site-dashboard'
                    }
                }
            }
        ]
    }
};

export const fakeSiteRoles: any = {
    list: {
        pagination: {
            count: 4,
            hasMoreItems: false,
            totalItems: 4,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    displayName: 'site_testsite_SiteCollaborator',
                    id: 'GROUP_site_testsite_SiteCollaborator',
                    memberType: 'GROUP'
                }
            },
            {
                entry: {
                    displayName: 'site_testsite_SiteConsumer',
                    id: 'GROUP_site_testsite_SiteConsumer',
                    memberType: 'GROUP'
                }
            },
            {
                entry: {
                    displayName: 'site_testsite_SiteContributor',
                    id: 'GROUP_site_testsite_SiteContributor',
                    memberType: 'GROUP'
                }
            },
            {
                entry: {
                    displayName: 'site_testsite_SiteManager',
                    id: 'GROUP_site_testsite_SiteManager',
                    memberType: 'GROUP'
                }
            }
        ]
    }
};

export const fakeEmptyResponse: any = {
    list: {
        pagination: {
            count: 0,
            hasMoreItems: false,
            totalItems: 0,
            skipCount: 0,
            maxItems: 100
        },
        context: {},
        entries: []
    }
};

export const fakeNodeLocalSiteManager = {
    allowableOperations: [ 'updatePermissions' ],
    aspectNames: [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    createdAt: '2017-11-16T16:29:38.638+0000',
    path: {
        name: '/Company Home/Sites/testsite/documentLibrary',
        isComplete: true,
        elements: [
            {
                id: '2be275a1-b00d-4e45-83d8-66af43ac2252',
                name: 'Company Home'
            },
            {
                id: '1be10a97-6eb9-4b60-b6c6-1673900e9631',
                name: 'Sites'
            },
            {
                id: 'e002c740-b8f9-482a-a554-8fff4e4c9dc0',
                name: 'testsite',
                nodeType: 'st:site'
            },
            {
                id: '71626fae-0c04-4d0c-a129-20fa4c178716',
                name: 'documentLibrary'
            }
        ]
    },
    isFolder: true,
    isFile: false,
    createdByUser: {
        id: 'System',
        displayName: 'System'
    },
    modifiedAt: '2018-03-21T03:17:58.783+0000',
    permissions: {
        locallySet: [
            {
                authorityId: 'GROUP_site_testsite_SiteManager',
                name: 'SiteManager',
                accessStatus: 'ALLOWED'
            },
            {
                authorityId: 'superadminuser',
                name: 'SiteCollaborator',
                accessStatus: 'ALLOWED'
            }
        ],
        settable: [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        isInheritanceEnabled: false
    },
    modifiedByUser: {
        id: 'admin',
        displayName: 'PedroH Hernandez'
    },
    name: 'test',
    id: 'f472543f-7218-403d-917b-7a5861257244',
    nodeType: 'cm:folder',
    properties: {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};
