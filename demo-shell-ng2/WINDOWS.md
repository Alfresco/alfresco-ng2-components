#Windows Installation of *Alfresco Angular 2 Components* project with Docker

**Note:** *Following these instructions from scratch will download in excess of 3.5Gb and will at various times require access to Alfresco network resources, so probably best run from the office.*

1. Clone this git repository locally (access permissions will be required):  
https://github.com/Alfresco/dev-platform-webcomponents

2. Clone this git repository locally (access permissions will be required):  
https://github.com/Alfresco/dev-platform-js-api

3. Follow these instructions to install Docker - up until the 'hello world' point as a verification of installation success:  
https://docs.docker.com/engine/installation/windows/  
Leave the launched shell running.

4. Start following these **Alfresco Angular 2 Components** installation instructions to just before the 'docker-compose up' command:  
https://github.com/Alfresco/dev-platform-webcomponents/blob/master/demo-shell-ng2/README.md

5. From the docker shell you left open, navigate into the *demo-shell-ng2* directory of the 'dev-platform-webcomponents' codebase.

6. Continue with the **Alfresco Angular 2 Components** instructions from the 'docker-compose up' command, using the previously launched docker shell (starts docker with the Alfresco image), including the 'Configuring development environment' instructions:  
https://github.com/Alfresco/dev-platform-webcomponents/blob/master/demo-shell-ng2/README.md

7. Finally, from another favourite shell, run the ng2 app by following the instructions in the **Building and running** section to 'install' and 'start'.