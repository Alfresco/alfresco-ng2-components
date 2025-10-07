---
Title: People Component
Added: v2.0.0
Status: Active
Last reviewed: 2024-05-16
---

# People Component

Displays users involved with a specified task

![people component](../../docassets/images/activiti_people.png)

## Basic Usage

```html
<adf-people 
    [people]="YOUR_INVOLVED_PEOPLE_LIST" 
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

## Class members

### Properties

| Name     | Type                        | Default value | Description                           |
|----------|-----------------------------|---------------|---------------------------------------|
| people   | `LightUserRepresentation[]` | \[]           | The array of User objects to display. |
| readOnly | `boolean`                   | false         | Should the data be read-only?         |
| taskId   | `string`                    | ""            | The numeric ID of the task.           |

### Events

- `error`: Emitted when an error occurs.
