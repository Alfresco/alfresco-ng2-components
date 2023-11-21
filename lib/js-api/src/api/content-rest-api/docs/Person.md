# Person

**Properties**

| Name                      | Type                          |
|---------------------------|-------------------------------|
| **id**                    | string                        |
| **firstName**             | string                        |
| lastName                  | string                        |
| displayName               | string                        |
| description               | string                        |
| avatarId                  | string                        |
| **email**                 | string                        |
| skypeId                   | string                        |
| googleId                  | string                        |
| instantMessageId          | string                        |
| jobTitle                  | string                        |
| location                  | string                        |
| company                   | [Company](Company.md)         |
| mobile                    | string                        |
| telephone                 | string                        |
| statusUpdatedAt           | Date                          |
| userStatus                | string                        |
| **enabled**               | boolean                       |
| emailNotificationsEnabled | boolean                       |
| aspectNames               | string[]                      |
| properties                | Map<string, string>           |
| capabilities              | [Capabilities](#Capabilities) |

## Capabilities

**Properties**

| Name      | Type    |
|-----------|---------|
| isAdmin   | boolean |
| isGuest   | boolean |
| isMutable | boolean |

