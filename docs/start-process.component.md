# Start Process component

Starts a process.

![adf-start-process ](docassets/images/startProcess.png)

## Basic Usage

```html
<adf-start-process 
    appId="YOUR_APP_ID" >
</adf-start-process>
```

### Properties

| Name | Description |
| --- | --- |
| appId |  (required): Limit the list of processes which can be started to those contained in the specified app |
| name | (optional) name to assign to the current process |
| variables | Variables in input to the process [RestVariable](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api/docs/RestVariable.md)|
| values | Parameter to pass form field values in the start form if is associated |

### Events

| Name | Description |
| --- | --- |
| start | Raised when the process start |
| cancel | Raised when the process canceled |
| error | Raised when the start process fail |


### Custom data example

Here is an example of how to pass in form field values, these correspond to the start form that has been defined for the process:


```ts
const formValues:FormValues  = {
    'test_1': 'value_1',
    'test_2': 'value_2',
    'test_3': 'value_1',
    'test_4': 'dropdown_id',
    'test_5': 'dropdown_label',
    'dropdown': {'id': 'dropdown_id', 'name': 'dropdown_label'}
};
```

```html
<adf-start-process 
    [values]="formValues"
    appId="YOUR_APP_ID" >
</adf-start-process>
```

### Attach a File to the start-form of the process

After the repository is created in APS, you can see your new repository in the Alfresco Repositories list.
If the ID is set to 1, then all default values are fine. 
However, if it is set to something else, for example, ***1002*** and the name is ***alfresco***, you must set in your 'app.config.json' the property ***alfrescoRepositoryName*** alfresco-1002:

```ts
        {
            name: 'Alfresco ADF Application'
        },
        ecmHost: 'http://{hostname}{:port}/ecm',
        bpmHost: 'http://{hostname}{:port}/bpm',
        logLevel: 'silent',
        alfrescoRepositoryName : 'alfresco-1002'
```

After you need to pass the node in the input values object with the other properties:

```ts

let node: MinimalNodeEntryEntity = this.odesApiService.getNode(NODE_ID);

const formValues: FormValues  = {
    'file' : node
    'field_one': 'example text'
};
```

Note In the object above the key 'file' is the name of the attach file field in the start form of the process.
The value of the file property has to be a ***MinimalNodeEntryEntity**:

```html
<adf-start-process 
    [values]="formValues"
    appId="YOUR_APP_ID" >
</adf-start-process>
```

The result will be the start form prefilled with the file:


![Start process load file](docassets/images/start_process.png)


## Details

Displays Start Process, allowing the user to specify some details like process name and process definition, which are the most basic requirement to start a new process instance. The user have to select the process definition from a dropdown if there are more than one process definition available. If there is just one process definition available for the app, then it is auto-selected. There is a error message shown if no process definition is available.