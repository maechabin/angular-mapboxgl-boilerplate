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
      center: [139.78667643565133, 35.666],
      zoom: 17,
      pitch: 50,
      bearing: -17.6,
      antialias: true,
    });

    // NavigationControl（ズームボタンとコンパス）を表示
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // GeolocationControl（現在地取得）を表示
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
    );

    // 属性を表示
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
    );

    // scale（距離）を表示
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial',
    });
    map.addControl(scale);
    scale.setUnit('metric');

    // 全画面表示ボタンを表示
    map.addControl(
      new mapboxgl.FullscreenControl({
        container: document.querySelector('body'),
      }),
    );

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout['text-field']) {
          labelLayerId = layer.id;
        }
      });

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId,
      );
    });
  }
}
