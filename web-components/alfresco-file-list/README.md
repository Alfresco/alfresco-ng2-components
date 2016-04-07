# &lt;alfresco-file-list&gt;

> Alfresco files and Folders viewver list 

## Demo

[Check it live!](http://eromano.github.io/alfresco-file-list)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install alfresco-file-list --save
```

Or [download as ZIP](https://github.com/eromano/alfresco-file-list/archive/master.zip).

## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/alfresco-file-list/dist/alfresco-file-list.html">
    ```

3. Start using it!

    ```html
    <alfresco-file-list></alfresco-file-list>
    ```

# publish-subscribe functionality
Add the code below to the main index.html in order to refresh the file list when a file is uploaded.

<template is="dom-bind" id="alfresco-app">
     <iron-signals on-iron-signal-uploaded="uploadedSignal"></iron-signals>
</template>
```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`foo`         | *string*    | `bar`        | Lorem ipsum dolor.

## Methods

Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`unicorn()`   | None.        | Nothing.    | Magic stuff appears.

## Events

Event         | Description
---           | ---
`onsomething` | Triggers when something happens.

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

* Install [Bower](http://bower.io/) & [Grunt](http://gruntjs.com/):

    ```sh
    $ [sudo] npm install -g bower grunt-cli
    ```

* Install local dependencies:

    ```sh
    $ bower install && npm install
    ```

* To test your project, start the development server and open `http://localhost:8000`.

    ```sh
    $ grunt server
    ```

* To build the distribution files before releasing a new version.

    ```sh
    $ grunt build
    ```

* To provide a live demo, send everything to `gh-pages` branch.

    ```sh
    $ grunt deploy
    ```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

For detailed changelog, check [Releases](https://github.com/eromano/alfresco-file-list/releases).

## License

[MIT License](http://opensource.org/licenses/MIT)
