DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "====== Removing Alfresco dependencies from package.json ====="

grep -wirn '@alfresco\/adf*' $DIR/../package.json
sed -i 's/"@alfresco\/adf-[^,]*,//' $DIR/../package.json
sed -i '/^[[:space:]]*$/d' $DIR/../package.json

echo "====== Alfresco dependencies removed from package.json ====="
