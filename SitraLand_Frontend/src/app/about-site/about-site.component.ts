import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-about-site',
  templateUrl: './about-site.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./about-site.component.css']
})
export class AboutSiteComponent implements OnInit, OnDestroy {

  constructor(
    private activeRoute: ActivatedRoute
  ) { }

  statuse: number = 5;
  private paramSub?: Subscription;

  ngOnInit() {
    this.paramSub = this.activeRoute.paramMap.subscribe(params => {
      const id = +(params.get('id') || 0);
      // Show the selected page, and fall back to "about us" when the id is missing.
      this.statuse = id >= 1 && id <= 5 ? id : 5;
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  changePageBY(getIdofPage) {
    this.statuse = getIdofPage;
  }

  changePage(id) {
    this.statuse = id;
  }

}
