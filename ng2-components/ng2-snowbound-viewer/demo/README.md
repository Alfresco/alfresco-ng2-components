# ng2-snowbound-viewer - Demo

* To install dependencies

```sh
$ npm install
```

* To provide a live demo

```sh
$ npm run start
```

* To clean npm_modules and typings folder

```sh
$ npm run clean
```

## How to test a change to a generic component in its own demo

Let's suppose that for some reason you have changed a component and you want to test this changes.
The example is based on the ng2-alfresco-login component, but you can use the same steps for any component.


1.  Move inside the component folder and link it.
```sh

cd ng2-alfresco-login
npm link

```

2.  Build the component with the watcher enabled.
```sh

npm run build:w

```

3. Move inside the demo folder and link the component to the local node_modules folder.
```sh

cd demo
npm link ng2-alfresco-login

```

4. Start the demo project.
```sh

npm run start
```
