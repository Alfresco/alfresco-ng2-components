---
Added: v2.1.0
Status: Active
---
# Content Metadata Card component

Allows a user to display and edit metadata related to a node.

<img src="../docassets/images/ContentMetadata.png" width="325">

## Basic Usage

The component shows metadata related to the given node. The component uses the card view component to render the properties of metadata aspects.
The different aspects and their properties to be shown can be configured as application config preset, for details about it see the related section below. By default the component only shows the basic properties of the node. Clicking on the pencil icon at the bottom, renders the underlying card view component in edit mode enabling to edit and update the metadata properties.

```html
<adf-content-metadata-card
    [displayEmpty]="false"
    [preset]="'*'"
    [node]="node">
</adf-content-metadata-card>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| node | MinimalNodeEntryEntity | - | (**required**) The node entity to fetch metadata about |
| displayEmpty | boolean | false | Display empty values in card view or not |
| canEdit | boolean | true | Whether the edit button to be shown or not |
| multi | boolean | false | multi parameter of the underlying material expansion panel |
| preset | string | "*" | The metadata preset's name, which defines aspects and their properties |

## Details

### Application config presets

In the application config file you can define different presets for the metadata component or override the default preset. The **default** preset is "*" if not set, meaning the component will display every aspects and properties of the nodes without filtering. 

Beside the default preset you can define as many presets as you want, if you'd like to use different metadata components with different presets.

To understand presets better, you can have a look at on the following different example configurations.

### Indifferent config

If you don't have any preset configured manually in you application config, this would be equivalent as if you had the application config as defined below:

```json
...
"content-metadata": {
    "presets": {
        "default": "*"
    }
}
...
```

### Aspect oriented config

With this type of configuration you are able to "whitelist" aspects and properties for a preset, but everything will be grouped by aspects and there is no further way to group properties. If you want to group different properties in groups you define, scroll down a bit and have a look at on the layout oriented configruration.

#### Whitelisting only a few aspects in the default preset

If you want to restrict to only a few aspects (e.g.: exif, your-custom-aspect), you have to use the name of that particular aspect to be able to whitelist it. In case of exif aspect this is "exif:exif".

```json
...
"content-metadata": {
    "presets": {
        "default": {
            "custom:aspect": "*",
            "exif:exif": "*"
        }
    }
}
...
```

#### Whitelisting only a few properties of a few aspects in the default preset

If you want to filter more, you can do this on property level also. For this, you have to list the names of whitelisted aspect properties in an array of strings. Again, for identifying a property, you have to use its name.

```json
...
"content-metadata": {
    "presets": {
        "default": {
            "custom:aspect": "*",
            "exif:exif": [ "exif:pixelXDimension", "exif:pixelYDimension"]
        }
    }
}
...
```

#### Whitelisting only a few properties of a few aspects in a custom preset

And finally, you can create any custom aspect following the same rules.

```json
...
"content-metadata": {
    "presets": {
        "default": "*",
        "kitten-images": {
            "custom:aspect": "*",
            "exif:exif": [ "exif:pixelXDimension", "exif:pixelYDimension"]
        }
    }
}
...
```

### Layout oriented config

Beside the aspect oriented configuration, it is possible to configure the groups and properties in a more detailed way. With this type of configuration any property of any aspect / type can be "cherry picked"-ed and grouped into and accordion drawer, with defining a translatable title in the preset configuration.

#### Basic elements

The following config will result in one accordion group named "TRANSLATABLE_TITLE_FOR_GROUP_1", with all the properties from the custom:aspect followed by the two properties (exif:pixelXDimension, exif:pixelYDimension) from the exif:exif aspect followed by one property (custom:myPropertyName) from custom:type.

```json
...
"content-metadata": {
    "presets": {
        "kitten-images": [{
            "title": "TRANSLATABLE_TITLE_FOR_GROUP_1",
            "items": [
                { "aspect": "custom:aspect", "properties": "*" },
                { "aspect": "exif:exif", "properties": [ "exif:pixelXDimension", "exif:pixelYDimension"] },
                { "type": "custom:type", "properties": [ "custom:myPropertyName" ] },
            ] 
        }]
    }
}
...
```

#### More complex example

As a more complex config, you can study the one below:

```json
  "content-metadata": {
    "presets": {
      "kittens": [
      {
        "title": "GROUP-TITLE1-TRANSLATION-KEY",
        "items": [
          { 
            "aspect": "exif:exif",
            "properties": "*"
          },
          { 
            "aspect": "kitten:vet-records", 
            "properties": [ "kitten:custom1", "kitten:custom3" ]
          },
          { 
            "aspect": "owner:parameters", 
            "properties": [ "owner:name" ]
          },
          { 
            "type": "kitten:kitten", 
            "properties": [ "kitten:name", "kitten:color" ]
          }
        ]
      },
      {
        "title": "GROUP-TITLE2-TRANSLATION-KEY",
        "items": [
          {
            "aspect": "kitten:food", 
            "properties": [ "kitten:favourite-food", "kitten:recommended-food" ] 
          }
        ]
      }
    ]
  }
```
The end result of this config would be two accordion groups with the properties like this:

|GROUP-TITLE1-TRANSLATION-KEY|
|---|
|exif:param1|
|exif:param2|
|...|
|exif:paramN|
|kitten:custom1|
|kitten:custom3|
|owner:name|
|kitten:name|
|kitten:color|

|GROUP-TITLE2-TRANSLATION-KEY|
|---|
|kitten:favourite-food|
|kitten:recommended-food|

## What happens when there is a whitelisted aspect in the config but the given node doesn't relate to that aspect

Nothing, this aspect (as it is not related to the node) will be simply ignored and not be displayed. The aspects to be displayed are calculated as an intersection of the preset's aspects and the aspects related to the node.
