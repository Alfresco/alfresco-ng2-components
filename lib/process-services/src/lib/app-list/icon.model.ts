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

const DEFAULT_TASKS_APP_MATERIAL_ICON: string = 'favorite_border';

/* spellchecker: disable */
export class IconModel {
    private iconsMDL: Map<string, string>;
    private supportedIconTypes = ['glyphicon', 'fa' /*Font awesome*/];

    private sharedIconsMap = [
        ['asterisk', 'ac_unit'],
        ['plus', 'add'],
        ['euro', 'euro_symbol'],
        ['cloud', 'cloud'],
        ['envelope', 'mail'],
        ['pencil', 'create'],
        ['glass', 'local_bar'],
        ['music', 'music_note'],
        ['search', 'search'],
        ['heart', 'favorite'],
        ['heart-empty', 'favorite_border'],
        ['star', 'star'],
        ['star-empty', 'star_border'],
        ['user', 'person'],
        ['film', 'movie_creation'],
        ['th-large', 'view_comfy'],
        ['th', 'dashboard'],
        ['th-list', 'list'],
        ['ok', 'done'],
        ['remove', 'cancel'],
        ['zoom-in', 'zoom_in'],
        ['zoom-out', 'zoom_out'],
        ['off', 'highlight_off'],
        ['signal', 'signal_cellular_4_bar'],
        ['cog', 'settings'],
        ['trash', 'delete'],
        ['home', 'home'],
        ['file', 'insert_drive_file'],
        ['time', 'access_time'],
        ['road', 'map'],
        ['download-alt', 'file_download'],
        ['download', 'file_download'],
        ['upload', 'file_upload'],
        ['inbox', 'inbox'],
        ['play-circle', 'play_circle_outline'],
        ['repeat', 'refresh'],
        ['refresh', 'sync'],
        ['list-alt', 'event_note'],
        ['lock', 'lock_outline'],
        ['flag', 'assistant_photo'],
        ['headphones', 'headset'],
        ['volume-up', 'volume_up'],
        ['tag', 'local_offer'],
        ['tags', 'local_offer'],
        ['book', 'library_books'],
        ['bookmark', 'collections_bookmark'],
        ['print', 'local_printshop'],
        ['camera', 'local_see'],
        ['list', 'view_list'],
        ['facetime-video', 'video_call'],
        ['picture', 'photo'],
        ['map-marker', 'add_location'],
        ['adjust', 'brightness_4'],
        ['tint', 'invert_colors'],
        ['edit', 'edit'],
        ['share', 'share'],
        ['check', 'assignment_turned_in'],
        ['move', 'open_with'],
        ['play', 'play_arrow'],
        ['eject', 'eject'],
        ['plus-sign', 'add_circle'],
        ['minus-sign', 'remove_circle'],
        ['remove-sign', 'cancel'],
        ['ok-sign', 'check_circle'],
        ['question-sign', 'help'],
        ['info-sign', 'info'],
        ['screenshot', 'flare'],
        ['remove-circle', 'cancel'],
        ['ok-circle', 'add_circle'],
        ['ban-circle', 'block'],
        ['share-alt', 'redo'],
        ['exclamation-sign', 'error'],
        ['gift', 'giftcard'],
        ['leaf', 'spa'],
        ['fire', 'whatshot'],
        ['eye-open', 'remove_red_eye'],
        ['eye-close', 'remove_red_eye'],
        ['warning-sign', 'warning'],
        ['plane', 'airplanemode_active'],
        ['calendar', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['random', 'shuffle'],
        ['comment', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['magnet', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['retweet', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['shopping-cart', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['folder-close', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['folder-open', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['hdd', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['bullhorn', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['bell', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['certificate', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['thumbs-up', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['thumbs-down', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['hand-left', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['globe', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['wrench', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['tasks', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['filter', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['briefcase', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['dashboard', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['paperclip', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['link', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['phone', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['pushpin', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['usd', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['gbp', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['sort', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['flash', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['record', 'radio_button_checked'],
        ['save', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['open', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['saved', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['send', 'send'],
        ['floppy-disk', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['credit-card', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['cutlery', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['earphone', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['phone-alt', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['tower', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['stats', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['cloud-download', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['cloud-upload', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['tree-conifer', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['tree-deciduous', DEFAULT_TASKS_APP_MATERIAL_ICON],
        ['align-left', 'format_align_left']
    ];

    constructor() {
        this.initIconsMDL();
    }

    mapGlyphiconToMaterialDesignIcons(icon: string) {
        return this.iconsMDL.get(icon) ? this.iconsMDL.get(icon) : DEFAULT_TASKS_APP_MATERIAL_ICON;
    }

    /**
     * Map all the bootstrap glyphicon icons with Material design material icon
     */
    initIconsMDL() {
        this.iconsMDL = new Map<string, string>();

        this.supportedIconTypes.forEach(iconType => {
            this.sharedIconsMap.forEach(([iconKey, iconValue]) => {
                this.iconsMDL.set(`${iconType}-${iconKey}`, iconValue);
            });
        });
    }
}
