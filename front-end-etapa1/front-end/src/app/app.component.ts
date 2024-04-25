import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css','theme.scss'],
})

export class AppComponent{
  title = 'front-end';

  @ViewChildren('mdcButton', { read: ElementRef }) mdcButtons!: QueryList<ElementRef>;


}