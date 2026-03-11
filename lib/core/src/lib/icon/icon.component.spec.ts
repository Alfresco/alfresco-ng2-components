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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_ICON_VALUE, IconComponent } from './icon.component';
import { ICON_ALIAS_MAP_TOKEN } from './icon-alias-map.token';
import { IconType, MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('IconComponent', () => {
    let component: IconComponent;
    let fixture: ComponentFixture<IconComponent>;
    let loader: HarnessLoader;

    /**
     *  @param value value input for the component
     */
    function setValueInput(value: string) {
        fixture.componentRef.setInput('value', value);

        fixture.detectChanges();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [IconComponent, MatIconTestingModule],
            providers: [
                {
                    provide: ICON_ALIAS_MAP_TOKEN,
                    useValue: {
                        mock_icon_v1: 'mock_alias_v1',
                        mock_icon_v2: 'mock_alias_v2'
                    }
                }
            ]
        });

        fixture = TestBed.createComponent(IconComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        fixture.detectChanges();
    });

    it('should set value to default if no value input is provided', async () => {
        expect(component.value).toBe(DEFAULT_ICON_VALUE);
        expect(component.isSvg).toBe(false);

        const iconHarness = await loader.getHarness(MatIconHarness);

        expect(await iconHarness.getType()).toBe(IconType.FONT);
        expect(await iconHarness.getName()).toContain(DEFAULT_ICON_VALUE);
    });

    it('should set value to input value', async () => {
        setValueInput('mock_icon');

        expect(component.value).toBe('mock_icon');
        expect(component.isSvg).toBe(false);

        const iconHarness = await loader.getHarness(MatIconHarness);

        expect(await iconHarness.getType()).toBe(IconType.FONT);
        expect(await iconHarness.getName()).toContain('mock_icon');
    });

    it('should set value to mapped value and use svg if alias map is provided and input value is a property of the map', async () => {
        setValueInput('mock_icon_v1');

        expect(component.value).toBe('mock_alias_v1');
        expect(component.isSvg).toBe(true);

        const iconHarness = await loader.getHarness(MatIconHarness);

        expect(await iconHarness.getType()).toBe(IconType.SVG);
        expect(await iconHarness.getName()).toContain('mock_alias_v1');
    });

    it('should set value to input value if alias map is provided but input value is NOT a property of the map', async () => {
        setValueInput('mock_icon_v3');

        expect(component.value).toBe('mock_icon_v3');
        expect(component.isSvg).toBe(false);

        const iconHarness = await loader.getHarness(MatIconHarness);

        expect(await iconHarness.getType()).toBe(IconType.FONT);
        expect(await iconHarness.getName()).toContain('mock_icon_v3');
    });

    it('should use svg if value input is custom icon', async () => {
        setValueInput('adf:mock_custom_icon');

        expect(component.value).toBe('adf:mock_custom_icon');
        expect(component.isSvg).toBe(true);

        const iconHarness = await loader.getHarness(MatIconHarness);

        expect(await iconHarness.getType()).toBe(IconType.SVG);
        expect(await iconHarness.getName()).toContain('mock_custom_icon');
    });
});
