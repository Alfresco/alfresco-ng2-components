System.register(['angular2/core', 'ng2-alfresco/components'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, components_1;
    var HomeView;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (components_1_1) {
                components_1 = components_1_1;
            }],
        execute: function() {
            let HomeView = class HomeView {
                constructor() {
                    this.thumbnails = true;
                    this.breadcrumb = false;
                    this.navigation = true;
                    this.downloads = true;
                    this.events = [];
                }
                onItemClick($event) {
                    console.log($event.value);
                    this.events.push({
                        name: 'Item Clicked',
                        value: $event.value
                    });
                }
            };
            HomeView = __decorate([
                core_1.Component({
                    selector: 'home-view',
                    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2">
                    <ul class="list-unstyled">
                        <li><label><input type="checkbox" [(ngModel)]="thumbnails"> Thumbnails</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="breadcrumb"> Breadcrumb</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="navigation"> Navigation</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="downloads"> Downloads</label></li>
                    </ul>
                    <hr>
                    <ul class="list-unstyled" style="font-size: 10px">
                        <li *ngFor="#event of events">
                            <strong>{{event.name}}</strong>: {{event.value.displayName}}
                        </li>
                    </ul>
                </div>
                <div class="col-md-10">
                    <alfresco-document-list #list
                        [thumbnails]="thumbnails"
                        [breadcrumb]="breadcrumb"
                        [navigate]="navigation"
                        [downloads]="downloads"
                        (itemClick)="onItemClick($event)">
                    </alfresco-document-list>
                </div>
            </div>
        </div>
    `,
                    directives: [components_1.DocumentList]
                }),
                __metadata('design:paramtypes', [])
            ], HomeView);
            exports_1("HomeView", HomeView);
        }
    }
});

//# sourceMappingURL=home.view.js.map
