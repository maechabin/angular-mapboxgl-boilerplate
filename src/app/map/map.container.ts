import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  template: `
    <div class="map"></div>
  `,
  styleUrls: ['./map.component.scss'],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
  }
}
