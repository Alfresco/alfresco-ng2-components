# angular2-alfresco-login

Install:

```
npm install
```

Update host and credentials

**src/main.ts**
```ts
login() {
    let host = 'http://192.168.99.100:8080';
    let credentials = { "userId": "admin", "password": "admin" };
    ...
}
```

Run the project:

```
npm start
```