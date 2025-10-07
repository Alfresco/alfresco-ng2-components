---
Title: DataTable service
Added: v6.0.0
Status: Active
Last reviewed: 2023-01-01
---

# [Datatable service](../../../lib/core/src/lib/datatable/services/datatable.service.ts "Defined in datatable.service.ts")

## Details

If you need to update one row of your datatable you can use the  [`DataTableService`](../../../lib/core/src/lib/datatable/services/datatable.service.ts) to update it.
To update a single row you can use the rowUpdate subject. 
The model to update the DataTable require the ID of the row you want change and the new data Object of the row

```typescript
DataRowUpdateModel {
    obj: any;
    id: string;
}
```

For example if your table use entry nodes you can pass:

```typescript
this.dataTableService.rowUpdate.next({id: node.id, obj: {entry: node}});
```

As good practice is better to provide a [`DataTableService`](../../../lib/core/src/lib/datatable/services/datatable.service.ts) in the component where you are going to deliver the new object

```typescript
@Component({
    selector: 'app-files-component',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DataTableService
    ]
})
export class FilesComponent implements OnInit {

    constructor(private dataTableService: DataTableService,
                private nodeService: NodesApiService) {
    }
    
    ngOnInit() {
        this.nodeService.nodeUpdated.subscribe((node) => {
            this.dataTableService.rowUpdate.next({id: node.id, obj: {entry: node}});
        });
    }
```

## See also

-   [Datatable](../components/datatable.component.md)
