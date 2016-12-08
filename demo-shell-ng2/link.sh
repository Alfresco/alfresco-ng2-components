copylib() {
    echo $1
    rm -rf node_modules/$1
    rsync -a ../ng2-components/$1/ node_modules/$1 --exclude node_modules --exclude coverage
}

for LIB in \
    ng2-alfresco-core \
    ng2-activiti-diagrams \
    ng2-activiti-analytics \
    ng2-activiti-form \
    ng2-activiti-tasklist \
    ng2-activiti-processlist \
    ng2-alfresco-datatable \
    ng2-alfresco-documentlist \
    ng2-alfresco-login \
    ng2-alfresco-search \
    ng2-alfresco-tag \
    ng2-alfresco-upload \
    ng2-alfresco-userinfo \
    ng2-alfresco-viewer \
    ng2-alfresco-webscript
do
    copylib $LIB
done
