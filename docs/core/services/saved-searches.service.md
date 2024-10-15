
# Saved Searches Service

Manages operations related to saving and retrieving user-defined searches in the Alfresco Process Services (APS) environment.

## Class members

### Properties

- **savedSearches$**: [`ReplaySubject`](https://rxjs.dev/api/index/class/ReplaySubject)`<SavedSearch[]>`<br/>
  Stores the list of saved searches and emits new value whenever there is a change.

### Methods

#### getSavedSearches(): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<SavedSearch[]>`

Fetches the file with list of saved searches either from a locally cached node ID or by querying the APS server. Than it reads the file and maps JSON objects into SavedSearches

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<SavedSearch[]>` - An observable that emits the list of saved searches.

#### saveSearch(newSaveSearch: Pick<SavedSearch, 'name' | 'description' | 'encodedUrl'>): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>`

Saves a new search and updates the existing list of saved searches stored in file and in service property savedSearches$. 

- **Parameters**:
    - `newSaveSearch`: An object containing the `name`, `description`, and `encodedUrl` of the new search.

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>` - An observable that emits the response of the node entry after saving.

#### getSavedSearchesNodeId(): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<string>`

Fetches the node ID of the saved searches JSON file. If the node is not cached in `localStorage`, it queries the APS server for the node associated with the current user. If the file does not exist, it creates a new file.

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<string>` - An observable that emits the node ID of the saved searches file.

#### createSavedSearchesNode(parentNodeId: string): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>`

Creates the `saved-searches.json` file in the specified parent node.

- **Parameters**:
    - `parentNodeId`: The ID of the parent node where the file will be created.

- **Returns**:
    - [`Observable`](https://rxjs.dev/api/index/class/Observable)`<NodeEntry>` - An observable that emits the newly created node entry.

#### mapFileContentToSavedSearches(blob: Blob): `Promise`<`SavedSearch[]`>

Parses the content of the saved searches file and converts it into a list of `SavedSearch` objects.

- **Parameters**:
    - `blob`: The blob object representing the saved searches content.

- **Returns**:
    - `Promise`<`SavedSearch[]`> - A promise that resolves to an array of saved searches.

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

