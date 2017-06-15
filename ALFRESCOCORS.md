### CORS solving strategies

The web client that we are building with the application development framework will be loaded from a different web server than the Alfresco Platform is running on.
So we need to tell the Alfresco server that any request that comes in from this custom web client should be allowed access 
to the Content Repository. This is done by enabling CORS.

If you are experiencing this kind of problem you can follow  **one of the following**:

1. [Configure Webpack Proxy](#configure-webpack-proxy) 
2. [Configure angular-cli Proxy](#configure-angular-cli-proxy)
3. [Configure nginx proxy](#configure-nginx-proxy)
4. [Enable CORS in CS and PS](#configure-webpack-proxy)

# Configure Webpack Proxy

If you are using a project created with the [Yeoman Generator](https://github.com/Alfresco/generator-ng2-alfresco-app) or the demo shell >=1.6.0 you have already out of the box in your `config/webpack.common.js` the following configuration. 
Say we have an app running on http://localhost:3000/ and we want all calls redirect with the following strategy:

* Content service http://localhost:8080/  redirect to -> http://localhost:3000/ecm/ 
* Process service http://localhost:9999/  redirect to -> http://localhost:3000/bpm/ 

Open the file `config/webpack.common.js`  find the `devServer`  section and  add the content:

```javascript
devServer: {
        contentBase: helpers.root('dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        host: '0.0.0.0',
        inline: true,
        proxy: {
            '/ecm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 8080
                },
                pathRewrite: {
                    '^/ecm': ''
                }
            },
            '/bpm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 9999
                },
                pathRewrite: {
                    '^/bpm': ''
                }
            }
        }
    },
```

Notes:
- With differents configuration of webpack the `devServer` properties could be in other webpack files. Search in your configuration

- If you are runnign the App, content service or process service on different ports change the ports accordingly your local configuration.
For further details about how to configure a webpack proxy please refer to the [official documentation](https://webpack.js.org/configuration/dev-server/#devserver-proxy).

# Configure angular-cli Proxy
Say we have a app running on http://localhost:3000/ and we want redirect all the calls with the following strategy:

* Content service http://localhost:8080/  redirect to -> http://localhost:3000/ecm/ 
* Process service http://localhost:9999/  redirect to -> http://localhost:3000/bpm/ 

Create a file next to projects `package.json` call it `proxy.conf.json` with the content:

```javascript
{
    '/ecm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 8080
                },
                pathRewrite: {
                    '^/ecm': ''
                }
            },
    '/bpm': {
                target: {
                    host: "0.0.0.0",
                    protocol: 'http:',
                    port: 9999
                },
                pathRewrite: {
                    '^/bpm': ''
                }
            }
}
```

Note if you are running the App, content service or process service on different ports change the ports accordingly your local configuration.
For further details about how to configure a webpack proxy please refer to the [official documentation](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md).


# Configure nginx proxy

## Installing nginx

Most Linux distributions will come with nginx available to install via your
package manager and on Mac OS you can use [Homebrew](http://brew.sh/).

If you want to install manually however you can follow the instructions on the
[download page](http://nginx.org/en/download.html). See also the specific information for
[windows users](http://nginx.org/en/docs/windows.html).

### Start nginx

Start nginx using the supplied configuration in [nginx.conf](nginx.conf)

    nginx -c nginx.conf

### Review nginx configuration

To correctly configure nginx use the following file [nginx.conf](/nginx.conf).
This will host Activiti, Alfresco and the app dev framework under the same origin.

* ECM : http://localhost:8888/alfresco/
* BPM : http://localhost:8888/activiti/

To make everything work, you have to change the address of the ECM and BPM. In the demo app you can do that clicking on the top right settings menu and change the bottom left options: *ECM host* and *BPM host*.

This configuration assumes few things:

* Port mapping:
  * nginx entry point: 0.0.0.0:8888
  * Demo Shell: locathost:3000
  * Alfresco: locathost:8080
  * Activiti: locathost:9999

All those values can be modified at their respective `location` directive on the [nginx.conf](/nginx.conf) file.

If you want to know more on how to install and configure nginx to work with the Application Development Framework can be found [here](https://community.alfresco.com/community/application-development-framework/blog/2016/09/28/adf-development-set-up-with-nginx-proxy)


# Enable CORS in CS and PS

If you want completely enable CORS call on your Content service and Process service, plese refer to the following alfresco documents:

* [Enable Cross Origin Resource Sharing (CORS) in Alfresco Process Services](http://docs.alfresco.com/process-services1.6/topics/enabling-cors.html)

* [Enable Cross Origin Resource Sharing (CORS) in Alfresco Content Services

This is the easiest way, add the [enablecors](https://artifacts.alfresco.com/nexus/service/local/repositories/releases/content/org/alfresco/enablecors/1.0/enablecors-1.0.jar) 
platform module JAR to the *$ALF_INSTALL_DIR/modules/platform* directory and restart the server.

Note. by default the CORS filter that is enabled will allow any origin.
 
##Or - Manually update the web.xml file

Modify *$ALF_INSTALL_DIR/tomcat/webapps/alfresco/WEB-INF/web.xml* and uncomment the following section and update 
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