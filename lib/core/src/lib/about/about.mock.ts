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

export const mockDependencies = {
    '@alfresco/mock-core': '3.7.0',
    '@alfresco/mock-services': '2.0.0',
    '@angular/mock-core': '8.0.0',
    '@angular/mock-services': '8.0.0'
};

export const mockPlugins = [
    {
        $name: 'plugin1',
        $version: '1.0.0',
        $vendor: 'mockVender-1',
        $license: 'MockLicense-2.0',
        $runtime: '2.7.0',
        $description: 'example plugin'
    },
    {
        $name: 'plugin2',
        $version: '1.0.0',
        $vendor: 'mockVender-2',
        $license: 'MockLicense-3.0',
        $runtime: '2.7.0',
        $description: 'example plugin 2'
    }
];

export const aboutGithubDetails = {
    url: 'https://github.com/componany/repository/commits/',
    defualrUrl: 'https://github.com/Alfresco/alfresco-ng2-components/commits/',
    version: '0.0.7',
    ecmHost: 'https://mock.ecmhost.com',
    bpmHost: 'https://mock.bpmhost.com',
    appName: 'mock-application-name'
};

export const aboutAPSMockDetails = {
    revisionVersion: '0',
    edition: 'APS',
    type: 'bpmSuite',
    majorVersion: '1',
    minorVersion: '10'
 };

export const mockModules: any = {
       edition: 'Enterprise',
       version: {
          major: '6',
          minor: '2',
          patch: '0',
          hotfix: '0',
          schema: 13001,
          label: 'ra498a911-b5',
          display: '6.2.0.0'
       },
       license: {
          issuedAt: '2018-12-20T12:07:31.276+0000',
          expiresAt: '2019-05-31T23:00:00.000+0000',
          remainingDays: 100,
          holder: 'CompanyQA',
          mode: 'ENTERPRISE',
          entitlements: {
             isClusterEnabled: true,
             isCryptodocEnabled: true
          }
       },
       status: {
          isReadOnly: false,
          isAuditEnabled: true,
          isQuickShareEnabled: true,
          isThumbnailGenerationEnabled: true
       },
       modules: [
          {
             id: 'mock-id',
             title: 'ABC Repo',
             description: 'ABC Repository Extension',
             version: '3.2.0',
             installState: 'UNKNOWN',
             versionMin: '6.1',
             versionMax: '999'
          },
          {
             id: 'aos-module-id',
             title: 'AOFS Module',
             description: 'Allows applications that can talk to a SharePoint server to talk to your Alfresco installation',
             version: '1.3.0',
             installDate: '2019-02-07T12:26:13.271+0000',
             installState: 'INSTALLED',
             versionMin: '6.0',
             versionMax: '999'
          },
          {
             id: 'mock-saml-repo',
             title: 'SAML Repository Module',
             description: 'The Repository piece of the Alfresco SAML Module',
             version: '1.1.1',
             installDate: '2019-02-07T12:26:12.565+0000',
             installState: 'INSTALLED',
             versionMin: '6.0',
             versionMax: '6.99'
          }
       ]
};
