function main() {
    var siteDivision = getDivision();
    document.setInheritsPermissions(false);
    document.setPermission("Read", "GROUP_AG");
    document.setPermission("Read", "GROUP_AAG");
    document.setPermission("Read", "GROUP_DAG");
    document.setPermission("ReadProperties", "GROUP_" + siteDivision + "Paralegal");
    document.setPermission("ReadProperties", "GROUP_" + siteDivision + "SupportStaff");
    document.setPermission("ReadProperties", "GROUP_" + siteDivision + "Attorney");
    document.setPermission("ReadProperties", "GROUP_" + siteDivision + "Admin");
}

function getDivision() {
    var currentDoc = document;
    while (currentDoc.name.indexOf('documentLibrary') < 0) {
        currentDoc = currentDoc.parent;
    }
    var site = siteService.getSite(currentDoc.parent.name);
    if (site) {
        return site.shortName;
    }
}

main();