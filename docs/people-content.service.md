# People Content service

Gets information about a Content Services user.

## Methods

`getPerson(personId: string): Observable<any>`<br/>
Gets information about a user identified by their username.

`getCurrentPerson(): Observable<any>`<br/>
Gets information about the user who is currently logged-in.

## Details

The class returned by `getPerson` and `getCurrentPerson` is detailed
in the [Ecm User model docs](ecm-user.model.md). The `avatarId` passed to
`getUserProfileImage` is available as a field of the `EcmUserModel` instance
returned for a particular person.

See the
[getPerson](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/PeopleApi.md#getPerson)
method in the Alfresco JS API for more information about the REST calls used by this service.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [People process service](people-process.service.md)
- [Ecm user model](ecm-user.model.md)
<!-- seealso end -->