---
Level: Advanced
---
# Content metadata component

In this tutorial you will learn how to work with the [`ContentMetadataComponent`](https://alfresco.github.io/adf-component-catalog/components/ContentMetadataComponent.html), used to render the standard and custom metadata of a generic content (called *node*) stored into Alfresco Content Services. With the usual approach "learning by doing", you will see here some practical examples you might find useful in your uses cases. As a starting point, we are going to use and customise the [Alfresco Content App](https://github.com/Alfresco/alfresco-content-app).

## About the `ContentMetadataComponent`

As described in the [`ContentMetadataComponent`](https://alfresco.github.io/adf-component-catalog/components/ContentMetadataComponent.html) documentation, the `adf-content-metadata-card` tag admits some useful attributes, included the `preset` one, used to point to a collection of aspects/properties to render.

In the following example you can see the `preset` value requesting to render all the available aspects/properties.

```
<adf-content-metadata-card
    [node]="..."
    [preset]="'*'">
</adf-content-metadata-card>
```

In the following example you can see the `preset` value requesting to render all the available aspects/properties related to a specific configuration, named `custom`.

```
<adf-content-metadata-card
    [node]="..."
    [preset]="'custom'">
</adf-content-metadata-card>
```

All the `preset` configurations are defined in one single configuration's file named `app.config.json`, stored into the `src` folder of the project. The `app.config.json` file contains all the configurations of the ADF application, included a section named `content-metadata`, used to store the `presets`. In the following JSON you can find an example of configuration for the `present` named `custom`.

    "content-metadata": {
        "presets": {
            "custom": [
                {
                    "title": "APP.CONTENT_METADATA.EXIF_GROUP_TITLE",
                    "items": [
                        {
                            "aspect": "exif:exif",
                            "properties": [
                                "exif:pixelXDimension",
                                "exif:pixelYDimension",
                                ...
                            ]
                        }
                    ]
                }
            ]
        }
    },

This configuration is going to show all the listed properties `exif:*` in a group titled with the value of the variable  `APP.CONTENT_METADATA.EXIF_GROUP_TITLE` for the aspect `exif:exif`. Since this aspect is not related to the related node, the component will simply ignore the rendering and nothing will be displayed for these properties. In other words: the aspects to be displayed are calculated as an intersection of the preset's aspects and the aspects related to the node.

## Adding and using a new `preset` configuration

In this example we are going to add a new preset configuration and see how it looks like in the user interface.

### Adding a new `preset` configuration

To add a new `preset` configuration, edit the `src/app.config.json` file and point to the `content-metadata` section. Once done, append the following JSON to the `presets` content and save the file.

    ...,
    "content-metadata": {
        "presets": {
            "custom": [...],
            "my-preset": [
                {
                    "title": "This is my preset",
                    "items": [
                        {
                            "aspect": "st:siteContainer",
                            "properties": ["*"]
                        }
                    ]
                }
            ]
        }
    },

**Note:** As alternative to `"properties": ["*"]` that indicates all the properties of the `st:siteContainer` aspect, you can use `"properties": ["st:componentId"]` that will render one property only.

### Using the `my-preset` configuration

Now that the `my-preset` configuration is defined, let's use it into a view of the ADF application. As an example, let's edit the files view, stored into the `src/app/files` folder. More in detail, let's change the `files.component.html` file as follow.

    <adf-content-metadata-card
        ...
        [preset]="'my-preset'">
    </adf-content-metadata-card>

### Viewing the result

After saving the html file, open the ADF app into a browser and dive into the `Personal Files > Sites > swsdp` folder of the Alfresco's repository. Once there, select the `documentLibrary` folder (one click only) and click on the view details icon (the `i` on the top right). Scrolling down the metadata tab on the right, click on the `More information` item at the bottom. Once clicked, you will see two different groups: `Properties` (already there by default) and `This is my preset`. Click on `This is my preset` to show the properties related.

In the following screenshot you can see how the result should look like.

![content_metadata_preset](../docassets/images/content_metadata_preset.png)

As an example, double click on the `documentLibrary` folder and select (with one click) the `Presentations` folder. You should see disappearing the `This is my preset` group from the metadata panel, because the node doesn't have the `st:siteContainer` aspect.
