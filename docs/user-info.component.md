# Alfresco User Info component

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic usage](#basic-usage)
  * [Properties](#properties)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic usage

```html
<adf-userinfo></adf-userinfo>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| ecmBackgroundImage | string | (alfresco image) | Custom path for the background banner image for ECM users |
| bpmBackgroundImage | string | (alfresco image) | Custom path for the background banner image for BPM users |
| menuPositionX | string |   | Custom choice for opening the menu bottom : `before` or `after`  |
| menuPositionY | string |   | Custom choice for opening the menu bottom : `above` or `below`  |
| fallBackThumbnailImage | string | (alfresco image) | Fallback image for profile when thumbnail is missing|

## Details

This will show a round icon with user and on click some user information.
If user is logged in with ECM and BPM the ECM image will be shown.
