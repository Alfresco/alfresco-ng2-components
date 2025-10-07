/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataColumn } from '../../data/data-column.model';

export const mockCarsData: any = [
    {
        car_id: 1,
        car_name: 'Fiat 126p (Process)',
        car_price: 599.0,
        fuel_consumption: 5.25789,
        is_available: 'false',
        production_start: '1972-04-23',
        description:
            'The Fiat 126 (Type 126) is a four-passenger, rear-engine, city car manufactured and marketed by Fiat over a twenty-eight year production run from 1972 until 2000, over a single generation.',
        icon: 'airport_shuttle',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Fiat_126'
    },
    {
        car_id: 2,
        car_name: 'Citroen Xsara Picasso (Process)',
        car_price: 10000,
        fuel_consumption: 4.9,
        is_available: 'true',
        production_start: '2004-02-10T12:25:43.511Z',
        description: 'The Citroën Xsara Picasso is a car produced by Citroën from 1999 to 2012. It has a five-seater five-door compact MPV design.',
        icon: 'local_shipping',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Citro%C3%ABn_Xsara_Picasso'
    },
    {
        car_id: 3,
        car_name: 'Audi A3 (Process)',
        car_price: 15000.12345,
        fuel_consumption: 6,
        is_available: 'true',
        production_start: '1998-06-25T12:25:20',
        description:
            'The Audi A3 is a subcompact executive/small family car (C-segment) manufactured and marketed by the German automaker Audi AG since September 1996, currently in its fourth generation.',
        icon: 'directions_car',
        wikipedia_link: 'https://en.wikipedia.org/wiki/Audi_A3'
    }
];

export const mockCarsSchemaDefinition: DataColumn[] = [
    {
        type: 'icon',
        key: 'icon',
        title: '',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: 'car_id',
        title: 'Car ID',
        sortable: true,
        draggable: true
    },
    {
        type: 'text',
        key: 'car_name',
        title: 'Car Name',
        sortable: true,
        draggable: true
    },
    {
        type: 'amount',
        key: 'car_price',
        title: 'Car Price',
        sortable: true,
        draggable: true,
        currencyConfig: {
            code: 'USA',
            display: 'code',
            digitsInfo: '1.0-2',
            locale: 'en-US'
        }
    },
    {
        type: 'number',
        key: 'fuel_consumption',
        title: 'Fuel Consumption (l/100km)',
        sortable: true,
        draggable: true,
        decimalConfig: {
            digitsInfo: '1.0-3',
            locale: 'en-US'
        }
    },
    {
        type: 'boolean',
        key: 'is_available',
        title: 'Available?',
        sortable: true,
        draggable: true
    },
    {
        type: 'date',
        key: 'production_start',
        title: 'Production Start',
        sortable: true,
        draggable: true
    },
    {
        type: 'json',
        key: 'description',
        title: 'Description',
        sortable: true,
        draggable: true
    },
    {
        type: 'location',
        format: '/somewhere',
        key: 'wikipedia_link',
        title: 'Wikipedia',
        sortable: true,
        draggable: true
    }
];
