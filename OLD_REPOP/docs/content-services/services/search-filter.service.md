---
Title: Search filter service
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-12
---

# [Search filter service](../../../lib/content-services/src/lib/search/services/search-filter.service.ts "Defined in search-filter.service.ts")

Registers widgets for use with the [Search Filter component](../components/search-filter.component.md).

## Details

This component keeps track of all widgets registered for use with the
[Search Filter component](../components/search-filter.component.md). All the built-in widgets are registered by default
but you should register any new custom widgets you create explicitly:

```ts
import { MyComponent } from './my-component.ts'

@Component({...})
export class MyAppOrComponent {

    constructor(searchFilterService: SearchFilterService) {
        searchFilterService.widgets['my-widget'] = MyComponent;
    }

}
```

See the [Search Widget Interface](../interfaces/search-widget.interface.md) interface page for details about creating your own
custom search widgets.

## See also

-   [Search Widget Interface](../interfaces/search-widget.interface.md)
-   [Search Filter component](../components/search-filter.component.md)
