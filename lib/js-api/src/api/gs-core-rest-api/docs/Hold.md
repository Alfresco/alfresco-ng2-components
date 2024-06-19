# Hold

## Basic usage

```ts
export interface Hold {
    name: string;
    id?: string;
    reason?: string;
    description?: string;
    selected?: string;
}
```

## Properties

Name | Type | Default value | Description
------------ | ------------- | ------------- | -------------
**id** | **string** |  | Hold id
**name** | **string** |  | Hold name
**reason** | **string** |  | Hold reason
**description** | **string** |  | Additional information for a hold
