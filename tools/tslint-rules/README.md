# adf-tslint-rules


A set of [TSLint](https://github.com/palantir/tslint) rules used on [ADF](https://github.com/Alfresco/alfresco-ng2-components) project.

## Installation

```sh
 npm install adf-tslint-rules
```

## Configuration

```javascript
{
    "rulesDirectory": [
        "node_modules/codelyzer",
        "node_modules/adf-tslint-rules"
    ],
    "rules": {
        "adf-file-name": true,
        "adf-class-name": true,
        "adf-no-on-prefix-output-name": true
    }
}
```

Supported Rules
-----

Rule Name   | Description |
---------- | ------------ | 
`adf-file-name` | The name of the File should not start with ADF Alfresco or Activiti prefix | 
`adf-class-name` | The name of the class should not start with ADF Alfresco or Activiti prefix |
`adf-no-on-prefix-output-name` | Angular allows for an alternative syntax on-*. If the event itself was prefixed with on this would result in an on-onEvent binding expression |
|
