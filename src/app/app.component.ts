import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  firstFlag = false;
  secondFlag = false;
  markerLoc = {
    lat: null,
    lng: null,
  };
  marker: any;
  map: any;
  selectedService = {
    id: 0,
    type: '',
    provider: '',
    state: 0,
  };
  services: any = [
    {
      id: 1,
      type: 'Plumber',
      provider: 'Plumber',
      state: 2,
    },
    {
      id: 2,
      type: 'Electrician',
      provider: 'Electrician',
      state: 3,
    },
    {
      id: 3,
      type: 'Mechanic',
      provider: 'Mechanic',
      state: 1,
    },
    {
      id: 4,
      type: 'Engineer',
      provider: 'Engineer',
      state: 5,
    },
    {
      id: 5,
      type: 'Sweeper',
      provider: 'Sweeper',
      state: 4,
    },
    {
      id: 6,
      type: 'Office Boy',
      provider: 'Office Boy',
      state: 3,
    },
    {
      id: 7,
      type: 'Painter',
      provider: 'Painter',
      state: 2,
    },
    {
      id: 8,
      type: 'Carpenter',
      provider: 'Carpenter',
      state: 5,
    },
    {
      id: 9,
      type: 'Chef',
      provider: 'Chef',
      state: 1,
    },
    {
      id: 10,
      type: 'Tailor',
      provider: 'Tailor',
      state: 5,
    },
  ];
  statuses = [
    { index: 1, state: 'Pending' },
    { index: 2, state: 'On Way' },
    { index: 3, state: 'Delivered' },
    { index: 4, state: 'Working' },
    { index: 5, state: 'Completed' },
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

    // var searchOrigin = new window['google'].maps.LatLng(40.6892494, -74.0445);
    // var request = {
    //   location: searchOrigin,
    //   fields: ['name', 'geometry'],
    //   radius: 100,
    // };
    // const service = new window['google'].maps.places.PlacesService(this.map);
    // console.log('service');
    // console.log(service);

    // service.nearbySearch(request, function (results: any, status: any) {
    //   console.log(status);
    //   if (status === window['google'].maps.places.PlacesServiceStatus.OK) {
    //     var distance = 10000;
    //     for (var i = 0; i < results.length; i++) {
    //       console.log(results[i]);

    //       // if (thisDist < distance) {
    //       //   closest = marker;
    //       //   distance = thisDist;
    //       // }
    //     }

    //     // map.setCenter(closest.getPosition());
    //     // google.maps.event.trigger(closest, 'click');
    //   }
    // });
  }
  addMarker(latLng: any) {
    if (this.marker) {
      this.marker.setMap(null);
      this.firstFlag = false;
      // this.markerLoc.lat = null;
      // this.markerLoc.lng = null;
    }
    this.marker = new window['google'].maps.Marker({
      position: latLng,
    });
    this.marker.setMap(this.map);
    // this.combine();
  }
  onMapClick(e: any) {
    this.markerLoc.lat = e.latLng.lat();
    this.markerLoc.lng = e.latLng.lng();
    this.addMarker(e.latLng);
  }
  combine() {
    // console.log(this.elementRef.nativeElement.querySelector('#map'));
  }
  onServicesClick() {
    this.firstFlag = true;
  }
  onActionClick(service: any) {
    this.selectedService = service;
    this.firstFlag = false;
    this.secondFlag = true;
  }
  onBackClick() {
    this.secondFlag = false;
    this.firstFlag = true;
  }
  checkState(state: any) {
    if (state <= this.selectedService.state) {
      return true;
    } else {
      return false;
    }
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
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBXBz-8QEGv1oad2TB6fGT7B74m1rptHUE&libraries=places,geometry&callback=initMap';
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
