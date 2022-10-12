import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  flag = false;
  currentLoc: any = {
    lat: null,
    lng: null,
  };
  markerLoc: any = {
    lat: null,
    lng: null,
  };
  marker: any;
  map: any;
  services: any = [
    {
      id: 1,
      type: 'Plumber',
      provider: 'xyz',
    },
    {
      id: 2,
      type: 'Electrician',
      provider: 'xyz',
    },
    {
      id: 3,
      type: 'Mechanic',
      provider: 'xyz',
    },
    {
      id: 4,
      type: 'Engineer',
      provider: 'xyz',
    },
    {
      id: 5,
      type: 'Sweeper',
      provider: 'xyz',
    },
    {
      id: 6,
      type: 'Office Boy',
      provider: 'xyz',
    },
    {
      id: 7,
      type: 'Painter',
      provider: 'xyz',
    },
    {
      id: 8,
      type: 'Carpenter',
      provider: 'xyz',
    },
    {
      id: 9,
      type: 'Chef',
      provider: 'xyz',
    },
    {
      id: 10,
      type: 'Tailor',
      provider: 'xyz',
    },
  ];
  constructor(private elementRef: ElementRef) {}
  ngOnInit(): void {
    this.renderMap(this.loadMap);
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement
      .querySelector('#map')
      .addEventListener('click', this.combine.bind(this));
  }

  loadMap = () => {
    this.setMapCenter();
  };
  setMapCenter() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.currentLoc.lat = position.coords.latitude;
          this.currentLoc.lng = position.coords.longitude;
          const pos = {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 18,
            disableDefaultUI: true,
          };
          this.initMap(pos);
        },
        () => {
          const position = {
            center: {
              lat: 31.470562173934646,
              lng: 74.24975424509226,
            },
            zoom: 18,
            disableDefaultUI: true,
          };
          this.initMap(position);
        }
      );
    } else {
      const position = {
        center: {
          lat: 31.470562173934646,
          lng: 74.24975424509226,
        },
        zoom: 18,
        disableDefaultUI: true,
      };
      this.initMap(position);
    }
  }
  initMap(position: any) {
    this.map = new window['google'].maps.Map(
      document.getElementById('map') as HTMLElement,
      position
    );
    this.addCurrentMarker(this.currentLoc);
    this.map.addListener('click', this.onMapClick.bind(this));
  }
  addMarker(e: any) {
    this.markerLoc.lat = e.latLng.lat();
    this.markerLoc.lng = e.latLng.lng();
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new window['google'].maps.Marker({
      position: e.latLng,
    });
    this.marker.setMap(this.map);
    // this.combine();
  }
  addCurrentMarker(pos: any) {
    console.log(pos);
    this.markerLoc.lat = pos.lat;
    this.markerLoc.lng = pos.lng;
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new window['google'].maps.Marker({
      position: pos,
    });
    this.marker.setMap(this.map);
    // this.combine();
  }
  onMapClick(e: any) {
    this.addMarker(e);
  }
  combine() {
    // console.log(this.elementRef.nativeElement.querySelector('#map'));
  }
  onServicesClick() {
    console.log(this);
    this.flag = true;
  }

  /* #region  Map function */
  renderMap = (loadMap: any) => {
    this.mapUnsubscribe();
    window['initMap'] = () => {
      loadMap();
    };
    if (!window.document.getElementById('google-map-script')) {
      var s = window.document.createElement('script');
      s.id = 'google-map-script';
      s.type = 'text/javascript';
      s.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBXBz-8QEGv1oad2TB6fGT7B74m1rptHUE&callback=initMap';
      window.document.body.appendChild(s);
    } else {
      // loadMap();
    }
  };
  mapUnsubscribe = () => {
    if (document.getElementById('google-map-script')) {
      document.getElementById('google-map-script')!.remove();
      delete window['google'];
    }
  };
  /* #endregion */
}
