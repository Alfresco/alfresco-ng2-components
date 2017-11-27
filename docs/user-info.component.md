# Alfresco User Info component

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
| namePosition | string | `right` | When the username is showed this define his position relatively the user info button. It can be two values : `right` or `left`|
| showName | boolean | true | Show/Hide the username next the user info button|

## Details

This will show a round icon with user and on click some user information.
If user is logged in with ECM and BPM the ECM image will be shown.
