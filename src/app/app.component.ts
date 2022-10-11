import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  flag = false;
  markerLoc = {
    lat: null,
    lng: null,
  };
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
    const position = {
      center: {
        lat: 31.470562173934646,
        lng: 74.24975424509226,
      },
      zoom: 11,
      disableDefaultUI: true,
    };
    this.initMap(position);
  }
  initMap(position: any) {
    this.map = new window['google'].maps.Map(
      document.getElementById('map') as HTMLElement,
      position
    );
    this.map.addListener('click', this.onMapClick.bind(this));
  }
  addMarker(latLng: any) {
    const marker = new window['google'].maps.Marker({
      position: latLng,
    });
    marker.setMap(this.map);
    // this.combine();
  }
  onMapClick(e: any) {
    this.markerLoc.lat = e.latLng.lat();
    this.markerLoc.lng = e.latLng.lng();
    this.addMarker(e.latLng);
  }
  combine() {
    // console.log(this.elementRef.nativeElement.querySelector('#map'));
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
