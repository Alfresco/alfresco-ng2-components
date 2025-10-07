# Error Events

The api/js-api has an error handler event where you can subscribe

**Example**

```javascript
alfrescoJsApi.on('error', error => {
    console.log(error);
});
```