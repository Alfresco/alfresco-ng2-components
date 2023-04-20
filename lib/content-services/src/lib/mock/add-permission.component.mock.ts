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

/* spellchecker: disable */

export const fakeAuthorityResults: any[] = [{
    entry: {
        aspectNames: [
            'cm:personDisabled',
            'cm:ownable',
            'cm:preferences'
        ],
        isFolder: false,
        search: {
            score: 4.014668
        },
        isFile: false,
        name: 'dc103838-645f-43c1-8a2a-bc187e13c343',
        location: 'nodes',
        id: 'dc103838-645f-43c1-8a2a-bc187e13c343',
        nodeType: 'cm:person',
        properties: {
            'cm:location': 'Tilbury, UK',
            'cm:persondescription': {
                contentUrl: 'store://2018/4/18/9/30/514bb261-bc61-4502-ad2f-dfafec9ae4eb.bin',
                mimetype: 'application/octet-stream',
                size: 55,
                encoding: 'UTF-8',
                locale: 'en_US',
                id: 148,
                infoUrl: 'contentUrl=store://2018/4/18/9/30/514bb261-bc61-4502-ad2f-dfafec9ae4eb.bin|mimetype=application/octet-stream|size=55|encoding=UTF-8|locale=en_US_'
            },
            'cm:owner': {
                id: 'abeecher',
                displayName: 'Alice Beecher'
            },
            'cm:companyaddress2': 'Tilbury',
            'cm:userStatus': 'Helping to design the look and feel of the new web site',
            'cm:companyaddress1': '200 Butterwick Street',
            'cm:telephone': '0112211001100',
            'cm:preferenceValues': {
                contentUrl: 'store://2018/4/18/9/30/afc39bc9-6bac-4f24-8730-9d9f617a322e.bin',
                mimetype: 'text/plain',
                size: 709,
                encoding: 'UTF-8',
                locale: 'en_US',
                id: 147,
                infoUrl: 'contentUrl=store://2018/4/18/9/30/afc39bc9-6bac-4f24-8730-9d9f617a322e.bin|mimetype=text/plain|size=709|encoding=UTF-8|locale=en_US_'
            },
            'cm:userName': 'abeecher',
            'cm:companyaddress3': 'UK',
            'cm:userStatusTime': '2011-02-15T20:20:13.432+0000',
            'cm:email': 'abeecher@example.com',
            'cm:skype': 'abeecher',
            'cm:jobtitle': 'Graphic Designer',
            'cm:homeFolderProvider': 'userHomesHomeFolderProvider',
            'cm:homeFolder': '242533d8-68e6-4811-bc3d-61ec63c614aa',
            'cm:lastName': 'Beecher',
            'cm:sizeCurrent': 8382006,
            'cm:sizeQuota': -1,
            'cm:firstName': 'Alice',
            'cm:emailFeedId': 440,
            'cm:authorizationStatus': 'NEVER_AUTHORIZED',
            'cm:mobile': '0112211001100',
            'cm:organization': 'Moresby, Garland and Wedge',
            'cm:companypostcode': 'ALF1 SAM1'
        },
        parentId: '063f5d48-a0b3-4cbf-826c-88a4fbfa3336'
    }
},
{
    entry: {
        aspectNames: [
            'cm:ownable',
            'cm:preferences'
        ],
        isFolder: false,
        search: {
            score: 4.014668
        },
        isFile: false,
        name: 'e320c16b-a763-4a4e-9f22-286ff5d8dca2',
        location: 'nodes',
        id: 'e320c16b-a763-4a4e-9f22-286ff5d8dca2',
        nodeType: 'cm:person',
        properties: {
            'cm:homeFolderProvider': 'bootstrapHomeFolderProvider',
            'cm:preferenceValues': {
                contentUrl: 'store://2018/4/23/14/42/92bb4aa9-db27-41a4-9804-ddab3cc83d3e.bin',
                mimetype: 'text/plain',
                size: 102,
                encoding: 'UTF-8',
                locale: 'en',
                id: 313,
                infoUrl: 'contentUrl=store://2018/4/23/14/42/92bb4aa9-db27-41a4-9804-ddab3cc83d3e.bin|mimetype=text/plain|size=102|encoding=UTF-8|locale=en_'
            },
            'cm:authorizationStatus': 'AUTHORIZED',
            'cm:homeFolder': 'a20cd541-4ada-4525-9807-9fa0a047d9f4',
            'cm:userName': 'admin',
            'cm:sizeCurrent': 0,
            'cm:email': 'admin@alfresco.com',
            'cm:firstName': 'Administrator',
            'cm:owner': {
                id: 'admin',
                displayName: 'Administrator'
            }
        },
        parentId: '063f5d48-a0b3-4cbf-826c-88a4fbfa3336'
    }
},
{
    entry: {
        isFolder: false,
        search: {
            score: 0.3541112
        },
        isFile: false,
        name: 'GROUP_ALFRESCO_ADMINISTRATORS',
        location: 'nodes',
        id: 'GROUP_ALFRESCO_ADMINISTRATORS',
        nodeType: 'cm:authorityContainer',
        properties: {
            'cm:authorityName': 'GROUP_ALFRESCO_ADMINISTRATORS'
        },
        parentId: '030d833e-da8e-4f5c-8ef9-d809638bd04b'
    }
}];

export const fakeAuthorityListResult: any = {
    list: {
        pagination: {
            count: 0,
            hasMoreItems: false,
            totalItems: 0,
            skipCount: 0,
            maxItems: 100
        },
        context: {},
        entries: fakeAuthorityResults
    }
};

export const fakeNameListResult: any = {
    list: {
        pagination: {
            count: 2,
            hasMoreItems: false,
            totalItems: 2,
            skipCount: 0,
            maxItems: 20
        },
        context: {
            consistency: {
                lastTxId: 5496
            }
        },
        entries: [{
            entry: {
                aspectNames: ['cm:ownable'],
                isFolder: false,
                search: {
                    score: 1.0
                },
                isFile: false,
                name: '730cd9b0-5617-4865-aee8-90de1d596997',
                location: 'nodes',
                id: '730cd9b0-5617-4865-aee8-90de1d596997',
                nodeType: 'cm:person',
                properties: {
                    'cm:homeFolderProvider': 'userHomesHomeFolderProvider',
                    'cm:authorizationStatus': 'NEVER_AUTHORIZED',
                    'cm:homeFolder': '277f505d-6526-45b1-a7b3-c9bdd66f17f6',
                    'cm:userName': 'test1',
                    'cm:lastName': 'lastName1',
                    'cm:sizeCurrent': 0,
                    'cm:email': 'test1@gmail.com',
                    'cm:sizeQuota': 1073741824,
                    'cm:firstName': 'firstName',
                    'cm:owner': {
                        id: 'test1',
                        displayName: 'firstName lastName1'
                    }
                },
                parentId: '3e9ce910-a4a0-4531-8f80-7734bece6342'
            }
        }, {
            entry: {
                aspectNames: ['cm:ownable'],
                isFolder: false,
                search: {
                    score: 1.0
                },
                isFile: false,
                name: '3d1e9e57-505f-431e-bb2b-38ad8d5d2d15',
                location: 'nodes',
                id: '3d1e9e57-505f-431e-bb2b-38ad8d5d2d15',
                nodeType: 'cm:person',
                properties: {
                    'cm:homeFolderProvider': 'userHomesHomeFolderProvider',
                    'cm:authorizationStatus': 'NEVER_AUTHORIZED',
                    'cm:homeFolder': '81a07ff0-82fb-4bbb-b869-d5fd92e71e17',
                    'cm:userName': 'test11',
                    'cm:lastName': 'lastName2',
                    'cm:sizeCurrent': 0,
                    'cm:email': 'test2@gmail.com',
                    'cm:sizeQuota': -1,
                    'cm:firstName': 'firstName',
                    'cm:owner': {
                        id: 'test11',
                        displayName: 'firstName lastName2'
                    }
                },
                parentId: '3e9ce910-a4a0-4531-8f80-7734bece6342'
            }
        }]
    }
};
