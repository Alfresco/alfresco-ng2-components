
# Saved Searches Service

Manages operations related to saving and retrieving user-defined searches in the Alfresco Process Services (APS) environment.

## Class members

### Properties

- **savedSearches$**: [`ReplaySubject`](https://rxjs.dev/api/index/class/ReplaySubject)`<SavedSearch[]>`<br/>
  Stores the list of saved searches and emits new value whenever there is a change.

### Methods

#### getSavedSearches(): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<SavedSearch[]>`

Fetches the file with list of saved searches either from a locally cached node ID or by querying the APS server. Then it reads the file and maps JSON objects into SavedSearches

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<SavedSearch[]>` - An observable that emits the list of saved searches.

#### saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>`

Saves a new search and updates the existing list of saved searches stored in file and in service property savedSearches$. 

- **Parameters**:
    - `newSaveSearch`: An object containing the `name`, `description`, and `encodedUrl` of the new search.

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>` - An observable that emits the response of the node entry after saving.

### Usage Examples

#### Fetching Saved Searches

The following example shows how to fetch saved searches:

```typescript
this.savedSearchService.getSavedSearches().subscribe((searches: SavedSearch[]) => {
    console.log('Saved searches:', searches);
});
```

#### Saving a New Search

To save a new search:

```typescript
const newSearch = { name: 'New Search', description: 'A sample search', encodedUrl: 'url3' };
this.savedSearchService.saveSearch(newSearch).subscribe((response) => {
    console.log('Saved new search:', response);
});
```

#### Creating Saved Searches Node

When the saved searches file does not exist, it will be created:

```typescript
this.savedSearchService.createSavedSearchesNode('parent-node-id').subscribe((node) => {
    console.log('Created saved-searches.json node:', node);
});
```

