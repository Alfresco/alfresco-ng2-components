---
Title: Version Compatibility Directive
Added: v3.9.0
Status: Active
Last reviewed: 2020-23-06
---

# [Version Compatibility Directive](../../../lib/core/directives/version-compatibility.directive.ts "Defined in version-compatibility.directive.ts")

Enables/disables components based on ACS version in use.

## Basic usage

```html
<button *adf-acs-version="'6.0.0'">
    My Action
</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| version | `void` |  | Minimum version required for component to work correctly . |

## Details

Add the directive to a component or HTML element to enable or disable it based on the version of ACS running in the app.

The directive takes the version specified in the html and compares it to the version of Alfresco Content Services running in the app.

This will allow certain features to be only present under specific versions.

#### Major version

```html
<button *adf-acs-version="'7'">
    My Action
</button>
```

#### Major and minor version

```html
<button *adf-acs-version="'6.2'">
    My Action
</button>
```

#### Major, minor and patch version

```html
<button *adf-acs-version="'6.0.1'">
    My Action
</button>
```

It can be set to match major, minor and patches of ACS versions. Fox example, if the version `6` is specifed it will enable the component from `6.0.0` onwards.

If the minimum version required is not matched the component will not be initialized and will disappear from the DOM tree.

    Note, if you don’t place the * in front, the app won’t be able to inject the TemplateRef and ViewContainerRef required for this directive to work. 
