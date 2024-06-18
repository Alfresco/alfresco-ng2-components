# Hold

## Basic usage

```ts
export interface Hold {
    id: string;
    name: string;
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
**description** | **string** |  | [optional] [Additional information for a hold]
