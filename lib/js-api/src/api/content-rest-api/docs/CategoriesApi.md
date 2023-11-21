# CategoriesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                              | HTTP request                                           | Description                                 |
|-----------------------------------------------------|--------------------------------------------------------|---------------------------------------------|
| [getSubcategories](#getSubcategories)               | **GET** /categories/{categoryId}/subcategories         | List of subcategories within category       |
| [getCategory](#getCategory)                         | **GET** /categories/{categoryId}                       | Get a category                              |
| [getCategoryLinksForNode](#getCategoryLinksForNode) | **GET** /nodes/{nodeId}/category-links                 | List of categories that node is assigned to |
| [deleteCategory](#deleteCategory)                   | **DELETE** /categories/{categoryId}                    | Deletes the category                        |
| [unlinkNodeFromCategory](#unlinkNodeFromCategory)   | **DELETE** /nodes/{nodeId}/category-links/{categoryId} | Unassign a node from category               |
| [updateCategory](#updateCategory)                   | **PUT** /categories/{categoryId}                       | Update a category                           |
| [createSubcategories](#createSubcategories)         | **POST** /categories/{categoryId}/subcategories        | Create new categories                       |
| [linkNodeToCategory](#linkNodeToCategory)           | **POST** /nodes/{nodeId}/category-links                | Assign a node to a category                 |

# Models

## CategoryPaging

**Properties**

| Name | Type                                      |
|------|-------------------------------------------|
| list | [CategoryPagingList](#CategoryPagingList) |

## CategoryPagingList

**Properties**

| Name       | Type                              |
|------------|-----------------------------------|
| pagination | [Pagination](Pagination.md)       |
| entries    | [CategoryEntry[]](#CategoryEntry) |

## CategoryEntry

**Properties**

| Name      | Type                  |
|-----------|-----------------------|
| **entry** | [Category](#Category) |

## Category

**Properties**

| Name        | Type    |
|-------------|---------|
| **id**      | string  |
| **name**    | string  |
| parentId    | string  |
| hasChildren | boolean |
| count       | number  |
| path        | string  |

## CategoryBody

**Properties**

| Name     | Type   |
|----------|--------|
| **name** | string |

## CategoryLinkBody

**Properties**

| Name           | Type   |
|----------------|--------|
| **categoryId** | string |



