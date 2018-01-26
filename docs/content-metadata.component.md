# Content Metadata Card component

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->
<!-- toc -->
<!-- tocstop -->
<!-- markdown-toc end -->

Allows a user to display and edit metadata related to a node.

<img src="docassets/images/ContentMetadata.png" width="325">

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| node | MinimalNodeEntryEntity | - | (**required**) The node entity to fetch metadata about |
| displayEmpty | boolean | false | Display empty values in card view or not |
| preset | string | "*" | The metadata preset's name, which defines aspects and their properties |

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

## Application config presets

In the application config file you can define different presets for the metadata component or override the default preset. The **default** preset is "*" if not set, meaning the component will display every aspects and properties of the nodes without filtering. One can think about presets as **whitelist filters** for the content metadata component.

Beside the default preset you can define as many presets as you want, if you'd like to use different metadata components with different presets.

To understand presets better, you can have a look at on the following different example configurations.

### Mimicking the default "default" preset

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

### Whitelisting only a few aspects in the default preset

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

### Whitelisting only a few properties of a few aspects in the default preset

If you want to filter more, you can do this on property level also. For this, you have to list the names of whitelisted aspect properties in an array of strings. Again, for identifying a property, you have to use its name.

```json
...
"content-metadata": {
    "presets": {
        "default": {
            "custom:aspect": "*",
            "exif:exif": [ "exif:width", "exif:height"]
        }
    }
}
...
```

### Whitelisting only a few properties of a few aspects in a custom preset

And finally, you can create any custom aspect following the same rules.

```json
...
"content-metadata": {
    "presets": {
        "default": "*",
        "kitten-images": {
            "custom:aspect": "*",
            "exif:exif": [ "exif:width", "exif:height"]
        }
    }
}
...
```

## What happens when there is a whitelisted aspect in the config but the given node doesn't relate to that aspect

Nothing, this aspect (as it is not related to the node) will be simply ignored and not be displayed. The aspects to be displayed are calculated as an intersection of the preset's aspects and the aspects related to the node.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
<!-- seealso end -->
