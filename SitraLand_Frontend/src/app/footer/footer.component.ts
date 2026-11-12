import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }
  aboutPage: any;
  options: any;
  overlays: any[];
  onceCliiick: any;
  @Output() getIdofPage = new EventEmitter();
  ngOnInit() {
    let aboutPage = this.activeRoute.snapshot.queryParamMap.get('returnUrl');


    // this.overlays = [
    //   new google.maps.Marker({ position: { lat: 36.879466, lng: 30.667648 }, title: "Konyaalti" }),
    //   new google.maps.Polygon({
    //     paths: [
    //       { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
    //     ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
    //   }),
    //   new google.maps.Circle({ center: { lat: 36.90707, lng: 30.56533 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }),
    //   new google.maps.Polyline({ path: [{ lat: 36.86149, lng: 30.63743 }, { lat: 36.86341, lng: 30.72463 }], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2 })
    // ];
  }
  goToAboutPage(id) {
    this.router.navigate(['/about-site/' + id]);
    this.getIdofPage.emit(id);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

}
