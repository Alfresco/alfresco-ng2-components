# ClassificationGuidesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**combinedInstructions**](ClassificationGuidesApi.md#combinedInstructions) | **POST** /combined-instructions | Combined instructions
[**createClassificationGuide**](ClassificationGuidesApi.md#createClassificationGuide) | **POST** /classification-guides | Create a classification guide
[**createSubtopic**](ClassificationGuidesApi.md#createSubtopic) | **POST** /topics/{topicId}/subtopics | Create a subtopic
[**createTopic**](ClassificationGuidesApi.md#createTopic) | **POST** /classification-guides/{classificationGuideId}/topics | Create a topic
[**deleteClassificationGuide**](ClassificationGuidesApi.md#deleteClassificationGuide) | **DELETE** /classification-guides/{classificationGuideId} | Delete a classification guide
[**deleteTopic**](ClassificationGuidesApi.md#deleteTopic) | **DELETE** /topics/{topicId} | Delete a topic
[**listClassificationGuides**](ClassificationGuidesApi.md#listClassificationGuides) | **GET** /classification-guides | List all classification guides
[**listSubtopics**](ClassificationGuidesApi.md#listSubtopics) | **GET** /topics/{topicId}/subtopics | List all subtopics
[**listTopics**](ClassificationGuidesApi.md#listTopics) | **GET** /classification-guides/{classificationGuideId}/topics | List all topics
[**showClassificationGuideById**](ClassificationGuidesApi.md#showClassificationGuideById) | **GET** /classification-guides/{classificationGuideId} | Get classification guide information
[**showTopicById**](ClassificationGuidesApi.md#showTopicById) | **GET** /topics/{topicId} | Get topic information
[**updateClassificationGuide**](ClassificationGuidesApi.md#updateClassificationGuide) | **PUT** /classification-guides/{classificationGuideId} | Update a classification guide
[**updateTopic**](ClassificationGuidesApi.md#updateTopic) | **PUT** /topics/{topicId} | Update a topic


<a name="combinedInstructions"></a>
# **combinedInstructions**
> InstructionEntry combinedInstructions(opts)

Combined instructions

Combines instructions from the given topics and the user defined instruction, if any.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'instructions':  //  | Instructions
};

classificationguidesApi.combinedInstructions(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **instructions** | [**CombinedInstructionBody**](CombinedInstructionBody.md)| Instructions | [optional] 

### Return type

[**InstructionEntry**](InstructionEntry.md)

<a name="createClassificationGuide"></a>
# **createClassificationGuide**
> ClassificationGuideEntry createClassificationGuide(classificationGuide)

Create a classification guide

Creates a new classification guide.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);


classificationguidesApi.createClassificationGuide(classificationGuide).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuide** | [**ClassificationGuideBody**](ClassificationGuideBody.md)| Classification guide | 

### Return type

[**ClassificationGuideEntry**](ClassificationGuideEntry.md)

<a name="createSubtopic"></a>
# **createSubtopic**
> TopicEntry createSubtopic(topicIdtopicopts)

Create a subtopic

Creates a new subtopic of a topic.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

};

classificationguidesApi.createSubtopic(topicIdtopicopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topicId** | **string**| The identifier for the topic | 
 **topic** | [**TopicBody**](TopicBody.md)| Subtopic | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 

### Return type

[**TopicEntry**](TopicEntry.md)

<a name="createTopic"></a>
# **createTopic**
> TopicEntry createTopic(classificationGuideIdtopicopts)

Create a topic

Creates a new topic.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

};

classificationguidesApi.createTopic(classificationGuideIdtopicopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuideId** | **string**| The identifier for the classification guide | 
 **topic** | [**TopicBody**](TopicBody.md)| Topic | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 

### Return type

[**TopicEntry**](TopicEntry.md)

<a name="deleteClassificationGuide"></a>
# **deleteClassificationGuide**
> deleteClassificationGuide(classificationGuideId)

Delete a classification guide

Deletes the classification guide with id **classificationGuideId**, including any topics and instructions.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);


classificationguidesApi.deleteClassificationGuide(classificationGuideId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuideId** | **string**| The identifier for the classification guide | 

### Return type

null (empty response body)

<a name="deleteTopic"></a>
# **deleteTopic**
> deleteTopic(topicId)

Delete a topic

Deletes the topic with id  **topicId**, including any subtopics and instructions.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);


classificationguidesApi.deleteTopic(topicId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topicId** | **string**| The identifier for the topic | 

### Return type

null (empty response body)

<a name="listClassificationGuides"></a>
# **listClassificationGuides**
> ClassificationGuidePaging listClassificationGuides(opts)

List all classification guides

Gets all classification guides.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the guide. The following optional fields can be requested:
* hasTopics - A flag indicating whether the guide already contains any topics.

  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'orderBy':  //  | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

  'where': where_example //  | A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
* enabled - e.g. (enabled = true OR enabled = false)

};

classificationguidesApi.listClassificationGuides(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **include** | [**string**](string.md)| Returns additional information about the guide. The following optional fields can be requested:
* hasTopics - A flag indicating whether the guide already contains any topics.
 | [optional] 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **orderBy** | [**string**](string.md)| A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
 | [optional] 
 **where** | **string**| A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
* enabled - e.g. (enabled = true OR enabled = false)
 | [optional] 

### Return type

[**ClassificationGuidePaging**](ClassificationGuidePaging.md)

<a name="listSubtopics"></a>
# **listSubtopics**
> SubtopicPaging listSubtopics(topicIdopts)

List all subtopics

Gets all subtopics of a topic.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'orderBy':  //  | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

  'where': where_example //  | A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
* hasInstruction
* hasSubtopics

  'includeSource': true //  | Also include **source** in addition to **entries** with folder information on the parent guide/topic
};

classificationguidesApi.listSubtopics(topicIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topicId** | **string**| The identifier for the topic | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **orderBy** | [**string**](string.md)| A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
 | [optional] 
 **where** | **string**| A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR. Fields to filter on:
* hasInstruction
* hasSubtopics
 | [optional] 
 **includeSource** | **boolean**| Also include **source** in addition to **entries** with folder information on the parent guide/topic | [optional] 

### Return type

[**SubtopicPaging**](SubtopicPaging.md)

<a name="listTopics"></a>
# **listTopics**
> TopicPaging listTopics(classificationGuideIdopts)

List all topics

Gets all topics.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'orderBy':  //  | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.

  'where': where_example //  | A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR e.g. (instruction=true and hasSubtopics=false). Fields to filter on:
* hasInstruction
* hasSubtopics

  'includeSource': true //  | Also include **source** in addition to **entries** with folder information on the parent guide/topic
};

classificationguidesApi.listTopics(classificationGuideIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuideId** | **string**| The identifier for the classification guide | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **orderBy** | [**string**](string.md)| A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to
sort the list by one or more fields.

Each field has a default sort order, which is normally ascending order. Read the API method implementation notes
above to check if any fields used in this method have a descending default search order.

To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field.
 | [optional] 
 **where** | **string**| A string to restrict the returned objects by using a predicate. Supported operations are AND, NOT, and OR e.g. (instruction=true and hasSubtopics=false). Fields to filter on:
* hasInstruction
* hasSubtopics
 | [optional] 
 **includeSource** | **boolean**| Also include **source** in addition to **entries** with folder information on the parent guide/topic | [optional] 

### Return type

[**TopicPaging**](TopicPaging.md)

<a name="showClassificationGuideById"></a>
# **showClassificationGuideById**
> ClassificationGuideEntry showClassificationGuideById(classificationGuideId)

Get classification guide information

Gets the classification guide with id **classificationGuideId**.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);


classificationguidesApi.showClassificationGuideById(classificationGuideId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuideId** | **string**| The identifier for the classification guide | 

### Return type

[**ClassificationGuideEntry**](ClassificationGuideEntry.md)

<a name="showTopicById"></a>
# **showTopicById**
> TopicEntry showTopicById(topicIdopts)

Get topic information

Gets the topic with id **topicId**.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

};

classificationguidesApi.showTopicById(topicIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topicId** | **string**| The identifier for the topic | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 

### Return type

[**TopicEntry**](TopicEntry.md)

<a name="updateClassificationGuide"></a>
# **updateClassificationGuide**
> ClassificationGuideEntry updateClassificationGuide(classificationGuideIdclassificationGuide)

Update a classification guide

Updates the classification guide with id **classificationGuideId**. For example, you can rename a classification guide.

### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);


classificationguidesApi.updateClassificationGuide(classificationGuideIdclassificationGuide).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationGuideId** | **string**| The identifier for the classification guide | 
 **classificationGuide** | [**ClassificationGuideBody**](ClassificationGuideBody.md)| Classification guide | 

### Return type

[**ClassificationGuideEntry**](ClassificationGuideEntry.md)

<a name="updateTopic"></a>
# **updateTopic**
> TopicEntry updateTopic(topicIdtopicopts)

Update a topic

Updates the topic with id **topicId**.

Use this to rename a topic or to add, edit, or remove the instruction associated with it.


### Example
```javascript
import ClassificationGuidesApi from 'ClassificationGuidesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationguidesApi = new ClassificationGuidesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.

};

classificationguidesApi.updateTopic(topicIdtopicopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topicId** | **string**| The identifier for the topic | 
 **topic** | [**TopicBody**](TopicBody.md)| Topic | 
 **include** | [**string**](string.md)| Returns additional information about the topic. The following optional fields can be requested:
* hasSubtopics - A flag indicating whether the topic already contains any subtopics.
* instruction - Contains details of any instruction in the topic.
* path - An ordered list of id-name pairs of all ancestor topics and the classification guide.
* classificationGuide - The classification guide this topic is in.
 | [optional] 

### Return type

[**TopicEntry**](TopicEntry.md)

