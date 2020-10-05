---
Title: Permission Style model
Added: v2.0.0
Status: Active
Last reviewed: 2019-02-13
---

# [Permission Style model](../../../lib/content-services/src/lib/document-list/models/permissions-style.model.ts "Defined in permissions-style.model.ts")

Sets custom CSS styles for rows of a Document List according to the item's permissions.

## Class members

### Properties

| [`Property`](../../../lib/content-services/src/lib/content-metadata/interfaces/property.interface.ts) | Type        | Description                                                                   |
| ----------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| isFile                                                                                                | boolean     | Does this style apply to files?                                               |
| isFolder                                                                                              | boolean     | Does this style apply to folders?                                             |
| permission                                                                                            | Permissions | An enum value defining the permissions that this style applies to (see below) |
| css                                                                                                   | string      | The name of the CSS class to add                                              |

## Details

You can customize the style of a [Document List](../components/document-list.component.md) row based on the user's
permissions for that item. The list has a `permissionsStyle` property containing an array of
[Permission Style model](permissions-style.model.md) objects. These objects associate a particular CSS style with a permission level
and can be applied separately to files and folders by setting `isFile` and `isFolder` appropriately.

### Permissions enum

The [Allowable Operations](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/models/allowable-operations.enum.ts)
enum contains all the valid permissions for which you can apply custom styles: **DELETE**, **UPDATE**,
**CREATE**, **UPDATEPERMISSIONS**, **NOT_DELETE**, **NOT_UPDATE**, **NOT_CREATE**, **NOT_UPDATEPERMISSIONS**.

### Examples

If you want to change the style on rows where the user can create content: 

```ts
let permissionsStyle: PermissionStyleModel[] = [];

this.permissionsStyle.push(new PermissionStyleModel('document-list__create', AllowableOperationsEnum.CREATE));        
```

```html
<adf-document-list [permissionsStyle]="permissionsStyle">
</adf-document-list>
```

```css
adf-document-list adf-datatable .document-list__create {
    background: green !important;
}
```

If you want to change the style on the folders where the user doesn't have the permission to update: 

```ts
let permissionsStyle: PermissionStyleModel[] = [];

this.permissionsStyle.push(new PermissionStyleModel('document-list__disable', AllowableOperationsEnum.NOT_UPDATE, false, true));
```

```html
<adf-document-list [permissionsStyle]="permissionsStyle">
</adf-document-list>
```

```css
adf-document-list adf-datatable .document-list__disable {
    background: red !important;
}
```

## See also

-   [Document list component](../components/document-list.component.md)
