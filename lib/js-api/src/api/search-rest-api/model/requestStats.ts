/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * A list of stats request.
 */
export class RequestStats {
    /**
     * The stats field
     */
    field?: string;
    /**
     * A label to include for reference the stats field
     */
    label?: string;
    /**
     * The minimum value of the field
     */
    min?: boolean;
    /**
     * The maximum value of the field
     */
    max?: boolean;
    /**
     * The sum of all values of the field
     */
    sum?: boolean;
    /**
     * The number which have a value for this field
     */
    countValues?: boolean;
    /**
     * The number which do not have a value for this field
     */
    missing?: boolean;
    /**
     * The average
     */
    mean?: boolean;
    /**
     * Standard deviation
     */
    stddev?: boolean;
    /**
     * Sum of all values squared
     */
    sumOfSquares?: boolean;
    /**
     * The set of all distinct values for the field (This can be very expensive to calculate)
     */
    distinctValues?: boolean;
    /**
     * The number of distinct values  (This can be very expensive to calculate)
     */
    countDistinct?: boolean;
    /**
     * A statistical approximation of the number of distinct values
     */
    cardinality?: boolean;
    /**
     * Number between 0.0 and 1.0 indicating how aggressively the algorithm should try to be accurate. Used with boolean cardinality flag.
     */
    cardinalityAccuracy?: number;
    /**
     * A list of filters to exclude
     */
    excludeFilters?: string[];
    /**
     * A list of percentile values, e.g. \"1,99,99.9\"
     */
    percentiles?: number[];

    constructor(input?: Partial<RequestStats>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
