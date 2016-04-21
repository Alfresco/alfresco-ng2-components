// contains only limited subset of available fields
export class LocationEntity {
    repositoryId: string;
    site: string;
    siteTitle: string;
    container: string;
    path: string;
    file: string;
    parent: LocationParentEntity;
}

export class LocationParentEntity {
    nodeRef: string;
}
