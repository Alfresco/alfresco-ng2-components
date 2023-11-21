Provides access to classification and security mark related features.

- Last Build date: 2018-11-05T11:25:29.023Z


## Documentation for API Endpoints

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*.ClassificationGuidesApi* | [**combinedInstructions**](docs/ClassificationGuidesApi.md#combinedInstructions) | **POST** /combined-instructions | Combined instructions
*.ClassificationGuidesApi* | [**createClassificationGuide**](docs/ClassificationGuidesApi.md#createClassificationGuide) | **POST** /classification-guides | Create a classification guide
*.ClassificationGuidesApi* | [**createSubtopic**](docs/ClassificationGuidesApi.md#createSubtopic) | **POST** /topics/{topicId}/subtopics | Create a subtopic
*.ClassificationGuidesApi* | [**createTopic**](docs/ClassificationGuidesApi.md#createTopic) | **POST** /classification-guides/{classificationGuideId}/topics | Create a topic
*.ClassificationGuidesApi* | [**deleteClassificationGuide**](docs/ClassificationGuidesApi.md#deleteClassificationGuide) | **DELETE** /classification-guides/{classificationGuideId} | Delete a classification guide
*.ClassificationGuidesApi* | [**deleteTopic**](docs/ClassificationGuidesApi.md#deleteTopic) | **DELETE** /topics/{topicId} | Delete a topic
*.ClassificationGuidesApi* | [**listClassificationGuides**](docs/ClassificationGuidesApi.md#listClassificationGuides) | **GET** /classification-guides | List all classification guides
*.ClassificationGuidesApi* | [**listSubtopics**](docs/ClassificationGuidesApi.md#listSubtopics) | **GET** /topics/{topicId}/subtopics | List all subtopics
*.ClassificationGuidesApi* | [**listTopics**](docs/ClassificationGuidesApi.md#listTopics) | **GET** /classification-guides/{classificationGuideId}/topics | List all topics
*.ClassificationGuidesApi* | [**showClassificationGuideById**](docs/ClassificationGuidesApi.md#showClassificationGuideById) | **GET** /classification-guides/{classificationGuideId} | Get classification guide information
*.ClassificationGuidesApi* | [**showTopicById**](docs/ClassificationGuidesApi.md#showTopicById) | **GET** /topics/{topicId} | Get topic information
*.ClassificationGuidesApi* | [**updateClassificationGuide**](docs/ClassificationGuidesApi.md#updateClassificationGuide) | **PUT** /classification-guides/{classificationGuideId} | Update a classification guide
*.ClassificationGuidesApi* | [**updateTopic**](docs/ClassificationGuidesApi.md#updateTopic) | **PUT** /topics/{topicId} | Update a topic
*.ClassificationReasonsApi* | [**createClassificationReason**](docs/ClassificationReasonsApi.md#createClassificationReason) | **POST** /classification-reasons | Create a classification reason
*.ClassificationReasonsApi* | [**deleteClassificationReason**](docs/ClassificationReasonsApi.md#deleteClassificationReason) | **DELETE** /classification-reasons/{classificationReasonId} | Delete a classification reason
*.ClassificationReasonsApi* | [**listClassificationReasons**](docs/ClassificationReasonsApi.md#listClassificationReasons) | **GET** /classification-reasons | List all classification reasons
*.ClassificationReasonsApi* | [**showClassificationReasonById**](docs/ClassificationReasonsApi.md#showClassificationReasonById) | **GET** /classification-reasons/{classificationReasonId} | Get classification reason information
*.ClassificationReasonsApi* | [**updateClassificationReason**](docs/ClassificationReasonsApi.md#updateClassificationReason) | **PUT** /classification-reasons/{classificationReasonId} | Update a classification reason
*.DeclassificationExemptionsApi* | [**createDeclassificationExemption**](docs/DeclassificationExemptionsApi.md#createDeclassificationExemption) | **POST** /declassification-exemptions | Create a declassification exemption
*.DeclassificationExemptionsApi* | [**deleteDeclassificationExemption**](docs/DeclassificationExemptionsApi.md#deleteDeclassificationExemption) | **DELETE** /declassification-exemptions/{declassificationExemptionId} | Delete a declassification exemption
*.DeclassificationExemptionsApi* | [**listDeclassificationExemptions**](docs/DeclassificationExemptionsApi.md#listDeclassificationExemptions) | **GET** /declassification-exemptions | List all declassification exemptions
*.DeclassificationExemptionsApi* | [**showDeclassificationExemptionById**](docs/DeclassificationExemptionsApi.md#showDeclassificationExemptionById) | **GET** /declassification-exemptions/{declassificationExemptionId} | Get declassification exemption information
*.DeclassificationExemptionsApi* | [**updateDeclassificationExemption**](docs/DeclassificationExemptionsApi.md#updateDeclassificationExemption) | **PUT** /declassification-exemptions/{declassificationExemptionId} | Update a declassification exemption
*.DefaultClassificationValuesApi* | [**calculateDefaultDeclassificationDate**](docs/DefaultClassificationValuesApi.md#calculateDefaultDeclassificationDate) | **POST** /default-classification-values/{nodeId}/calculate-declassification-date | Calculate the default declassification date
*.SecurityControlSettingsApi* | [**getSecurityControlSetting**](docs/SecurityControlSettingsApi.md#getSecurityControlSetting) | **GET** /security-control-settings/{securityControlSettingKey} | Get security control setting value
*.SecurityControlSettingsApi* | [**updateSecurityControlSetting**](docs/SecurityControlSettingsApi.md#updateSecurityControlSetting) | **PUT** /security-control-settings/{securityControlSettingKey} | Update security control setting value


## Documentation for Models

 - [ClassificationGuideBody](docs/ClassificationGuideBody.md)
 - [ClassificationGuideEntry](docs/ClassificationGuideEntry.md)
 - [ClassificationGuidePaging](docs/ClassificationGuidePaging.md)
 - [ClassificationGuidePagingList](docs/ClassificationGuidePagingList.md)
 - [ClassificationGuidesBody](docs/ClassificationGuidesBody.md)
 - [ClassificationGuidesEntry](docs/ClassificationGuidesEntry.md)
 - [ClassificationInformation](docs/ClassificationInformation.md)
 - [ClassificationReason](docs/ClassificationReason.md)
 - [ClassificationReasonBody](docs/ClassificationReasonBody.md)
 - [ClassificationReasonEntry](docs/ClassificationReasonEntry.md)
 - [ClassificationReasonsPaging](docs/ClassificationReasonsPaging.md)
 - [ClassificationReasonsPagingList](docs/ClassificationReasonsPagingList.md)
 - [DeclassificationDate](docs/DeclassificationDate.md)
 - [DeclassificationExemption](docs/DeclassificationExemption.md)
 - [DeclassificationExemptionBody](docs/DeclassificationExemptionBody.md)
 - [DeclassificationExemptionEntry](docs/DeclassificationExemptionEntry.md)
 - [DeclassificationExemptionsPaging](docs/DeclassificationExemptionsPaging.md)
 - [DeclassificationExemptionsPagingList](docs/DeclassificationExemptionsPagingList.md)
 - [ErrorError](docs/ErrorError.md)
 - [Instruction](docs/Instruction.md)
 - [InstructionBody](docs/InstructionBody.md)
 - [InstructionEntry](docs/InstructionEntry.md)
 - [ModelError](docs/ModelError.md)
 - [Pagination](docs/Pagination.md)
 - [Path](docs/Path.md)
 - [PathElement](docs/PathElement.md)
 - [SecurityControlSetting](docs/SecurityControlSetting.md)
 - [SecurityControlSettingBody](docs/SecurityControlSettingBody.md)
 - [SecurityControlSettingEntry](docs/SecurityControlSettingEntry.md)
 - [SecurityMark](docs/SecurityMark.md)
 - [SecurityMarkBody](docs/SecurityMarkBody.md)
 - [SecurityMarkInformation](docs/SecurityMarkInformation.md)
 - [SecurityMarkInformationBody](docs/SecurityMarkInformationBody.md)
 - [SecurityMarks](docs/SecurityMarks.md)
 - [SecurityMarksBody](docs/SecurityMarksBody.md)
 - [SubtopicPaging](docs/SubtopicPaging.md)
 - [Topic](docs/Topic.md)
 - [TopicBody](docs/TopicBody.md)
 - [TopicEntry](docs/TopicEntry.md)
 - [TopicPaging](docs/TopicPaging.md)
 - [TopicPagingList](docs/TopicPagingList.md)
 - [ClassificationGuideInTopic](docs/ClassificationGuideInTopic.md)
 - [ClassificationGuidesInTopic](docs/ClassificationGuidesInTopic.md)
 - [CombinedInstructionBody](docs/CombinedInstructionBody.md)
 - [ClassificationGuide](docs/ClassificationGuide.md)
 - [ClassificationGuides](docs/ClassificationGuides.md)

