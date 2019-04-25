DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "====== Removing Alfresco dependencies from package.json ====="

grep -wirn '@alfresco*' $DIR/../package.json

sed -i '' '/@alfresco*/,// d' $DIR/../package.json

echo "====== Alfresco dependencies removed from package.json ====="
