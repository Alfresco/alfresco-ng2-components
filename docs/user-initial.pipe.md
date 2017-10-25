# User Initial pipe

Takes the name fields of a UserProcessModel object and extracts and formats the initials.

## Basic Usage

```HTML
<div>
    Project Leader: {{ user | usernameInitials:"initialsClass" }}
</div>
```

## Details

The pipe gets the initial characters of the user's first and last names and
concatenates them. The results are returned in an HTML &lt;div&gt; element.

The first pipe parameter specifies an optional CSS class to add to the &lt;div&gt;
element (eg, a background color is commonly used to emphasise initials). The
second parameter is an optional delimiter to add between the initials.
Both parameters default to empty strings.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->