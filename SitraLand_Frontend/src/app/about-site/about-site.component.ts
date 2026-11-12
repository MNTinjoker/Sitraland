import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-about-site',
  templateUrl: './about-site.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./about-site.component.css']
})
export class AboutSiteComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute
  ) { }

  statuse: any;

  ngOnInit() {
    let statuseNum = +this.activeRoute.snapshot.paramMap.get('id');
    this.statuse = statuseNum;
  }

  changePageBY(getIdofPage) {
    this.statuse = getIdofPage;
  }
  changePage(id) {
    this.statuse = id;
  }

}
