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
**id** | **string** |  | hold id
**name** | **string** |  | hold name
**reason** | **string** |  | hold reason
**description** | **string** |  | [optional] [additional information for a hold]
