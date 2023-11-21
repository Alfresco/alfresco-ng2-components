**GS Core API**

Provides access to the core features of Alfresco Governance Services.


- Last Build date: 2018-11-05T11:25:35.010Z


## Documentation for API Endpoints

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*.FilePlansApi* | [**createFilePlanCategories**](docs/FilePlansApi.md#createFilePlanCategories) | **POST** /file-plans/{filePlanId}/categories | Create record categories for a file plan
*.FilePlansApi* | [**getFilePlan**](docs/FilePlansApi.md#getFilePlan) | **GET** /file-plans/{filePlanId} | Get a file plan
*.FilePlansApi* | [**getFilePlanCategories**](docs/FilePlansApi.md#getFilePlanCategories) | **GET** /file-plans/{filePlanId}/categories | List file plans's children
*.FilePlansApi* | [**updateFilePlan**](docs/FilePlansApi.md#updateFilePlan) | **PUT** /file-plans/{filePlanId} | Update a file plan
*.FilesApi* | [**declareRecord**](docs/FilesApi.md#declareRecord) | **POST** /files/{fileId}/declare | Declare as record
*.GssitesApi* | [**createRMSite**](docs/GssitesApi.md#createRMSite) | **POST** /gs-sites | Create the Records Management (RM) site
*.GssitesApi* | [**deleteRMSite**](docs/GssitesApi.md#deleteRMSite) | **DELETE** /gs-sites/rm | Delete the Records Management (RM) site
*.GssitesApi* | [**getRMSite**](docs/GssitesApi.md#getRMSite) | **GET** /gs-sites/rm | Get the Records Management (RM) site
*.GssitesApi* | [**updateRMSite**](docs/GssitesApi.md#updateRMSite) | **PUT** /gs-sites/rm | Update the Records Management (RM) site
*.RecordCategoriesApi* | [**createRecordCategoryChild**](docs/RecordCategoriesApi.md#createRecordCategoryChild) | **POST** /record-categories/{recordCategoryId}/children | Create a record category or a record folder
*.RecordCategoriesApi* | [**deleteRecordCategory**](docs/RecordCategoriesApi.md#deleteRecordCategory) | **DELETE** /record-categories/{recordCategoryId} | Delete a record category
*.RecordCategoriesApi* | [**getRecordCategory**](docs/RecordCategoriesApi.md#getRecordCategory) | **GET** /record-categories/{recordCategoryId} | Get a record category
*.RecordCategoriesApi* | [**listRecordCategoryChildren**](docs/RecordCategoriesApi.md#listRecordCategoryChildren) | **GET** /record-categories/{recordCategoryId}/children | List record category's children
*.RecordCategoriesApi* | [**updateRecordCategory**](docs/RecordCategoriesApi.md#updateRecordCategory) | **PUT** /record-categories/{recordCategoryId} | Update a record category
*.RecordFoldersApi* | [**createRecordFolderChild**](docs/RecordFoldersApi.md#createRecordFolderChild) | **POST** /record-folders/{recordFolderId}/records | Create a record
*.RecordFoldersApi* | [**deleteRecordFolder**](docs/RecordFoldersApi.md#deleteRecordFolder) | **DELETE** /record-folders/{recordFolderId} | Delete a record folder
*.RecordFoldersApi* | [**getRecordFolder**](docs/RecordFoldersApi.md#getRecordFolder) | **GET** /record-folders/{recordFolderId} | Get a record folder
*.RecordFoldersApi* | [**listRecordFolderChildren**](docs/RecordFoldersApi.md#listRecordFolderChildren) | **GET** /record-folders/{recordFolderId}/records | List records
*.RecordFoldersApi* | [**updateRecordFolder**](docs/RecordFoldersApi.md#updateRecordFolder) | **PUT** /record-folders/{recordFolderId} | Update a record folder
*.RecordsApi* | [**completeRecord**](docs/RecordsApi.md#completeRecord) | **POST** /records/{recordId}/complete | Complete a record
*.RecordsApi* | [**deleteRecord**](docs/RecordsApi.md#deleteRecord) | **DELETE** /records/{recordId} | Delete a record
*.RecordsApi* | [**fileRecord**](docs/RecordsApi.md#fileRecord) | **POST** /records/{recordId}/file | File a record
*.RecordsApi* | [**getRecord**](docs/RecordsApi.md#getRecord) | **GET** /records/{recordId} | Get a record
*.RecordsApi* | [**getRecordContent**](docs/RecordsApi.md#getRecordContent) | **GET** /records/{recordId}/content | Get record content
*.RecordsApi* | [**updateRecord**](docs/RecordsApi.md#updateRecord) | **PUT** /records/{recordId} | Update record
*.TransferContainersApi* | [**getTransferContainer**](docs/TransferContainersApi.md#getTransferContainer) | **GET** /transfer-containers/{transferContainerId} | Get a transfer container
*.TransferContainersApi* | [**listTransfers**](docs/TransferContainersApi.md#listTransfers) | **GET** /transfer-containers/{transferContainerId}/transfers | List transfer container's children
*.TransferContainersApi* | [**updateTransferContainer**](docs/TransferContainersApi.md#updateTransferContainer) | **PUT** /transfer-containers/{transferContainerId} | Update transfer container
*.TransfersApi* | [**getTransfer**](docs/TransfersApi.md#getTransfer) | **GET** /transfers/{transferId} | Get a transfer
*.TransfersApi* | [**listTransfersChildren**](docs/TransfersApi.md#listTransfersChildren) | **GET** /transfers/{transferId}/children | List transfer's children
*.UnfiledContainersApi* | [**createUnfiledContainerChildren**](docs/UnfiledContainersApi.md#createUnfiledContainerChildren) | **POST** /unfiled-containers/{unfiledContainerId}/children | Create a record or an unfiled record folder
*.UnfiledContainersApi* | [**getUnfiledContainer**](docs/UnfiledContainersApi.md#getUnfiledContainer) | **GET** /unfiled-containers/{unfiledContainerId} | Get the unfiled records container
*.UnfiledContainersApi* | [**listUnfiledContainerChildren**](docs/UnfiledContainersApi.md#listUnfiledContainerChildren) | **GET** /unfiled-containers/{unfiledContainerId}/children | List unfiled record container's children
*.UnfiledContainersApi* | [**updateUnfiledContainer**](docs/UnfiledContainersApi.md#updateUnfiledContainer) | **PUT** /unfiled-containers/{unfiledContainerId} | Update an unfiled record container
*.UnfiledRecordFoldersApi* | [**createUnfiledRecordFolderChildren**](docs/UnfiledRecordFoldersApi.md#createUnfiledRecordFolderChildren) | **POST** /unfiled-record-folders/{unfiledRecordFolderId}/children | Create a record or an unfiled record folder
*.UnfiledRecordFoldersApi* | [**deleteUnfiledRecordFolder**](docs/UnfiledRecordFoldersApi.md#deleteUnfiledRecordFolder) | **DELETE** /unfiled-record-folders/{unfiledRecordFolderId} | Delete an unfiled record folder. Deleted file plan components cannot be recovered, they are deleted permanently.
*.UnfiledRecordFoldersApi* | [**getUnfiledRecordFolder**](docs/UnfiledRecordFoldersApi.md#getUnfiledRecordFolder) | **GET** /unfiled-record-folders/{unfiledRecordFolderId} | Get the unfiled record folder
*.UnfiledRecordFoldersApi* | [**listUnfiledRecordFolderChildren**](docs/UnfiledRecordFoldersApi.md#listUnfiledRecordFolderChildren) | **GET** /unfiled-record-folders/{unfiledRecordFolderId}/children | List unfiled record folder's children
*.UnfiledRecordFoldersApi* | [**updateUnfiledRecordFolder**](docs/UnfiledRecordFoldersApi.md#updateUnfiledRecordFolder) | **PUT** /unfiled-record-folders/{unfiledRecordFolderId} | Update an unfiled record folder


## Documentation for Models

 - [ChildAssociationInfo](docs/ChildAssociationInfo.md)
 - [ContentInfo](docs/ContentInfo.md)
 - [ErrorError](docs/ErrorError.md)
 - [FilePlan](docs/FilePlan.md)
 - [FilePlanBodyUpdate](docs/FilePlanBodyUpdate.md)
 - [FilePlanComponentBodyUpdate](docs/FilePlanComponentBodyUpdate.md)
 - [FilePlanEntry](docs/FilePlanEntry.md)
 - [ModelError](docs/ModelError.md)
 - [Pagination](docs/Pagination.md)
 - [PathElement](docs/PathElement.md)
 - [PathInfo](docs/PathInfo.md)
 - [RMNodeBodyCreate](docs/RMNodeBodyCreate.md)
 - [RMNodeBodyCreateWithRelativePath](docs/RMNodeBodyCreateWithRelativePath.md)
 - [RMSite](docs/RMSite.md)
 - [RMSiteBodyCreate](docs/RMSiteBodyCreate.md)
 - [RMSiteBodyUpdate](docs/RMSiteBodyUpdate.md)
 - [RMSiteEntry](docs/RMSiteEntry.md)
 - [Record](docs/Record.md)
 - [RecordCategory](docs/RecordCategory.md)
 - [RecordCategoryChild](docs/RecordCategoryChild.md)
 - [RecordCategoryChildEntry](docs/RecordCategoryChildEntry.md)
 - [RecordCategoryChildPaging](docs/RecordCategoryChildPaging.md)
 - [RecordCategoryChildPagingList](docs/RecordCategoryChildPagingList.md)
 - [RecordCategoryEntry](docs/RecordCategoryEntry.md)
 - [RecordCategoryPaging](docs/RecordCategoryPaging.md)
 - [RecordCategoryPagingList](docs/RecordCategoryPagingList.md)
 - [RecordEntry](docs/RecordEntry.md)
 - [RecordFolder](docs/RecordFolder.md)
 - [RecordFolderAssociationPaging](docs/RecordFolderAssociationPaging.md)
 - [RecordFolderAssociationPagingList](docs/RecordFolderAssociationPagingList.md)
 - [RecordFolderChildAssociationEntry](docs/RecordFolderChildAssociationEntry.md)
 - [RecordFolderEntry](docs/RecordFolderEntry.md)
 - [RequestBodyFile](docs/RequestBodyFile.md)
 - [RootCategoryBodyCreate](docs/RootCategoryBodyCreate.md)
 - [Transfer](docs/Transfer.md)
 - [TransferAssociationPaging](docs/TransferAssociationPaging.md)
 - [TransferAssociationPagingList](docs/TransferAssociationPagingList.md)
 - [TransferChild](docs/TransferChild.md)
 - [TransferChildAssociationEntry](docs/TransferChildAssociationEntry.md)
 - [TransferContainer](docs/TransferContainer.md)
 - [TransferContainerAssociationPaging](docs/TransferContainerAssociationPaging.md)
 - [TransferContainerAssociationPagingList](docs/TransferContainerAssociationPagingList.md)
 - [TransferContainerBodyUpdate](docs/TransferContainerBodyUpdate.md)
 - [TransferContainerChild](docs/TransferContainerChild.md)
 - [TransferContainerChildAssociationEntry](docs/TransferContainerChildAssociationEntry.md)
 - [TransferContainerEntry](docs/TransferContainerEntry.md)
 - [TransferEntry](docs/TransferEntry.md)
 - [UnfiledContainer](docs/UnfiledContainer.md)
 - [UnfiledContainerAssociationPaging](docs/UnfiledContainerAssociationPaging.md)
 - [UnfiledContainerAssociationPagingList](docs/UnfiledContainerAssociationPagingList.md)
 - [UnfiledContainerChild](docs/UnfiledContainerChild.md)
 - [UnfiledContainerChildAssociationEntry](docs/UnfiledContainerChildAssociationEntry.md)
 - [UnfiledContainerEntry](docs/UnfiledContainerEntry.md)
 - [UnfiledRecordContainerBodyUpdate](docs/UnfiledRecordContainerBodyUpdate.md)
 - [UnfiledRecordFolder](docs/UnfiledRecordFolder.md)
 - [UnfiledRecordFolderAssociationPaging](docs/UnfiledRecordFolderAssociationPaging.md)
 - [UnfiledRecordFolderAssociationPagingList](docs/UnfiledRecordFolderAssociationPagingList.md)
 - [UnfiledRecordFolderBodyUpdate](docs/UnfiledRecordFolderBodyUpdate.md)
 - [UnfiledRecordFolderChild](docs/UnfiledRecordFolderChild.md)
 - [UnfiledRecordFolderChildAssociationEntry](docs/UnfiledRecordFolderChildAssociationEntry.md)
 - [UnfiledRecordFolderEntry](docs/UnfiledRecordFolderEntry.md)
 - [UserInfo](docs/UserInfo.md)
 - [RecordFolderChildAssociation](docs/RecordFolderChildAssociation.md)
 - [TransferChildAssociation](docs/TransferChildAssociation.md)
 - [TransferContainerChildAssociation](docs/TransferContainerChildAssociation.md)
 - [UnfiledContainerChildAssociation](docs/UnfiledContainerChildAssociation.md)
 - [UnfiledRecordFolderChildAssociation](docs/UnfiledRecordFolderChildAssociation.md)

