# CORS solving strategies

A web client built with ADF typically won't be loaded from the same web server that the Alfresco Platform is running on.
This means you need to tell the Alfresco server explicitly that any request coming in from this custom web client should be allowed access 
to the Content Repository. This is done by enabling
[Cross Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
(CORS).

If you are experiencing this kind of problem, use **one of the following approaches**,
depending on your setup:

1. [Configure Webpack Proxy](#configure-webpack-proxy) 
2. [Configure angular-cli Proxy](#configure-angular-cli-proxy)
3. [Configure nginx proxy](#configure-nginx-proxy)
4. [Enable CORS in CS and PS](#configure-webpack-proxy)

## Configure Webpack Proxy

If you are using a project created with the [Yeoman Generator](https://github.com/Alfresco/generator-ng2-alfresco-app) or the demo shell (>=1.6.0), you already have
a suitable configuration out of the box in your `config/webpack.common.js` file.

Say we have an app running on http://localhost:3000/ and we want to redirect all calls with the following strategy:

* Content Service http://localhost:8080/  redirect to -> http://localhost:3000/ecm/ 
* Process Service http://localhost:9999/  redirect to -> http://localhost:3000/bpm/ 

Open the `config/webpack.common.js` file, find the `devServer` section and add the content:

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

- With a different configuration of webpack, the `devServer` properties could be in other webpack files. Search your configuration files to find the correct location.

- If you are running the App, Content Service or Process Service on different ports change the ports accordingly in your local configuration.

For further details about how to configure a webpack proxy please refer to the [official documentation](https://webpack.js.org/configuration/dev-server/#devserver-proxy).

## Configure angular-cli Proxy

Say we have an app running on http://localhost:3000/ and we want to redirect all the calls with the following strategy:

* Content Service http://localhost:8080/  redirect to -> http://localhost:3000/ecm/ 
* Process Service http://localhost:9999/  redirect to -> http://localhost:3000/bpm/ 

Create a file next to the project's `package.json`, call it `proxy.conf.json` and add the following content:

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

Note that if you are running the App, Content Service or Process Service on different ports, you should change the ports accordingly in your local configuration.

For further details about how to configure a webpack proxy please refer to the [official documentation](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md).


## Configure nginx proxy

### Installing nginx

Most Linux distributions will come with nginx available to install via your
package manager and on Mac OS you can use [Homebrew](http://brew.sh/).

If you want to install manually, you can follow the instructions on the
[download page](http://nginx.org/en/download.html). See also the specific information for
[Windows users](http://nginx.org/en/docs/windows.html).

#### Start nginx

Start nginx using the supplied configuration in [nginx.conf](nginx.conf)

    nginx -c nginx.conf

#### Review nginx configuration

To correctly configure nginx, use the [nginx.conf](nginx.conf) file in the project root folder.
This will host Activiti, Alfresco and the app dev framework under the same origin.

* ECM : http://localhost:8888/alfresco/
* BPM : http://localhost:8888/activiti/

To make everything work, you should change the address of ECM and BPM. In the demo app you can do that by clicking on the top right settings menu and changing the bottom left options: *ECM host* and *BPM host*.

This configuration assumes a few things:

* Port mapping:
  * nginx entry point: 0.0.0.0:8888
  * Demo Shell: localhost:3000
  * Alfresco: localhost:8080
  * Activiti: localhost:9999

You can modify all these values at their respective `location` directive in the
[nginx.conf](/nginx.conf) file.

See the [Alfresco community page](https://community.alfresco.com/community/application-development-framework/blog/2016/09/28/adf-development-set-up-with-nginx-proxy) about using nginx with ADF for further information.

## Enable CORS in CS and PS

If you want to completely enable CORS calls in your Content Services and Process Services,
please refer to the following Alfresco documents:

* [Enable Cross Origin Resource Sharing (CORS) in Alfresco Process Services](http://docs.alfresco.com/process-services1.6/topics/enabling-cors.html)

* Enable Cross Origin Resource Sharing (CORS) in Alfresco Content Services 

The easiest approach is to add the [enablecors](https://artifacts.alfresco.com/nexus/service/local/repositories/releases/content/org/alfresco/enablecors/1.0/enablecors-1.0.jar) 
platform module JAR to the `$ALF_INSTALL_DIR/modules/platform` directory and restart the server.

Note that, by default, the CORS filter that is enabled will allow any origin.

Alternatively, you can update the `web.xml` file manually.

Modify `$ALF_INSTALL_DIR/tomcat/webapps/alfresco/WEB-INF/web.xml` and uncomment the following section and update 
`cors.allowOrigin` to `http://localhost:3000`:

```xml
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
When specifying the `cors.allowOrigin` URL, make sure that you use the URL that will be used by the web client. 

Then uncomment the filter mappings:

```xml
<filter-mapping>
      <filter-name>CORS</filter-name>
      <url-pattern>/api/*</url-pattern>
      <url-pattern>/service/*</url-pattern>
      <url-pattern>/s/*</url-pattern>
      <url-pattern>/cmisbrowser/*</url-pattern>
</filter-mapping>
```
