### Enable CORS in Alfresco

The web client that we are building with the application development framework will be loaded from a different web server than the Alfresco Platform is running on.
So we need to tell the Alfresco server that any request that comes in from this custom web client should be allowed access 
to the Content Repository. This is done by enabling CORS.

To enable CORS in the Alfresco Platform do one of the following:

**Download and install the enable CORS module**

This is the easiest way, add the [enablecors](https://artifacts.alfresco.com/nexus/service/local/repositories/releases/content/org/alfresco/enablecors/1.0/enablecors-1.0.jar) 
platform module JAR to the *$ALF_INSTALL_DIR/modules/platform* directory and restart the server.

Note. by default the CORS filter that is enabled will allow any orgin.
 
**Manually update the web.xml file**

Modify *$ALF_INSTALL_DIR/tomcat/webapps/alfresco/WEB-INF/web.xml* and uncomment the following section and update 
`cors.allowOrigin` to `http://localhost:3000`:

```<filter>
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

``` <filter-mapping>
      <filter-name>CORS</filter-name>
      <url-pattern>/api/*</url-pattern>
      <url-pattern>/service/*</url-pattern>
      <url-pattern>/s/*</url-pattern>
      <url-pattern>/cmisbrowser/*</url-pattern>
   </filter-mapping>
```
