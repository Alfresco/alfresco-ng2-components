---
Level: Intermediate
---
# Working with a Data Table

In this tutorial you will learn how to populate a [`DataTable` component](https://alfresco.github.io/adf-component-catalog/components/DataTableComponent.html), with custom data coming from a generic back-end service or third party API. As an example we are going to use the data coming from one of the available services on Alfresco Content Services, but nothing  changes if you'd want to use an Alfresco Process Services endpoint or a third party API.

## Prerequisites and data source

Before diving deep into the technical description of the [`DataTable` component](https://alfresco.github.io/adf-component-catalog/components/DataTableComponent.html), let's start describing the development environment and its prerequisites.

In this tutorial we will start from an existing ADF application, developed to use (at least) Alfresco Content Services as service layer. To be faster and concentrated on the discussion about the Data Table, we suggest to use the [Alfresco Example Content Application](https://github.com/Alfresco/alfresco-content-app). The Alfresco Example Content Application is well documented [here](https://alfresco.github.io/alfresco-content-app/#/), and you can choose to [build it from the source code](https://alfresco.github.io/alfresco-content-app/#/build) or [run it in a Docker container](https://alfresco.github.io/alfresco-content-app/#/docker). If you'd prefer to create a brand new ADF application from scratch, nothing will really change and you should be able to follow the tutorial with success.

During the description of the current tutorial, the endpoint used to populate the Data Table component is the [`/people` service](https://api-explorer.alfresco.com/api-explorer/#!/people/listPeople) that lists all the users available into an Alfresco Content Services instance. The `/people` service is suitable for the purpose of this tutorial because it is available by default into the Alfresco Content Services REST API. As follow up, you could choose to use an Alfresco Process Services endpoint or a third party API. Below is shown the result of the [`/people` service](https://api-explorer.alfresco.com/api-explorer/#!/people/listPeople), as an example.

    {
      "list": {
        "pagination": {
          "count": 46,
          "hasMoreItems": false,
          "totalItems": 46,
          "skipCount": 0,
          "maxItems": 100
        },
        "entries": [
          {
            "entry": {
              "firstName": "Jay",
              "lastName": "Veeru",
              "emailNotificationsEnabled": true,
              "company": {},
              "id": "JayVeeru2",
              "enabled": true,
              "email": "JayVeeru@test.con"
            },
            ...
          }
        ]
      }
    }
  
## Adding a page using the `DataTable` component

Starting from the ADF application, let's add a new component, developing a new page and containing a basic `DataTable` component. Top add a new page to the application, open a terminal and move into the root of the application, then run the following command.

    ng g c mydatatable -m app.module

Into the `src/app/mydatatable` folder you should find the four files with extension `html`, `scss`, `spec.ts` and `ts`, developing the new page.

To add the new page to the routing of the we application, edit the `Routes` instance into the `app.routes,ts` if you are using the Alfresco Example Content Application or directly into the `app.module.ts` if you built the application using the standard Angular-CLI.

To define the new routing, check the following import is included in the file.

    import {MydatatableComponent} from './mydatatable/mydatatable.component';

Then add a new item to the `Routes` instance, as described below.

    export const APP_ROUTES: Routes = [
	    ...,
	    {
	    	path: 'mydatatable',
    	    component: MydatatableComponent
    	},
    	...
    ];

Since then, the page will be available at the URL `http://localhost:3000/#/mydatatable`, if you start from the Alfresco Example Content Application.

Now that the new page is correctly developed, let's add the `DataTable` component into it. To complete the task, open the `src/app/mydatatable/mydatatable.component.ts` file and add the following import.

	import { ObjectDataTableAdapter } from '@alfresco/adf-core';

In a Data Table an instance of `ObjectDataTableAdapter` requires to be configured as data source. Below the source code to add to the `mydatatable` component, just before the constructor.

	  data = new ObjectDataTableAdapter(
	    [
	      {
	        id: 1, 
	        firstName: 'Name #1', 
	        lastName: 'Lastname #1', 
	        icon: 'material-icons://folder_open'
	      },
	      {
	        id: 2, 
	        firstName: 'Name #2', 
	        lastName: 'Lastname #2', 
	        icon: 'material-icons://accessibility'
	      },
	      {
	        id: 3, 
	        firstName: 'Name #3', 
	        lastName: 'Lastname #3', 
	        icon: 'material-icons://alarm'
	      }
	    ]
	  );

Next, we need to pull in the `<adf-datatable>` component in the template and bind the data property and configure the columns. To develop it, open `src/app/mydatatable/mydatatable.component.html` file and replace the content with the following.

	<adf-datatable 
	  [data]="data">
	  <data-columns>
	    <data-column 
	      key="icon" 
	      type="image" 
          [sortable]="false">
        </data-column>
	    <data-column 
	      key="firstName" 
	      title="First Name">
	    </data-column>
	    <data-column 
	      key="lastName" 
	      title="Last Name" 
	      class="full-width name-column">
	    </data-column>
	  </data-columns>
	</adf-datatable>

Save the file and check the browser. You should now see a data table showing three rows, each row having three columns, as shown in the following picture.

![data_table_static](../docassets/images/data_table_static.png)

## Data Table configuration

The Data Table can be configured in many different ways. Because of this, the Data Table is the foundation for all list components across all of ADF. Both the Document List, Task List, Process List are extensions on top of the Data Table, and even smaller components like Attachment List, Comment List, Version List and Content Selector are all based on the Data Table.

Looking into the [documentation](https://alfresco.github.io/adf-component-catalog/components/DataTableComponent.html), we can see that it has a lot of different options. Ranging from single/multi selection, click events, context menus, actions and keyboard navigation.

Let's do a simple example and add a click event, so once a row is clicked it will display an alert. Open `src/app/mydatatable/mydatatable.component.html` and add the following:
 
	<adf-datatable 
	  (rowClick)="onRowClick($event)"
	  [data]="data">
	  .......

Next open `src/app/mydatatable/mydatatable.component.ts` and create the method `onRowClick` as described below.

	  onRowClick(event: any) {
	    alert('We just clicked row id: ' + event.value.obj.id);
	  }

Notice that we're passing in the `event` variable the entire row. This means that our method will have access to all the data in the method, if required. Once you click a row you should now see a nice alert.

![data_table_rowClick](../docassets/images/data_table_rowClick.png)

## Data Table columns

Let's dig a bit deeper into different options for rendering columns within the Data Table. The documentation for the [Data Column component](https://alfresco.github.io/adf-component-catalog/components/DataColumnComponent.html) is quite in-depth and has lots of examples. We highly suggest checking it out.

From the documentation we can see that the Data Column component has a few properties, the most important ones are `key`, `type`, `sortable`, `title` and  `class`. 

* `key` is the name of the property in the `ObjectDataTableAdapter` object. 
* `type` indicates how to render. By default it will take the `text` from the matching key inthe data, but other modes can be configured:
	 * `image` will take a URI for a Material Icon or a URL for any image and display it.
	 * `date` will format a date/datetime string. Use the `format` property to override and define a custom time format.
	 * `fileSize` will convert into kb/mb/gb as needed.
	 * `location` assumes the value is a nodeId for ACS and will display the path.
* `sortable` set to true or false to configure if the column can be sorted.
* `title` sets the column title in the table header.
* `class` allows setting CSS classes on the column. Use `full-width` for the column to take as much width as it can while still leaving room for the remaining columns.

## Content projection

Sometimes it's not enough to simply render a text string or an image. For this, the Data Column supports Content projection to allow you to take control over what is being rendered in the column.

Let's change the example above and introduce a status field. In the data we define a new status field that can have the values `green` or `red`. Then we will use content projection to render the column with the color instead of the text.

Open `src/app/mydatatable/mydatatable.component.ts` and change the data to this.

	  data = new ObjectDataTableAdapter(
	    [
	      {
	        id: 1, 
	        name: 'Name #1', 
	        createdBy: 'User #1', 
	        status: 'green', 
	        icon: 'material-icons://folder_open'
	      },
	      {
	        id: 2, 
	        name: 'Name #2', 
	        createdBy: 'User #2', 
	        status: 'red', 
	        icon: 'material-icons://accessibility'
	      },
	      {
	        id: 3, 
	        name: 'Name #3', 
	        createdBy: 'User #3', 
	        status: 'green', 
	        icon: 'material-icons://alarm'
	      }
	    ]
	  );

Next we need to define a new column in the template and use `<ng-template/>` to project our own content into the column. Open the template and add what follows.

      <data-column key="status" title="Status">
        <ng-template let-entry="$implicit">
          <span *ngIf="entry.data.getValue(entry.row, entry.col) == 'red'" style="background-color: red; width: 20px; height: 20px"></span>
          <span *ngIf="entry.data.getValue(entry.row, entry.col) == 'green'" style="background-color: green; width: 20px; height: 20px"></span>
        </ng-template>
      </data-column>

While this might not be best practises for how you set the background, it does illustrate how to take control over the rendition of the content within a table cell. In the picture below you can see how the user experience looks like.

![data_table_contentProjection](../docassets/images/data_table_contentProjection.png)

## Playing with the data source

Now that you know how to control you Data Table, let's add another piece, changing the data source to integrate an external API (in this example the [`/people` service](https://api-explorer.alfresco.com/api-explorer/#!/people/listPeople) that lists all the users available into an Alfresco Content Services instance).

As explained above, the solution is to populate the `ObjectDataTableAdapter` object, implementing the data source of the `DataTable` component. To reach the goal, open the `src/app/mydatatable/mydatatable.component.ts` file and replace the content with the following.

    import { Component, OnInit } from '@angular/core';
    import { AlfrescoApiService } from '@alfresco/adf-core';
    import { ObjectDataTableAdapter, ObjectDataRow } from '@alfresco/adf-core';
    
    @Component({
      selector: 'app-mydatatable',
      templateUrl: './mydatatable.component.html',
      styleUrls: ['./mydatatable.component.scss']
    })
    export class MydatatableComponent implements OnInit {
    
      data = new ObjectDataTableAdapter([],[]);
    
      constructor(private apiService: AlfrescoApiService) {
    
        this.apiService.getInstance().webScript.executeWebScript(
          'GET',
          'people',
          [],
          null,
          'api/-default-/public/alfresco/versions/1',
          null
        ).then(
          (response: any) => {
            let results = [];
            for (var entry of response.list.entries) {
              results.push({
                id: entry.entry.id,
                firstName: entry.entry.firstName,
                lastName: entry.entry.lastName,
                status: 'green',
                icon: 'material-icons://accessibility'
              });
            }
            this.data.setRows(results.map(item => { return new ObjectDataRow(item); }));
          }
        );
    
      }

      onRowClick(event: any) {
        alert('We just clicked row id: ' + event.value.obj.status);
      }
    
    }

As you can see, the major changes are in the constructor where the external API is invoked and the `this.data` object id dynamically populate with the response of the services (supposed to be in JSON but it could be in every format).

Saving the file, the following picture shows the result that the user can see in his/her browser.
 
![data_table_dataSource](../docassets/images/data_table_dataSource.png)

## Adding an action

One of the most common things you could do with a Data Table, is adding an action to each row (according to some conditions). To develop one (or more) custom action, the [`DataTable` component](https://alfresco.github.io/adf-component-catalog/components/DataTableComponent.html) offers you a straightforward solution.

Below you can find the changes to develop into the `src/app/mydatatable/mydatatable.component.html` file.

    <adf-datatable
        ...
        [actions]="true"
        (showRowActionsMenu)="onShowRowActionsMenu($event)"
        (executeRowAction)="onExecuteRowAction($event)">
    </adf-datatable>

And the `src/app/mydatatable/mydatatable.component.ts` file. 

    import { DataCellEvent, DataRowActionEvent } from '@alfresco/adf-core';
    
    onShowRowActionsMenu(event: DataCellEvent) {
        event.value.actions = [
            {
                title: 'Greetings'
                // Put here your custom metadata.
            }
        ];
    }
    
    onExecuteRowAction(event: DataRowActionEvent) {
        console.log(event.value.row);
        alert('${event.value.action.title} ${event.value.row.obj.firstName}');
    }

Once saved the two files, the following picture shows how the user experience looks like when pressing the three dots column and selecting `Greetings` for the first row.

![data_table_dataSource](../docassets/images/data_table_action.png)

You can note that in the browser's console, a log describing the row object is shown for debugging purpose.

To make the example more real, let's add the interaction with an external service. In this case we are going to use the [`/people/{personId}` service](https://api-explorer.alfresco.com/api-explorer/#!/people/getPerson) to show the complete profile data, retrieved in a JSON response. To make it simple, we will extract the data in a string, shown to the user through the usual `alert` command. In your final application you might want to use a more sexy modal window, maybe the standard [Material Dialog](https://material.angular.io/components/dialog/overview).

To develop the enhancement, edit the `src/app/mydatatable/mydatatable.component.html` file, replacing the  `onExecuteRowAction` method as follow.

    onExecuteRowAction(event: DataRowActionEvent) {

        if (event.value.action.title = "Greetings") {

            this.apiService.getInstance().webScript.executeWebScript(
              'GET',
              'people/' + event['value']['row']['obj']['id'],
              [],
              null,
              'api/-default-/public/alfresco/versions/1',
              null
            ).then(
              (response: any) => {
                  alert(JSON.stringify(response.entry));
              }
            );

        }
    }

Once saved, the application will be updated automatically and your browser should present something similar to the following result, when the `Greetings` action is selected for each row.

![data_table_dataSource](../docassets/images/data_table_action2.png)

