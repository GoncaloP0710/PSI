import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {MDCRipple} from '@material/ripple';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'mat-divider',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent implements AfterViewInit {
  title = 'front-end';

  @ViewChildren('mdcButton', { read: ElementRef }) mdcButtons!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.mdcButtons.forEach(button => new MDCRipple(button.nativeElement));
  }
}