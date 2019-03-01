---
Title: Content Metadata Card component
Added: v2.1.0
Status: Active
Last reviewed: 2019-03-15
---

# [Content Metadata Card component](../../../lib/content-services/content-metadata/components/content-metadata-card/content-metadata-card.component.ts "Defined in content-metadata-card.component.ts")

Displays and edits metadata related to a node.

![Content metadata screenshot](../../docassets/images/ContentMetadata.png)

## Basic Usage

```html
<adf-content-metadata-card
    [displayEmpty]="false"
    [toggleDisplayProperties]="displayDefaultProperties"
    [preset]="'*'"
    [node]="node">
</adf-content-metadata-card>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| displayEmpty | `boolean` | false | (optional) This flag displays/hides empty metadata fields. |
| multi | `boolean` | false | (optional) This flag allows the component to display more than one accordion at a time. |
| node | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/development/src/api/content-rest-api/docs/Node.md) |  | (required) The node entity to fetch metadata about |
| preset | `string` |  | (required) Name of the metadata preset, which defines aspects and their properties. |
| readOnly | `boolean` | false | (optional) This flag sets the metadata in read only mode preventing changes. |
| displayDefaultProperties | `boolean` |  | (optional) This flag displays/hides the metadata properties. |

## Details

The component shows metadata related to a given node. It uses the
[Card View component](../../core/components/card-view.component.md) to render the properties of metadata aspects.
The different aspects and their properties to be shown can be configured as application config
presets (see below). By default the component only shows the basic properties of the node.
The user can click on the pencil icon at the bottom of the component to edit the metadata
properties.

### Application config presets

You can define different presets for the metadata component or override the default presets in
the `app.config.json` file. If nothing else is set, the **default** preset is "\*",
which will use the "indifferent" config described below. 

You can define as many extra presets as you need for your components.

The example configurations below show the options in detail.

#### Indifferent config

The default configuration behaves like the following:

```json
...
"content-metadata": {
    "presets": {
        "default": "*"
    }
}
...
```

This will display a default set of basic node properties: **name**, **title**,
**creator**, **created date**, **size**, **modifier**, **modified date**,
**mime type**, **author**, **description**.

#### Aspect oriented config

With this type of configuration you can "whitelist" aspects and properties for a preset, but everything will be grouped by aspects and there is no further way to group properties. Use a
[layout oriented configuration](#layout-oriented-config) if you want to define your own
custom groups.

The default configuration shows every aspect but you can restrict it to just a small selection
of aspects by "whitelisting" the ones you want in the `default` section. In the example below,
just the `exif:exif` and `custom:aspect` aspects are whitelisted:

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

You can further restrict the whitelist to specific properties of one or more aspects by using
an array of property names in place of the "\*" filter:

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

A final example shows the same process applied to a custom preset called "kitten-images":

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

You can also go beyond the aspect oriented configuration if you need to configure the groups and properties in a more detailed way. With this type of configuration any property of any aspect/type
can be "cherry picked" and grouped into an accordion drawer, along with a translatable title
defined in the preset configuration.

#### Basic elements

The following config will produce one accordion group named "TRANSLATABLE_TITLE_FOR_GROUP_1",
with all the properties from `custom:aspect` followed by the two properties (`exif:pixelXDimension`
and `exif:pixelYDimension`) from the `exif:exif` aspect and then one property (`custom:myPropertyName`) from `custom:type`:

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

A more complex config is shown in the example below:

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

The result of this config would be two accordion groups with the following properties:

| GROUP-TITLE1-TRANSLATION-KEY |
| ---------------------------- |
| exif:param1 |
| exif:param2 |
| ... |
| exif:paramN |
| kitten:custom1 |
| kitten:custom3 |
| owner:name |
| kitten:name |
| kitten:color |

| GROUP-TITLE2-TRANSLATION-KEY |
| ---------------------------- |
| kitten:favourite-food |
| kitten:recommended-food |

## What happens when there is a whitelisted aspect in the config but the given node doesn't relate to that aspect

Nothing - since this aspect is not related to the node, it will simply be ignored and not
displayed. The aspects to be displayed are calculated as an intersection of the preset's aspects and the aspects related to the node.
