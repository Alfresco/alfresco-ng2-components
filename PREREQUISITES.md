# Prerequisites for building and running apps with the Alfresco Application Development Framework

The [Angular 2](https://angular.io/) based application development framework requires the following:

- An Alfresco Platform Repository to talk to, which has [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled. 
- [Node.js](https://nodejs.org/en/) JavaScript runtime.
- [npm](https://www.npmjs.com/) package manager for JavaScript.

## Installing Alfresco
 
Alfresco comes with installers that will install all the servers, webapps, and tools needed to run Alfresco.

- Download Alfresco Community from this [page](https://www.alfresco.com/products/community/download).
- Install Alfresco following these [instructions](http://docs.alfresco.com/5.1/concepts/installs-eval-intro.html).

This will install the following Alfresco web applications:

- Alfresco Platform with the Content Repository, which we need so we can access content from our custom web client
- Alfresco Solr, which we need so we can search for content from our custom web client
- Alfresco Share, not technically needed, but can be useful for creating users and groups, and to access and upload content to the repository while we are developing the custom web client

### Enable CORS in Alfresco

The web client that we are building with the application development framework will be loaded from a different web server than the Alfresco Platform is running on.
So we need to tell the Alfresco server that any request that comes in from this custom web client should be allowed access 
to the Content Repository. This is done by enabling CORS.

To enable CORS in the Alfresco Platform do the following:

Modify *tomcat/webapps/alfresco/WEB-INF/web.xml* and uncomment the following section and update 
`cors.allowOrigin` to `http://localhost:3000`:

```
   <filter>
      <filter-name>CORS</filter-name>
      <filter-class>com.thetransactioncompany.cors.CORSFilter</filter-class>
      <init-param>
         <param-name>cors.allowGenericHttpRequests</param-name>
         <param-value>true</param-value>
      </init-param>
      <init-param>
         <param-name>cors.allowOrigin</param-name>
         <param-value>http://localhost:3000</param-value>
      </init-param>
      <init-param>
         <param-name>cors.allowSubdomains</param-name>
         <param-value>true</param-value>
      </init-param>
      <init-param>
         <param-name>cors.supportedMethods</param-name>
         <param-value>GET, HEAD, POST, PUT, DELETE, OPTIONS</param-value>
      </init-param>
      <init-param>
         <param-name>cors.supportedHeaders</param-name>
         <param-value>origin, authorization, x-file-size, x-file-name, content-type, accept, x-file-type</param-value>
      </init-param>
      <init-param>
         <param-name>cors.supportsCredentials</param-name>
         <param-value>true</param-value>
      </init-param>
      <init-param>
         <param-name>cors.maxAge</param-name>
         <param-value>3600</param-value>
      </init-param>
   </filter>
```
When specifying the `cors.allowOrigin` URL make sure to use the URL that will be used by the web client. 

Then uncomment filter mappings:

```
   <filter-mapping>
      <filter-name>CORS</filter-name>
      <url-pattern>/api/*</url-pattern>
      <url-pattern>/service/*</url-pattern>
      <url-pattern>/s/*</url-pattern>
      <url-pattern>/cmisbrowser/*</url-pattern>
   </filter-mapping>
```
## Installing Node.js

If you don't have Node.js installed then access this [page](https://nodejs.org/en/download/) and use the appropriate installer for your OS.

Make sure the Node.js version is > 5:

```
$ node -v
v5.12.0
```


