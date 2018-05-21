#!/bin/bash
base_url="http://adfdev.envalfresco.com"
bpm_url="$base_url/activiti-app"
ecm_url="$base_url/alfresco"

bpm_user="admin@app.activiti.com"
bpm_pass="admin"
ecm_user="admin"
ecm_pass="admin"

user_1=("dev@app.activiti.com" "dev" "user")
user_2=("mike_rotch@app.activiti.com" "mike" "rotch")
user_3=("mike_hunt@app.activiti.com" "mike" "hunt")
user_4=("ivana_tinkle@app.activiti.com" "ivana" "tinkle")
user_5=("anita_bath@app.activiti.com" "anita" "bath")
user_6=("jenni_joy@activiti.com" "jenni" "joy")
user_7=("qa@app.activiti.com" "qa" "user")

user_password="adfUser"

COMMAND="curl -s -o /dev/null -I -w %{http_code} $bpm_url/#/login"
while HTTPCODE=$($COMMAND); [[ $HTTPCODE != 200 ]]; # if the curl command IS NOT 200
do
  echo "Waiting for activiti to be ready @ $bpm_url ..."
  sleep 2
done

agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0'
csrf_token="9e3617ef39948664587f7aaaf0003ccadc"

function extract_id_from_json() {
  [[ "$1" =~ ^\{\"id\":\"?([^\",]+)\"? ]] && echo "${BASH_REMATCH[1]}" || echo ""
}

function extract_remeber_me_cookie() {
   [[ "$1" =~ ACTIVITI_REMEMBER_ME=[A-Za-z0-9]+\; ]] && echo "Hello, ${BASH_REMATCH[0]}" || echo ""
}

function log_in {
  userName="$1"
  password="$2"
  local resp=$( curl -s -D - \
    -X POST \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d "j_username=$userName&j_password=$password&_spring_security_remember_me=true&submit=Login" \
    "$ecm_url/api/-default-/public/alfresco/versions/1/people" )
   echo $( extract_remeber_me_cookie "$resp" )
}

function ecm_create_user() {
  local resp=$( curl -s \
    -u "$ecm_user:$ecm_pass" \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -d '{"id": "'$1'","firstName": "'$2'","lastName": "'$3'","email": "'$1'","password": "'$4'"}' \
  "$ecm_url/api/-default-/public/alfresco/versions/1/people")
}

function bpm_create_tenant() {
  tenant_name="$1"
  local resp=$( curl --write-out %{http_code} -s \
    -X POST \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"active":true,"maxUsers":10,"name":"'$tenant_name'"}' \
    "$bpm_url/api/enterprise/admin/tenants")
  echo $( extract_id_from_json "$resp" )
}

function bpm_create_user_multi_tenant() {
  tenant_id="$5"
  local resp=$( curl -s \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"'$1'", "lastName":"'$2'", "email":"'$3'", "password":"'$4'", "status":"active", "type":"enterprise", "tenantId":"'$tenant_id'"}' \
    "$bpm_url/api/enterprise/admin/users" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_create_user_single_tenant() {
  tenant_id="$5"
  test -z "$5" && tenant_id=1
  local resp=$( curl -s \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"'$1'", "lastName":"'$2'", "email":"'$3'", "password":"'$4'", "status":"active", "type":"enterprise", "tenantId":'$tenant_id'}' \
    "$bpm_url/api/enterprise/admin/users" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_import_app() {
  local resp=$( curl -s \
    -u "$1:$user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -F file=@$2 \
    "$bpm_url/api/enterprise/app-definitions/import?renewIdmEntries=true" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_publish_app() {
  curl -s\
    -u "$1:$user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "{ \"comment\": \"\", \"force\": false }" \
    "$bpm_url/api/enterprise/app-definitions/$2/publish"
}

function bpm_deploy_app() {
  curl -s\
    -u "$1:$user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "{ \"appDefinitions\": [{\"id\":$2}] }" \
    "$bpm_url/api/enterprise/runtime-app-definitions"
}

for f in apps/*.zip
do
  i=1
  while [ $i -le 7 ]
  do
    echo "> App Found: - $f"
          tenant="tenant_$i"
          eval user_email="\${user_$i[0]}"
          eval user_first_name="\${user_$i[1]}"
          eval user_second_name="\${user_$i[2]}"
    
          ecm_create_user "$user_email" "$user_first_name" "$user_second_name" "$user_password"
          echo "Dev Environment:- created ecm user: $user_email"
          tenantId=$( bpm_create_tenant $tenant )
          echo "Dev Environment:- created tenant: $tenant"
          bpm_create_user_multi_tenant "$user_first_name" "$user_second_name" "$user_email" "$user_password" "$tenantId"
          echo "Dev Environment:- created bpm user: $user_email"

          app_id=$( bpm_import_app "$user_email" "$f" )
          test -z "$app_id" && echo "Could not find app ID" && exit 1
          bpm_publish_app "$user_email" "$app_id"
          bpm_deploy_app "$user_email" "$app_id"
          echo "> App ($app_id) Published and Deployed for user: $user_email."
          ((i++))
  done
done
