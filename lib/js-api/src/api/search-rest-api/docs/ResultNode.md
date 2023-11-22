# ResultNode

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to null]
**name** | **string** | The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
The character . must not be used at the end of the name.
 | [default to null]
**nodeType** | **string** |  | [default to null]
**isFolder** | **boolean** |  | [default to null]
**isFile** | **boolean** |  | [default to null]
**isLocked** | **boolean** |  | [optional] [default to null]
**modifiedAt** | [**Date**](Date.md) |  | [default to null]
**modifiedByUser** | [**UserInfo**](UserInfo.md) |  | [default to null]
**createdAt** | [**Date**](Date.md) |  | [default to null]
**createdByUser** | [**UserInfo**](UserInfo.md) |  | [default to null]
**parentId** | **string** |  | [optional] [default to null]
**isLink** | **boolean** |  | [optional] [default to null]
**content** | [**ContentInfo**](ContentInfo.md) |  | [optional] [default to null]
**aspectNames** | **string[]** |  | [optional] [default to null]
**properties** | **any** |  | [optional] [default to null]
**allowableOperations** | **string[]** |  | [optional] [default to null]
**path** | [**PathInfo**](PathInfo.md) |  | [optional] [default to null]
**search** | [**SearchEntry**](SearchEntry.md) |  | [optional] [default to null]
**archivedByUser** | [**UserInfo**](UserInfo.md) |  | [optional] [default to null]
**archivedAt** | [**Date**](Date.md) |  | [optional] [default to null]
**versionLabel** | **string** |  | [optional] [default to null]
**versionComment** | **string** |  | [optional] [default to null]


