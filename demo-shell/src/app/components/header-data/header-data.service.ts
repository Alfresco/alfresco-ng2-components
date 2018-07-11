import { Injectable, Output, EventEmitter } from '@angular/core';


@Injectable()
export class HeaderDataService {

  show = true;

  @Output() hideMenu: EventEmitter<boolean> = new EventEmitter();
  @Output() color: EventEmitter<string> = new EventEmitter();
  @Output() title: EventEmitter<string> = new EventEmitter();
  @Output() logo: EventEmitter<string> = new EventEmitter();

  hideMenuButton() {
    this.show = !this.show;
    this.hideMenu.emit(this.show);
  }

  changeColor(color: string) {
    this.color.emit(color);
  }

  changeTitle(title: string) {
    this.title.emit(title);

  }

  changeLogo(logoPath: string) {
    this.logo.emit(logoPath);
  }
}
