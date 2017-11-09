# Content service

Accesses app-generated data objects via URLs and file downloads.

## Methods

`downloadBlob(blob: Blob, fileName: string): void`<br/>
Starts downloading the data in `blob` to a named file.

`downloadData(data: any, fileName: string): void`<br/>
Starts downloading a data object to a named file.

`downloadJSON(json: any, fileName): void`<br/>
Starts downloading of JSON data to a named file.

`createTrustedUrl(blob: Blob): string`<br/>
Creates a trusted URL to access the data in `blob`.

## Details

Use the Content service to deliver data to the user from `Blob` objects.

The [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) class
(implemented in the browser, not ADF) represents an array of bytes that you can
use to construct and store data in any binary format you choose.
The user can access a Blob either by downloading the byte array as a file or in
some cases by viewing it directly in the browser via a special URL that references
the Blob. For example, you could use the Blob interface to construct an image in the
[PNG format](https://en.wikipedia.org/wiki/Portable_Network_Graphics). Since
PNG is a format the browser can display, you could use the Blob's URL in an
&lt;img&gt; element to view the image within the page. Alternatively, you could let
the user download it as a PNG file.

The `downloadBlob` method starts a download of the Blob data to the `filename`
within the user's downloads folder. The other `downloadXXX` methods do the same
but first convert the supplied data to a Blob before downloading; see the
[Blob reference page](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
for details of how a Blob's contents are assembled from the constructor arguments.

Use `createdTrustedUrl` to generate a URL string for a Blob. The URL refers to
the Blob as though it were a file but it is actually an object stored in memory,
so it does not persist across browser sessions. This URL can be used much like any
other, so you could use it for the `src` attribute of an &lt;img&gt; element or the
`href` of a download link. Note that while the URL is 'trusted', the data it contains
is not necessarily trustworthy unless you can vouch for it yourself; be careful that
the data doesn't expose your app to
[Cross Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
attacks.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Cookie service](cookie.service.md)
- [Storage service](storage.service.md)
<!-- seealso end -->



