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
      center: [139.78428591885523, 35.665650082797924],
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

      // Polyline
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [139.78502894751728, 35.66459051886714],
                [139.78734637610617, 35.66629894998595],
                [139.78623057715598, 35.667083421415114],
                [139.78520060889426, 35.66633381554648],
                [139.783891690895, 35.66535757409578],
                [139.78502894751728, 35.66459051886714],
              ],
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f50057',
          'line-width': 8,
        },
      });
    });

    // Marker
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([139.78428591885523, 35.665650082797924])
      .addTo(map);

    marker.on('dragend', event => {
      console.log(event.target.getLngLat());
    });
  }
}
