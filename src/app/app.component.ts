import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  refreshFlag = false;
  firstFlag = false;
  secondFlag = false;
  currentLoc = {
    lat: 0,
    lng: 0,
  };
  markerLoc = {
    lat: null,
    lng: null,
  };
  clickedLocation = '';
  marker: any;
  map: any;
  selectedService = {
    id: 0,
    type: '',
    provider: '',
    state: 0,
    lat: null,
    lng: null,
    photo: '',
  };
  placesService: any;
  services: any = [];
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
            zoom: 11,
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
            zoom: 11,
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
        zoom: 11,
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
    this.map.addListener('click', this.onMapClick.bind(this));
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
      icon: 'assets/icons/location.png',
    });
    this.marker.setMap(this.map);
    // this.combine();
  }
  onMapClick(e: any) {
    if (!this.secondFlag) {
      this.refreshFlag = false;
      this.markerLoc.lat = e.latLng.lat();
      this.markerLoc.lng = e.latLng.lng();
      this.searchPlaces();
      this.addMarker(e.latLng);
    }
  }
  searchPlaces() {
    // this.clickedLocation = '';
    var searchOrigin = new window['google'].maps.LatLng(
      this.markerLoc.lat,
      this.markerLoc.lng
    );
    var request = {
      location: searchOrigin,
      fields: ['name', 'geometry'],
      radius: 2000,
    };

    if (!this.placesService) {
      this.placesService = new window['google'].maps.places.PlacesService(
        this.map
      );
    }

    this.placesService.nearbySearch(request, this.getPlaces.bind(this));
  }
  getPlaces(results: any, status: any) {
    if (status === window['google'].maps.places.PlacesServiceStatus.OK) {
      if (results.length > 0) {
        this.services = results
          .filter((loc: any) => {
            return loc.business_status === 'OPERATIONAL';
          })
          .slice(0, 10)
          .map((loc: any, i: number) => {
            return {
              id: loc.place_id,
              provider: loc.name,
              type: loc.types.length > 0 ? loc.types[0] : '',
              state: Math.floor(Math.random() * 5) + 1,
              lat: loc.geometry.location.lat(),
              lng: loc.geometry.location.lng(),
              photo:
                loc.photos && loc.photos.length > 0
                  ? loc.photos[0].getUrl()
                  : 'assets/icons/profile.png',
            };
          });
        this.clickedLocation = this.services[0].provider;
        console.log(this.clickedLocation);
        console.log(this.services);
      }
    }
  }
  combine() {
    // console.log(this.elementRef.nativeElement.querySelector('#map'));
  }
  onServicesClick() {
    this.firstFlag = true;
  }
  onActionClick(service: any) {
    this.selectedService = service;
    this.addServiceIconOnMap();
    this.firstFlag = false;
    this.secondFlag = true;
  }
  onBackClick() {
    this.addMarker({ lat: this.markerLoc.lat, lng: this.markerLoc.lng });
    this.map.setCenter({ lat: this.markerLoc.lat, lng: this.markerLoc.lng });

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
  addServiceIconOnMap() {
    // this.markerLoc.lat = this.selectedService.lat;
    // this.markerLoc.lng = this.selectedService.lng;
    const latLng = {
      lat: this.selectedService.lat,
      lng: this.selectedService.lng,
    };
    if (this.marker) {
      this.marker.setMap(null);
      this.firstFlag = false;
      // this.markerLoc.lat = null;
      // this.markerLoc.lng = null;
    }
    this.marker = new window['google'].maps.Marker({
      position: latLng,
      icon: 'assets/icons/location-user.png',
    });
    this.marker.setMap(this.map);
    this.map.setCenter({
      lat: this.selectedService.lat,
      lng: this.selectedService.lng,
    });
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
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyA-qJx4ePSEDPWd21vwlG4b2aKQ_OtQSNU&libraries=places,geometry&callback=initMap';
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
