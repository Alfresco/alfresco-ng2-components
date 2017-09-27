# Info drawer layout component

Displays a sidebar-style information panel.

![Info drawer layout screenshot](docassets/images/infodrawerlayout.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic usage](#basic-usage)
- [Details](#details)
- [See also](#see-also)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic usage

```html
<adf-info-drawer-layout>
    <div info-drawer-title>File info</div>

    <div info-drawer-buttons>
        <md-icon>clear</md-icon>
    </div>

    <div info-drawer-content>
        <md-card>
            Lorem ipsum dolor sit amet...
        </md-card>
    </div>
</adf-info-drawer-layout>
```

## Details

As the name suggests, this is basically just a layout with CSS styling. There are three regions where you can add your own content, as shown in the example:

- info-drawer-title
- info-drawer-buttons
- info-drawer-content

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Info drawer component](info-drawer.component.md)
<!-- seealso end -->
