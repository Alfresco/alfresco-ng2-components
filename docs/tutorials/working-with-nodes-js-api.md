# Working with Nodes using the JS API

In this tutorial you will learn how to use the [`AlfrescoCoreRestApi`](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-core-rest-api) in some practical examples developed to show how to interact with your instance of Alfresco Content Services, without consuming directly the REST endpoints. With this approach the `AlfrescoCoreRestApi` is used as an abstraction layer, defining one of the core services of the [`alfresco-api-js`](https://github.com/Alfresco/alfresco-js-api) library.

## Preparing the development environment

To focus the description on the `AlfrescoCoreRestApi`, in this tutorial we are going to develop using the [Alfresco JavaScript application](./creating-javascript-app-using-alfresco-js-api.html). If you don't have it already available into your development environment, check the *how-to* description into the [dedicated tutorial](./creating-javascript-app-using-alfresco-js-api.html).

## About the `AlfrescoCoreRestApi`

Before any development, let's introduce the `AlfrescoCoreRestApi` class. For further details about its implementation, check the documentation [here](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-core-rest-api). As you can see, the available methods are in "*1 to 1*" relation with the REST endpoints and services of Alfresco Content Services. This makes the development easier and clean, and enables the developer to a full access to the Alfresco Content Services REST API. 

Starting from the most basic [Alfresco JavaScript application](./creating-javascript-app-using-alfresco-js-api.html), the `AlfrescoCoreRestApi` class can be accessed with the following command.

    this.alfrescoJsApi.core

## Retrieving the children of a node

As a first example of usage of the `AlfrescoCoreRestApi` class, let's retrieve the children of the root node, identified by the `-root-` alias. As described in the official documentation the method `getNodeChildren` should be used as described below. For this purpose edit the `index.html` file and as follow and replace the JavaScript source code for the login call.

	...
    this.alfrescoJsApi.login('admin', 'admin').then(function (data) {

	    this.alfrescoJsApi.core.childAssociationsApi.getNodeChildren('-root-', {}).then(

	        function (data) {

	            var divElement = document.getElementById("result");

	            for (var i = 0; i < data.list.entries.length; i++) {

	                console.log(data.list.entries[i]);

	                var textElement = document.createTextNode(
	                    data.list.entries[i].entry.name +
	                    " (" +
	                    data.list.entries[i].entry.id +
	                    ")"
	                );
	                var paragraphElement = document.createElement("p");
	                paragraphElement.appendChild(textElement);
	                divElement.appendChild(paragraphElement);
	            }
	        },
	        function (error) { console.error(error); });

	    }, function (error) {
	        console.error(error);
	    });
	...

Then replace the HTML body as follows.

	<body>
	   <div id='result'></div>
    </body>

Once done, save and deploy the source code as described [here](./creating-javascript-app-using-alfresco-js-api.html), executing the following command from the `my-js-app` folder into a terminal.

    docker cp ../my-js-app <CONTAINER_ID>:/usr/local/tomcat/webapps

Opening the browser to the URL `http://localhost:8082/my-js-app/` you will see something similar to the following screenshot.

![alfrescocorerestapi_children](../docassets/images/alfrescocorerestapi_children.png)

As an exercise, you can try to implement the navigation between the nodes. To reach the goal, change the source code of the page to accept a `nodeId` parameter and use it as first parameter of the `getNodeChildren` method. Then change the dynamic HTML to create a link element (`a` tag) on the name of the child. The link will point to the same page but with `nodeId` with value `data.list.entries[i].entry.id`.

## Retrieving the node data

Now that you can show the children of a node (and maybe navigate into the repository structure, if you completed the bonus exercise) let's see here how to retrieve and show the data related to a node.

To make the example more complete, we split the final result in two parts: the first about retrieving (and showing) the data about the current node and the second about retrieving (and showing) the data about the children nodes.

In both cases, all is possible thank to the [`getNode`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/NodesApi.md#getNode) method, getting information for one node identified starting from a node id.

### Retrieving and showing data about the current node

Starting from the JavaScript application developed in the previous section, let's modify the source code for `function (data)` as follows.

	...
    function (data) {

        var divElement = document.getElementById('nodeInfo');
        this.alfrescoJsApi.core.nodesApi.getNode(data.list.entries[0].entry.parentId, {}).then(function(nodeData) {

                console.log(nodeData);

                var textElement = document.createTextNode(
                    'This node is named "' +
                    nodeData.entry.name
                    + '" and its children are:'
                );
                var paragraphElement = document.createElement('p');
                paragraphElement.appendChild(textElement);
                divElement.appendChild(paragraphElement);

        },
        function (error) { console.error(error); });

		...

This portion of source code is going to retrieve the node data related to the parent of the first node of the results. Of course, if the node does not have children, its execution might throw an exception. As an exercise, change the source code to correctly manage this use case.

Once retrieved, the name of the current node is displayed in a text similar to: `This node is named "..." and its children are:`. To put the text in the right place, change the HTML body as follows.

        <body>
            <div id='nodeInfo'></div>
            <div id='result'></div>
        </body>

### Retrieving and showing data about the children nodes

Once done, let's append the following JavaScript source code to the `function (data)`.

	...
    var divElement = document.getElementById('result');
    for (var i = 0; i < data.list.entries.length; i++) {

        this.alfrescoJsApi.core.nodesApi.getNode(data.list.entries[i].entry.id, {}).then(function(nodeData) {

            console.log(nodeData);

            var textElement = document.createTextNode(
                nodeData.entry.name +
                ' - ' + 
                nodeData.entry.aspectNames
            );
            var paragraphElement = document.createElement('p');
            paragraphElement.appendChild(textElement);
            divElement.appendChild(paragraphElement);

        }, function(error) { console.error(error); });

    } 

As you can see, in this piece of code, the information of each node are retrieved and presented in form of: `<node name> - <list of aspect names>`.

### Showing the results

Once done, save and deploy again the source code executing the following command from the `my-js-app` folder into a terminal.

    docker cp ../my-js-app <CONTAINER_ID>:/usr/local/tomcat/webapps

Opening the browser to the URL `http://localhost:8082/my-js-app/` you will see something similar to the following screenshot.

![alfrescocorerestapi_nodesdata](../docassets/images/alfrescocorerestapi_nodesdata.png)

