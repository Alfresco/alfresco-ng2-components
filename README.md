# ALFRESCO WEB COMPONENTS

### Running demo project

**Note**: *Steps below show the quickest way to get demo shell up and running.
For development configuration please refer to* **Configuring development environment**
*section further in this document.*

##### Using setup script (recommended)

```sh
git clone https://github.com/Alfresco/dev-platform-webcomponents.git
./start.sh
```

##### Manual setup

```sh
git clone https://github.com/Alfresco/dev-platform-webcomponents.git
cd dev-platform-webcomponents/demo-shell-ng2

npm install
npm install ../ng2-components/ng2-alfresco-documentlist
npm install ../ng2-components/ng2-alfresco-login

npm run build.dev
```

### Configuring development environment

**Get a copy**

```sh
git clone https://github.com/Alfresco/dev-platform-webcomponents.git
```

**Install symlinks for Alfresco components**

*ng2-alfresco-documentlist component:*

```sh
cd ng2-components/ng2-alfresco-documentlist
npm link
cd ../../demo-shell-ng
npm link ng2-alfresco-documentlist
```

*ng2-alfresco-login component:*

```sh
cd ng2-components/ng2-alfresco-login
npm link
cd ../../demo-shell-ng
npm link ng2-alfresco-login
```

Please refer to [this article](https://docs.npmjs.com/cli/link) for more details on npm link.

### Building and running

**Install dependencies:**


```sh
cd dev-platform-webcomponents/demo-shell-ng2/
npm install
```

**(Option 1) Fast build and watch for dev purposes:**

```sh
npm start
```

**(Option 2) Build and watch with Gulp:**

```sh
npm run build.dev
```

*or*

```sh
gulp dev
```
