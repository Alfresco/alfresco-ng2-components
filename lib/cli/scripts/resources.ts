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

/* cSpell:disable */
/* eslint-disable @typescript-eslint/naming-convention */

export const ACTIVITI_CLOUD_APPS: any = {
    SUB_PROCESS_APP: {
        name: 'subprocessapp',
        file_location: (TAG = 'develop') => `https://github.com/Alfresco/alfresco-ng2-components/blob/${TAG}/e2e/resources/activiti7/subprocessapp.zip?raw=true`,
        processes: {
            processchild: 'processchild',
            processparent: 'processparent'
        },
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'testgroup'], users: ['hruser'] }
        ]
    },
    CONNECTOR_REGRESSION: {
        name: 'connectore-regression',
        file_location: (TAG = 'develop') => `https://github.com/Alfresco/alfresco-ng2-components/blob/${TAG}/e2e/resources/activiti7/connector-regression.zip?raw=true`,
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser', 'processadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'testgroup'], users: ['hruser', 'salesuser'] }
        ],
        variables: {
            connectors: {
              aspose: {},
              calendar: {
                TEAMS_CLIENT_ID: "",
                TEAMS_CLIENT_SECRET: "",
                TEAMS_SCOPE: "https://graph.microsoft.com/.default",
                TEAMS_USERNAME: "",
                TEAMS_PASSWORD: "",
                TEAMS_TENANT: ""
              },
              comprehend: {
                AWS_ACCESS_KEY_ID: "adasd",
                AWS_SECRET_KEY: "sada",
                AWS_S3_BUCKET: "aae-data",
                AWS_REGION: "sdada",
                AWS_COMPREHEND_ROLE_ARN: "dsada"
              },
              content: {},
              "docusign-connector": {
                DOCUSIGN_ACCOUNT_ID: "asdasd",
                DOCUSIGN_CLIENT_ID: "adsada",
                DOCUSIGN_IMPERSONATED_USER_ID: "dadadasd",
                DOCUSIGN_AUTH_SERVER: "account-d.docusign.com",
                DOCUSIGN_JWT_LIFETIME: "3600",
                DOCUSIGN_RSA_KEY: "adsada",
                DOCUSIGN_DEFAULT_EMAIL_SUBJECT: "Please sign your contract",
                DOCUSIGN_DEFAULT_SIGNHERE_LABEL: "SignHereTab",
                DOCUSIGN_DEFAULT_TIMEOUT: "3600",
                DOCUSIGN_POLL_SLEEP: "30000"
              },
              lambda: {
                AWS_LAMBDA_AWS_ACCESS_KEY: "sdada",
                AWS_LAMBDA_AWS_SECRET_KEY: "sdad",
                AWS_LAMBDA_AWS_REGION: "adsada"
              },
              mariadb: {
                DB_USERNAME: "root",
                DB_PASSWORD: "adminadmin",
                DB_NAME: "employees",
                MARIADB_HOST: "",
                MARIADB_PORT: "3306",
                DB_DATASOURCE: "jdbc:mariadb://${MARIADB_HOST}:${MARIADB_PORT}/${DB_NAME}",
                DB_DRIVER_CLASS_NAME: "org.mariadb.jdbc.Driver"
              },
              rekognition: {
                AWS_ACCESS_KEY_ID: "saddasda",
                AWS_SECRET_KEY: "sdadsada",
                AWS_S3_BUCKET: "aae-data",
                AWS_REGION: "asdadsad"
              },
              rest: { EVENT_NOT_MATCH_STATUS: "404" },
              "salesforce-connector": {
                SALESFORCE_CLIENT_ID: "",
                SALESFORCE_CLIENT_SECRET: "asdad",
                SALESFORCE_USERNAME: "build_user@alfresco.com",
                SALESFORCE_PASSWORD: "asdsada",
                SALESFORCE_SECURITY_TOKEN: "sdadsa",
                SALESFORCE_URL_LOGIN: "https://login.salesforce.com/services/oauth2/token",
                SALESFORCE_SOAP_URL_LOGIN: "https://login.salesforce.com/services/Soap/c/45.0",
                SALESFORCE_VERSION: "45.0"
              },
              slack: { SLACK_SIGNING_SECRET: "vito", SLACK_BOT_TOKEN: "albano" },
              teams: {
                TEAMS_CLIENT_ID: "",
                TEAMS_CLIENT_SECRET: "",
                TEAMS_SCOPE: "https://graph.microsoft.com/.default",
                TEAMS_USERNAME: "",
                TEAMS_PASSWORD: "",
                TEAMS_TENANT: ""
              },
              textract: {
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_KEY: "sdadasda",
                AWS_S3_BUCKET: "aae-data",
                AWS_REGION: "sdadsad"
              },
              transcribe: {
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_KEY: "",
                AWS_S3_BUCKET: "aae-bucket",
                AWS_REGION: "",
                AWS_TRANSCRIBE_LANGUAGES: ""
              },
              twilio: { TWILIO_ACCOUNT: "dadsadas", TWILIO_TOKEN: "dadasda" }
            }
          }
    },
    SIMPLE_APP: {
        name: 'simpleapp',
        file_location: (TAG = 'develop') => `https://github.com/Alfresco/alfresco-ng2-components/blob/${TAG}/e2e/resources/activiti7/simpleapp.zip?raw=true`,
        processes: {
            processwithvariables: 'processwithvariables',
            simpleProcess: 'simpleprocess',
            dropdownrestprocess: 'dropdownrestprocess',
            multilingualprocess: 'multilingualprocess',
            processWithTabVisibility: 'processwithtabvisibility',
            startmessageevent: 'start-message-event',
            intermediatemessageevent: 'intermediate-message-event',
            intboundaryevent: 'int-boundary-event',
            nonintboundaryevent: 'nonint-boundary-event',
            intboundarysubprocess: 'int-boundary-subprocess',
            intstartmessageevent: 'int-start-message-event',
            nonintstartmessageevent: 'nonint-start-message-event',
            siblingtaskprocess: 'siblingtaskprocess',
            startTaskVisibilityForm: 'start-task-visibility-form',
            startVisibilityForm: 'start-visibility-form',
            processstring: 'processstring',
            processinteger: 'processinteger',
            processboolean: 'processboolean',
            processdate: 'processdate',
            multiprocess: 'multiprocess',
            terminateexclusive: 'terminate-exclusive',
            terminatesubprocess: 'terminate-subprocess',
            multiinstancedmnparallel: 'multiinstance-dmnparallel',
            multiinstancecallactivity: 'multiinstance-callactivity',
            multiinstancecollection: 'multiinstance-collection',
            multiinstancecompletion: 'multiinstance-completion',
            multiinstancesequential: 'multiinstance-sequential',
            multiinstanceservicetask: 'multiinstance-servicetask',
            multiinstanceusertask: 'multiinstance-usertask',
            multiinstancedmnsequence: 'multiinstance-dmnsequence',
            multiinstancemanualtask: 'multiinstance-manualtask',
            multiinstancesubprocess: 'multiinstance-subprocess',
            calledprocess: 'calledprocess',
            booleanvisibilityprocess: 'booleanvisibilityprocess',
            numbervisibilityprocess: 'numbervisibilityprocess',
            processformoutcome: 'outcomebuttons',
            uploadSingleMultipleFiles: 'upload-single-multiple-pro',
            processDisplayRestJson: 'process-display-rest-json',
            poolStartEndMessageThrow: 'pool-start-end-mess-throw',
            poolStartEndMessageCatch: 'pool-start-end-mess-catch',
            poolProcessCalled: 'pool-process-called',
            poolProcessCalling: 'pool-process-calling',
            poolNonIntBoundaryThrown: 'pool-nonint-boundary-throw',
            poolNonIntBoundaryCatch: 'pool-nonint-boundary-catch',
            poolIntermediateMessageThrow: 'pool-interm-message-throw',
            poolIntermediateMessageCatch: 'pool-interm-message-catch',
            poolInterruptingBoundarySubprocessThrow: 'pool-int-bound-subpr-throw',
            poolInterruptingBoundarySubprocessCatch: 'pool-int-bound-subpr-catch',
            poolInterruptingBoundaryThrow: 'pool-int-boundary-throw',
            poolInterruptingBoundaryCatch: 'pool-int-boundary-catch',
            outputVariablesMapping: 'output-variables-mapping'
        },
        forms: {
            tabVisibilityFields: {
                name: 'tabvisibilitywithfields'
            },
            tabVisibilityVars: {
                name: 'tabvisibilitywithvars'
            },
            usertaskform: {
                name: 'usertaskform'
            },
            dropdownform: {
                name: 'dropdownform'
            },
            formVisibility: {
                name: 'form-visibility'
            },
            multilingualform: {
                name: 'multilingualform'
            },
            inputform: {
                name: 'inputform'
            },
            outputform: {
                name: 'outputform'
            },
            exclusiveconditionform: {
                name: 'exclusive-condition-form'
            },
            uploadlocalfileform: {
                name: 'upload-localfile-form'
            },
            booleanvisibility: {
                name: 'booleanvisibility'
            },
            requirednumbervisibility: {
                name: 'requirednumbervisibility'
            },
            mealform: {
                name: 'mealform'
            },
            resultcollectionform: {
                name: 'resultcollectionform'
            },
            uploadSingleMultiple: {
                name: 'upload-single-multiple',
                widgets: {
                    contentMultipleAttachFileId: 'UploadMultipleFileFromContentId'
                }
            },
            formWithJsonWidget: {
                name: 'form-with-json-widget'
            },
            formWithAllWidgets: {
                name: 'form-with-all-widgets'
            },
            poolForm: {
                name: 'pool-usertaskform'
            },
            formWithSingleInput: {
                name: 'form-with-single-input'
            }
        },
        tasks: {
            processstring: 'inputtask',
            uploadSingleMultipleFiles: 'UploadSingleMultipleFiles'
        },
        security: [
            { role: 'APPLICATION_MANAGER', groups: [], users: ['manageruser'] },
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser', 'processadminuser'] },
            { role: 'ACTIVITI_USER', groups: ['hr', 'sales', 'testgroup'], users: ['hruser'] }
        ],
        infrastructure: {connectors: {restconnector: {}}, bridges: {}}
};

export const ACTIVITI_APPS: any = {
    apps : [
        {
            name: 'e2e-Application'
        }
    ]
};

export const ACS_DEFAULT: any = {
    files : [
        {
            name: 'e2e_share_profile_pic.png',
            destination: '-my-',
            action: 'UPLOAD'
        },
        {
            name: 'e2e_share_profile_pic.jpg',
            destination: '-my-',
            action: 'UPLOAD'
        },
        {
            name: 'e2e_lock.png',
            destination: '-my-',
            action: 'LOCK'
        },
        {
            name: 'e2e_second_lock.png',
            destination: '-my-',
            action: 'LOCK'
        },
        {
            name: 'e2e_share_file.jpg',
            destination: '-my-',
            action: 'SHARE'
        },
        {
            name: 'e2e_favorite_file.jpg',
            destination: '-my-',
            action: 'FAVORITE'
        }
    ],

    e2eFolder:
        {
            name: 'e2e-test-data'
        }
};
