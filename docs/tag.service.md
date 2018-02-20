# Tag service

Manages tags in Content Services.

## Methods

-   `getTagsByNodeId(nodeId: string): any`  
    Gets a list of tags added to a node.  
    -   `nodeId` - ID of the target node
-   `getAllTheTags(): any`  
    Gets a list of all the tags already defined in the repository.   

-   `addTag(nodeId: string, tagName: string): any`  
    Adds a tag to a node.  
    -   `nodeId` - ID of the target node
    -   `tagName` - Name of the tag to add
-   `removeTag(nodeId: string, tag: string): any`  
    Removes a tag from a node.  
    -   `nodeId` - ID of the target node
    -   `tag` - Name of the tag to remove

## Details

Content Services supports
[tagging](http://docs.alfresco.com/5.2/tasks/site-content-tag.html)
of file and folder nodes to assist with searches. A tag is a short
text string added to an item, rather like a hashtag in social media.

Usually, it is wise to let the user see a list of existing tags and let
them choose one by clicking. If they type a tag name with incorrect spelling
then it will be treated as a new tag, even though that was not intended.
Use `getAllTheTags` to find all tags in the repository when you need to
construct a list like this.

See the
[Tags API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/TagsApi.md)
in the Alfresco JS API for more information about the types returned by Tag
service methods and for the implementation of the REST API the service is
based on.

## See also

-   [Tag list component](tag-list.component.md)
