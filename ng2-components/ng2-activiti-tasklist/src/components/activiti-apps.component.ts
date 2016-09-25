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

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { AppDefinitionRepresentationModel } from '../models/filter.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-apps',
    moduleId: __moduleName,
    templateUrl: 'activiti-apps.component.html',
    styleUrls: ['./activiti-apps.component.css', './activiti-apps-grid.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiApps implements OnInit {

    public static LAYOUT_LIST: string = 'LIST';
    public static LAYOUT_GRID: string = 'GRID';
    public static DEFAULT_TASKS_APP: string = 'tasks';
    public static DEFAULT_TASKS_APP_NAME: string = 'Task App';
    public static DEFAULT_TASKS_APP_THEME: string = 'theme-2';
    public static DEFAULT_TASKS_APP_ICON: string = 'glyphicon-asterisk';
    public static DEFAULT_TASKS_APP_MATERIAL_ICON: string = 'favorite_border';

    @Input()
    layoutType: string = ActivitiApps.LAYOUT_GRID;

    @Output()
    appClick: EventEmitter<AppDefinitionRepresentationModel> = new EventEmitter<AppDefinitionRepresentationModel>();

    private appsObserver: Observer<AppDefinitionRepresentationModel>;
    apps$: Observable<AppDefinitionRepresentationModel>;

    currentApp: AppDefinitionRepresentationModel;

    appList: AppDefinitionRepresentationModel [] = [];

    private iconsMDL: Map<string, string>;

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }

        this.apps$ = new Observable<AppDefinitionRepresentationModel>(observer =>  this.appsObserver = observer).share();
    }

    ngOnInit() {
        if (!this.isValidType()) {
            throw( new Error(`LayoutType property allowed values: ${ActivitiApps.LAYOUT_LIST} - ${ActivitiApps.LAYOUT_GRID}`));
        }

        this.apps$.subscribe((app: any) => {
            this.appList.push(app);
        });
        this.initIconsMDL();
        this.load();
    }

    public load(name?: string) {
        this.activitiTaskList.getDeployedApplications(name).subscribe(
            (res) => {
                res.forEach((app: AppDefinitionRepresentationModel) => {
                    if (app.defaultAppId === ActivitiApps.DEFAULT_TASKS_APP) {
                        app.name = ActivitiApps.DEFAULT_TASKS_APP_NAME;
                        app.theme = ActivitiApps.DEFAULT_TASKS_APP_THEME;
                        app.icon = ActivitiApps.DEFAULT_TASKS_APP_ICON;
                        this.appsObserver.next(app);
                        this.selectApp(app);
                    } else if (app.deploymentId) {
                        this.appsObserver.next(app);
                    }
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }

    /**
     * Pass the selected app as next
     * @param app
     */
    public selectApp(app: AppDefinitionRepresentationModel) {
        this.currentApp = app;
        this.appClick.emit(app);
    }

    /**
     * Return true if the appId is the current app
     * @param appId
     * @returns {boolean}
     */
    isSelected(appId: number): boolean {
        return (this.currentApp !== undefined && appId === this.currentApp.id);
    }

    /**
     * Check if the value of the layoutType property is an allowed value
     * @returns {boolean}
     */
    isValidType(): boolean {
        if (this.layoutType && (this.layoutType === ActivitiApps.LAYOUT_LIST || this.layoutType === ActivitiApps.LAYOUT_GRID)) {
            return true;
        }
        return false;
    }

    /**
     * Return true if the layout type is LIST
     * @returns {boolean}
     */
    isList(): boolean {
        return this.layoutType === ActivitiApps.LAYOUT_LIST;
    }

    /**
     * Return true if the layout type is GRID
     * @returns {boolean}
     */
    isGrid(): boolean {
        return this.layoutType === ActivitiApps.LAYOUT_GRID;
    }

    isEmpty(): boolean {
        return this.appList.length === 0;
    }

    getTheme(app: AppDefinitionRepresentationModel): string {
        return app.theme ? app.theme : '';
    }

    getBackgroundIcon(app: AppDefinitionRepresentationModel): string {
        return this.mapGlyphiconToMaterialDesignIcons(app.icon);
    }

    mapGlyphiconToMaterialDesignIcons(icon: string) {
        return this.iconsMDL.get(icon) ? this.iconsMDL.get(icon) : ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON;
    }

    /**
     * Map all the bootstrap glyphicon icons with Material design material icon
     */
    initIconsMDL() {
        this.iconsMDL = new Map<string, string>();

        this.iconsMDL.set('glyphicon-asterisk', 'ac_unit');
        this.iconsMDL.set('glyphicon-plus', 'add');
        this.iconsMDL.set('glyphicon-euro', 'euro_symbol');
        this.iconsMDL.set('glyphicon-cloud', 'cloud');
        this.iconsMDL.set('glyphicon-envelope', 'mail');
        this.iconsMDL.set('glyphicon-pencil', 'create');
        this.iconsMDL.set('glyphicon-glass', 'local_bar');
        this.iconsMDL.set('glyphicon-music', 'music_note');
        this.iconsMDL.set('glyphicon-search', 'search');
        this.iconsMDL.set('glyphicon-heart', 'favorite');
        this.iconsMDL.set('glyphicon-heart-empty', 'favorite_border');
        this.iconsMDL.set('glyphicon-star', 'star');
        this.iconsMDL.set('glyphicon-star-empty', 'star_border');
        this.iconsMDL.set('glyphicon-user', 'person');
        this.iconsMDL.set('glyphicon-film', 'movie_creation');
        this.iconsMDL.set('glyphicon-th-large', 'view_comfy');
        this.iconsMDL.set('glyphicon-th', 'view_compact');
        this.iconsMDL.set('glyphicon-th-list', 'list');
        this.iconsMDL.set('glyphicon-ok', 'done');
        this.iconsMDL.set('glyphicon-remove', 'cancel');
        this.iconsMDL.set('glyphicon-zoom-in', 'zoom_in');
        this.iconsMDL.set('glyphicon-zoom-out', 'zoom_out');
        this.iconsMDL.set('glyphicon-off', 'highlight_off');
        this.iconsMDL.set('glyphicon-signal', 'signal_cellular_4_bar');
        this.iconsMDL.set('glyphicon-cog', 'settings');
        this.iconsMDL.set('glyphicon-trash', 'delete');
        this.iconsMDL.set('glyphicon-home', 'home');
        this.iconsMDL.set('glyphicon-file', 'insert_drive_file');
        this.iconsMDL.set('glyphicon-time', 'access_time');
        this.iconsMDL.set('glyphicon-road', 'map');
        this.iconsMDL.set('glyphicon-download-alt', 'file_download');
        this.iconsMDL.set('glyphicon-download', 'file_download');
        this.iconsMDL.set('glyphicon-upload', 'file_upload');
        this.iconsMDL.set('glyphicon-inbox', 'inbox');
        this.iconsMDL.set('glyphicon-play-circle', 'play_circle_outline');
        this.iconsMDL.set('glyphicon-repeat', 'refresh');
        this.iconsMDL.set('glyphicon-refresh', 'sync');
        this.iconsMDL.set('glyphicon-list-alt', 'event_note');
        this.iconsMDL.set('glyphicon-lock', 'lock_outline');
        this.iconsMDL.set('glyphicon-flag', 'assistant_photo');
        this.iconsMDL.set('glyphicon-headphones', 'headset');
        this.iconsMDL.set('glyphicon-volume-up', 'volume_up');
        this.iconsMDL.set('glyphicon-tag', 'local_offer');
        this.iconsMDL.set('glyphicon-tags', 'local_offer');
        this.iconsMDL.set('glyphicon-book', 'library_books');
        this.iconsMDL.set('glyphicon-bookmark', 'collections_bookmark');
        this.iconsMDL.set('glyphicon-print', 'local_printshop');
        this.iconsMDL.set('glyphicon-camera', 'local_see');
        this.iconsMDL.set('glyphicon-list', 'view_list');
        this.iconsMDL.set('glyphicon-facetime-video', 'video_call');
        this.iconsMDL.set('glyphicon-picture', 'photo');
        this.iconsMDL.set('glyphicon-map-marker', 'add_location');
        this.iconsMDL.set('glyphicon-adjust', 'brightness_4');
        this.iconsMDL.set('glyphicon-tint', 'invert_colors');
        this.iconsMDL.set('glyphicon-edit', 'edit');
        this.iconsMDL.set('glyphicon-share', 'share');
        this.iconsMDL.set('glyphicon-check', 'assignment_turned_in');
        this.iconsMDL.set('glyphicon-move', 'open_with');
        this.iconsMDL.set('glyphicon-play', 'play_arrow');
        this.iconsMDL.set('glyphicon-eject', 'eject');
        this.iconsMDL.set('glyphicon-plus-sign', 'add_circle');
        this.iconsMDL.set('glyphicon-minus-sign', 'remove_circle');
        this.iconsMDL.set('glyphicon-remove-sign', 'cancel');
        this.iconsMDL.set('glyphicon-ok-sign', 'check_circle');
        this.iconsMDL.set('glyphicon-question-sign', 'help');
        this.iconsMDL.set('glyphicon-info-sign', 'info');
        this.iconsMDL.set('glyphicon-screenshot', 'flare');
        this.iconsMDL.set('glyphicon-remove-circle', 'cancel');
        this.iconsMDL.set('glyphicon-ok-circle', 'add_circle');
        this.iconsMDL.set('glyphicon-ban-circle', 'block');
        this.iconsMDL.set('glyphicon-share-alt', 'redo');
        this.iconsMDL.set('glyphicon-exclamation-sign', 'error');
        this.iconsMDL.set('glyphicon-gift', 'giftcard');
        this.iconsMDL.set('glyphicon-leaf', 'spa');
        this.iconsMDL.set('glyphicon-fire', 'whatshot');
        this.iconsMDL.set('glyphicon-eye-open', 'remove_red_eye');
        this.iconsMDL.set('glyphicon-eye-close', 'remove_red_eye');
        this.iconsMDL.set('glyphicon-warning-sign', 'warning');
        this.iconsMDL.set('glyphicon-plane', 'airplanemode_active');
        this.iconsMDL.set('glyphicon-calendar', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-random', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-comment', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-magnet', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-retweet', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-shopping-cart', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-folder-close', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-folder-open', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-hdd', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-bullhorn', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-bell', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-certificate', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-thumbs-up', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-thumbs-down', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-hand-left', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-globe', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-wrench', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-tasks', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-filter', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-briefcase', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-dashboard', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-paperclip', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-link', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-phone', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-pushpin', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-usd', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-gbp', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-sort', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-flash', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-record', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-save', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-open', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-saved', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-send', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-floppy-disk', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-credit-card', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-cutlery', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-earphone', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-phone-alt', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-tower', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-stats', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-cloud-download', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-cloud-upload', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-tree-conifer', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
        this.iconsMDL.set('glyphicon-tree-deciduous', ActivitiApps.DEFAULT_TASKS_APP_MATERIAL_ICON);
    }

}
