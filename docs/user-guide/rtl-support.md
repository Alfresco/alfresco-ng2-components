---
Title: Right-to-left language support
Added: 2019-03-13
---

# Right-to-left language support

ADF currently has limited support for languages that are written from right to left (such as Arabic).

ADF has been updated and tested to work with the HTML
[`dir` attribute](https://www.w3.org/TR/html51/dom.html#the-dir-attribute)
added to the main `<body>` element in `index.html`. When the attribute is set to
`rtl`, text in the app will be right-aligned as required for right-to-left languages:

```html
<body dir="rtl">
    ...
</body>
```

If you use the  [Sidenav Layout component](../core/components/sidenav-layout.component.md) you can  choose set the direction property in it using the property direction ans set it to **'rtl'**


```html
<adf-sidenav-layout
    [direction]="'rtl'">
......
</adf-sidenav-layout>
```



Also, we have a [translation file](internationalization.md) for Arabic (code: "ar"),
which is the
[most widely used](https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers)
language written from right to left.

It is on our [roadmap](../roadmap.md) to extend and improve our support for RTL languages
in the coming versions of ADF.
