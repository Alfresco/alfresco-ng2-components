/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
var entryItem = {
    entry: {
        id: '123',
        name: 'MyDoc',
        isFile: true,
        content: {
            mimeType: 'text/plain'
        },
        createdByUser: {
            displayName: 'John Doe'
        },
        modifiedByUser: {
            displayName: 'John Doe'
        }
    }
};
exports.result = {
    list: {
        entries: [
            entryItem
        ]
    }
};
exports.results = {
    list: {
        entries: [
            entryItem,
            entryItem,
            entryItem
        ]
    }
};
exports.folderResult = {
    list: {
        entries: [
            {
                entry: {
                    id: '123',
                    name: 'MyFolder',
                    isFile: false,
                    isFolder: true,
                    createdByUser: {
                        displayName: 'John Doe'
                    },
                    modifiedByUser: {
                        displayName: 'John Doe'
                    }
                }
            }
        ]
    }
};
exports.noResult = {
    list: {
        entries: []
    }
};
exports.errorJson = {
    error: {
        errorKey: 'Search failed',
        statusCode: 400,
        briefSummary: '08220082 search failed',
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
        descriptionURL: 'https://api-explorer.alfresco.com'
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hbGZyZXNjby1zZWFyY2guY29tcG9uZW50Lm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQUVILElBQU0sU0FBUyxHQUFHO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsRUFBRSxFQUFFLEtBQUs7UUFDVCxJQUFJLEVBQUUsT0FBTztRQUNiLE1BQU0sRUFBRyxJQUFJO1FBQ2IsT0FBTyxFQUFFO1lBQ0wsUUFBUSxFQUFFLFlBQVk7U0FDekI7UUFDRCxhQUFhLEVBQUU7WUFDWCxXQUFXLEVBQUUsVUFBVTtTQUMxQjtRQUNELGNBQWMsRUFBRTtZQUNaLFdBQVcsRUFBRSxVQUFVO1NBQzFCO0tBQ0o7Q0FDSixDQUFDO0FBRVMsUUFBQSxNQUFNLEdBQUc7SUFDaEIsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFO1lBQ0wsU0FBUztTQUNaO0tBQ0o7Q0FDSixDQUFDO0FBRVMsUUFBQSxPQUFPLEdBQUc7SUFDakIsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFO1lBQ0wsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1o7S0FDSjtDQUNKLENBQUM7QUFFUyxRQUFBLFlBQVksR0FBRztJQUN0QixJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUU7WUFDTDtnQkFDSSxLQUFLLEVBQUU7b0JBQ0gsRUFBRSxFQUFFLEtBQUs7b0JBQ1QsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRyxLQUFLO29CQUNkLFFBQVEsRUFBRyxJQUFJO29CQUNmLGFBQWEsRUFBRTt3QkFDWCxXQUFXLEVBQUUsVUFBVTtxQkFDMUI7b0JBQ0QsY0FBYyxFQUFFO3dCQUNaLFdBQVcsRUFBRSxVQUFVO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFFUyxRQUFBLFFBQVEsR0FBRztJQUNsQixJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsRUFBRTtLQUNkO0NBQ0osQ0FBQztBQUVTLFFBQUEsU0FBUyxHQUFHO0lBQ25CLEtBQUssRUFBRTtRQUNILFFBQVEsRUFBRSxlQUFlO1FBQ3pCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsWUFBWSxFQUFFLHdCQUF3QjtRQUN0QyxVQUFVLEVBQUUsOEdBQThHO1FBQzFILGNBQWMsRUFBRSxtQ0FBbUM7S0FDdEQ7Q0FDSixDQUFDIiwiZmlsZSI6ImFzc2V0cy9hbGZyZXNjby1zZWFyY2guY29tcG9uZW50Lm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBlbnRyeUl0ZW0gPSB7XG4gICAgZW50cnk6IHtcbiAgICAgICAgaWQ6ICcxMjMnLFxuICAgICAgICBuYW1lOiAnTXlEb2MnLFxuICAgICAgICBpc0ZpbGUgOiB0cnVlLFxuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICBtaW1lVHlwZTogJ3RleHQvcGxhaW4nXG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZWRCeVVzZXI6IHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnSm9obiBEb2UnXG4gICAgICAgIH0sXG4gICAgICAgIG1vZGlmaWVkQnlVc2VyOiB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0pvaG4gRG9lJ1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHZhciByZXN1bHQgPSB7XG4gICAgbGlzdDoge1xuICAgICAgICBlbnRyaWVzOiBbXG4gICAgICAgICAgICBlbnRyeUl0ZW1cbiAgICAgICAgXVxuICAgIH1cbn07XG5cbmV4cG9ydCB2YXIgcmVzdWx0cyA9IHtcbiAgICBsaXN0OiB7XG4gICAgICAgIGVudHJpZXM6IFtcbiAgICAgICAgICAgIGVudHJ5SXRlbSxcbiAgICAgICAgICAgIGVudHJ5SXRlbSxcbiAgICAgICAgICAgIGVudHJ5SXRlbVxuICAgICAgICBdXG4gICAgfVxufTtcblxuZXhwb3J0IHZhciBmb2xkZXJSZXN1bHQgPSB7XG4gICAgbGlzdDoge1xuICAgICAgICBlbnRyaWVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcxMjMnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTXlGb2xkZXInLFxuICAgICAgICAgICAgICAgICAgICBpc0ZpbGUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNGb2xkZXIgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkQnlVc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0pvaG4gRG9lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllZEJ5VXNlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdKb2huIERvZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn07XG5cbmV4cG9ydCB2YXIgbm9SZXN1bHQgPSB7XG4gICAgbGlzdDoge1xuICAgICAgICBlbnRyaWVzOiBbXVxuICAgIH1cbn07XG5cbmV4cG9ydCB2YXIgZXJyb3JKc29uID0ge1xuICAgIGVycm9yOiB7XG4gICAgICAgIGVycm9yS2V5OiAnU2VhcmNoIGZhaWxlZCcsXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcbiAgICAgICAgYnJpZWZTdW1tYXJ5OiAnMDgyMjAwODIgc2VhcmNoIGZhaWxlZCcsXG4gICAgICAgIHN0YWNrVHJhY2U6ICdGb3Igc2VjdXJpdHkgcmVhc29ucyB0aGUgc3RhY2sgdHJhY2UgaXMgbm8gbG9uZ2VyIGRpc3BsYXllZCwgYnV0IHRoZSBwcm9wZXJ0eSBpcyBrZXB0IGZvciBwcmV2aW91cyB2ZXJzaW9ucy4nLFxuICAgICAgICBkZXNjcmlwdGlvblVSTDogJ2h0dHBzOi8vYXBpLWV4cGxvcmVyLmFsZnJlc2NvLmNvbSdcbiAgICB9XG59O1xuIl19
