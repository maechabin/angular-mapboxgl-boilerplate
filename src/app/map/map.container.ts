import { Component, OnInit, ElementRef } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

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

    (mapboxgl as any).accessToken =
      'pk.eyJ1IjoibWFlY2hhYmluIiwiYSI6ImNrNGU0eHYxMzAya3YzZm1odWRyYjAycmsifQ.dL1yZ_6587JwS6uYjwPkGg';

    const map = new mapboxgl.Map({
      container: mapElem,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [139.74267643565133, 35.69432984468491],
      zoom: 14,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });
  }
}
