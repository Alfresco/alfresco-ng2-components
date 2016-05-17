# Alfresco Upload Component for Angular 2
<p>
  <a href='https://raw.githubusercontent.com/Alfresco/dev-platform-webcomponents/master/ng2-components/ng2-alfresco-upload/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='my blog' />
  </a>
</p>

## Install


```sh
npm install --save ng2-alfresco-core ng2-alfresco-upload
```


## Build from sources
Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
```

Components included:

- [Upload button](#upload-button)
- [Drag and Drop](#drag-and-drop)

### Upload button
This component, provide a buttons to upload files to alfresco.

#### Basic usage


```html
<alfresco-upload-button [showDialogUpload]="true"
                        [showUdoNotificationBar]="true"
                        [uploadFolders]="true"
                        [multipleFiles]="false"
                        [acceptedFilesType]="*">
</alfresco-upload-button>
```
#### Options

**showDialogUpload**: {boolean} optional) default true. Hide/show upload dialog.<br />
**showUdoNotificationBar**: {boolean} (optional) default true. Hide/show notification bar.<br />
**uploadFolders**: {boolean} (optional) default false. Allow/disallow upload folders (only for chrome).<br />
**multipleFiles**: {boolean} (optional) default false. Allow/disallow multiple files.<br />
**acceptedFilesType**: {string} (optional) default "*". array of allowed file extensions , example: ".jpg,.gif,.png,.svg" .<br />

### Drag and drop
This component, provide a drag and drop are to upload files to alfresco.

#### Basic usage
```html
<alfresco-upload-drag-area [showDialogUpload]="true" ></alfresco-upload-drag-area>
```

#### Options

**showDialogUpload**: {boolean} optional) default true. Hide/show upload dialog.<br />

## Running unit tests

```sh
npm test
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools 
before performing unit testing. 

## Code coverage

```sh
npm run coverage
```
