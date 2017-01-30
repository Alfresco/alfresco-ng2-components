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
exports.fakeSearch = {
    list: {
        pagination: {
            count: 1,
            hasMoreItems: false,
            totalItems: 1,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    id: '123',
                    name: 'MyDoc',
                    content: {
                        mimetype: 'text/plain'
                    },
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
exports.fakeError = {
    error: {
        errorKey: 'Search failed',
        statusCode: 400,
        briefSummary: '08220082 search failed',
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
        descriptionURL: 'https://api-explorer.alfresco.com'
    }
};
exports.fakeApi = {
    core: {
        queriesApi: {
            findNodes: function (term, opts) { return Promise.resolve(exports.fakeSearch); }
        }
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hbGZyZXNjby1zZWFyY2guc2VydmljZS5tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7QUFFUSxRQUFBLFVBQVUsR0FBRztJQUNwQixJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUU7WUFDUixLQUFLLEVBQUUsQ0FBQztZQUNSLFlBQVksRUFBRSxLQUFLO1lBQ25CLFVBQVUsRUFBRSxDQUFDO1lBQ2IsU0FBUyxFQUFFLENBQUM7WUFDWixRQUFRLEVBQUUsR0FBRztTQUNoQjtRQUNELE9BQU8sRUFBRTtZQUNMO2dCQUNJLEtBQUssRUFBRTtvQkFDSCxFQUFFLEVBQUUsS0FBSztvQkFDVCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUU7d0JBQ0wsUUFBUSxFQUFFLFlBQVk7cUJBQ3pCO29CQUNELGFBQWEsRUFBRTt3QkFDWCxXQUFXLEVBQUUsVUFBVTtxQkFDMUI7b0JBQ0QsY0FBYyxFQUFFO3dCQUNaLFdBQVcsRUFBRSxVQUFVO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFFUyxRQUFBLFNBQVMsR0FBRztJQUNuQixLQUFLLEVBQUU7UUFDSCxRQUFRLEVBQUUsZUFBZTtRQUN6QixVQUFVLEVBQUUsR0FBRztRQUNmLFlBQVksRUFBRSx3QkFBd0I7UUFDdEMsVUFBVSxFQUFFLDhHQUE4RztRQUMxSCxjQUFjLEVBQUUsbUNBQW1DO0tBQ3REO0NBQ0osQ0FBQztBQUVTLFFBQUEsT0FBTyxHQUFHO0lBQ2pCLElBQUksRUFBRTtRQUNGLFVBQVUsRUFBRTtZQUNSLFNBQVMsRUFBRSxVQUFDLElBQUksRUFBRSxJQUFJLElBQUssT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFVLENBQUMsRUFBM0IsQ0FBMkI7U0FDekQ7S0FDSjtDQUNKLENBQUMiLCJmaWxlIjoiYXNzZXRzL2FsZnJlc2NvLXNlYXJjaC5zZXJ2aWNlLm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgdmFyIGZha2VTZWFyY2ggPSB7XG4gICAgbGlzdDoge1xuICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgIGhhc01vcmVJdGVtczogZmFsc2UsXG4gICAgICAgICAgICB0b3RhbEl0ZW1zOiAxLFxuICAgICAgICAgICAgc2tpcENvdW50OiAwLFxuICAgICAgICAgICAgbWF4SXRlbXM6IDEwMFxuICAgICAgICB9LFxuICAgICAgICBlbnRyaWVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcxMjMnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTXlEb2MnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW1ldHlwZTogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRCeVVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnSm9obiBEb2UnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVkQnlVc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0pvaG4gRG9lJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxufTtcblxuZXhwb3J0IHZhciBmYWtlRXJyb3IgPSB7XG4gICAgZXJyb3I6IHtcbiAgICAgICAgZXJyb3JLZXk6ICdTZWFyY2ggZmFpbGVkJyxcbiAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgICBicmllZlN1bW1hcnk6ICcwODIyMDA4MiBzZWFyY2ggZmFpbGVkJyxcbiAgICAgICAgc3RhY2tUcmFjZTogJ0ZvciBzZWN1cml0eSByZWFzb25zIHRoZSBzdGFjayB0cmFjZSBpcyBubyBsb25nZXIgZGlzcGxheWVkLCBidXQgdGhlIHByb3BlcnR5IGlzIGtlcHQgZm9yIHByZXZpb3VzIHZlcnNpb25zLicsXG4gICAgICAgIGRlc2NyaXB0aW9uVVJMOiAnaHR0cHM6Ly9hcGktZXhwbG9yZXIuYWxmcmVzY28uY29tJ1xuICAgIH1cbn07XG5cbmV4cG9ydCB2YXIgZmFrZUFwaSA9IHtcbiAgICBjb3JlOiB7XG4gICAgICAgIHF1ZXJpZXNBcGk6IHtcbiAgICAgICAgICAgIGZpbmROb2RlczogKHRlcm0sIG9wdHMpID0+IFByb21pc2UucmVzb2x2ZShmYWtlU2VhcmNoKVxuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
