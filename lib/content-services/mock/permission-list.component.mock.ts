export const fakeNodeWithPermissions: any = {
    'aspectNames': [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    'createdAt': '2017-11-16T16:29:38.638+0000',
    'isFolder': true,
    'isFile': false,
    'createdByUser': {
        'id': 'System',
        'displayName': 'System'
    },
    'modifiedAt': '2018-03-21T03:17:58.783+0000',
    'permissions': {
        'inherited': [
            {
                'authorityId': 'guest',
                'name': 'Read',
                'accessStatus': 'ALLOWED'
            },
            {
                'authorityId': 'GROUP_EVERYONE',
                'name': 'Read',
                'accessStatus': 'ALLOWED'
            }
        ],
        'locallySet': [
            {
                'authorityId': 'GROUP_EVERYONE',
                'name': 'Contributor',
                'accessStatus': 'ALLOWED'
            }
        ],
        'settable': [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        'isInheritanceEnabled': true
    },
    'modifiedByUser': {
        'id': 'admin',
        'displayName': 'PedroH Hernandez'
    },
    'name': 'test',
    'id': 'f472543f-7218-403d-917b-7a5861257244',
    'nodeType': 'cm:folder',
    'properties': {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};

export const fakeNodeInheritedOnly: any = {
    'aspectNames': [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    'createdAt': '2017-11-16T16:29:38.638+0000',
    'isFolder': true,
    'isFile': false,
    'createdByUser': {
        'id': 'System',
        'displayName': 'System'
    },
    'modifiedAt': '2018-03-21T03:17:58.783+0000',
    'permissions': {
        'inherited': [
            {
                'authorityId': 'guest',
                'name': 'Read',
                'accessStatus': 'ALLOWED'
            },
            {
                'authorityId': 'GROUP_EVERYONE',
                'name': 'Read',
                'accessStatus': 'ALLOWED'
            }
        ],
        'settable': [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        'isInheritanceEnabled': true
    },
    'modifiedByUser': {
        'id': 'admin',
        'displayName': 'PedroH Hernandez'
    },
    'name': 'test',
    'id': 'f472543f-7218-403d-917b-7a5861257244',
    'nodeType': 'cm:folder',
    'properties': {
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
    'aspectNames': [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
    ],
    'createdAt': '2017-11-16T16:29:38.638+0000',
    'isFolder': true,
    'isFile': false,
    'createdByUser': {
        'id': 'System',
        'displayName': 'System'
    },
    'modifiedAt': '2018-03-21T03:17:58.783+0000',
    'permissions': {
        'locallySet': [
            {
                'authorityId': 'GROUP_EVERYONE',
                'name': 'Contributor',
                'accessStatus': 'ALLOWED'
            }
        ],
        'settable': [
            'Contributor',
            'Collaborator',
            'Coordinator',
            'Editor',
            'Consumer'
        ],
        'isInheritanceEnabled': true
    },
    'modifiedByUser': {
        'id': 'admin',
        'displayName': 'PedroH Hernandez'
    },
    'name': 'test',
    'id': 'f472543f-7218-403d-917b-7a5861257244',
    'nodeType': 'cm:folder',
    'properties': {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
            'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
    }
};
