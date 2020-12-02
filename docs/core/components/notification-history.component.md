---
Title: Notification History component
Added: v3.3.0
Status: Experimental
Last reviewed: 2019-06-05
---

# [Notification History component](../../../lib/core/notifications/components/notification-history.component.ts "Defined in notification-history.component.ts")

This component is in the current status just an experimental component.
The main purpose of the [Notification history component](../../core/components/notification-history.component.md) is list all the notification received in the current session. They will disappear from the list after the refresh.

![Notification history component](../../docassets/notification-history-component.png)

## Basic Usage

```html
<adf-notification-history [menuPositionX]="'before'" [menuPositionY]="'above'"></adf-notification-history>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| menuPositionX | `string` | "after" | Custom choice for opening the menu at the bottom. Can be `before` or `after`. |
| menuPositionY | `string` | "below" | Custom choice for opening the menu at the bottom. Can be `above` or `below`. |
