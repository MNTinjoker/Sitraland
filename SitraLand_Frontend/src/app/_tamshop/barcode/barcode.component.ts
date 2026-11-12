import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit {

  barcodeSrc: string;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let name = this.activeRoute.snapshot.paramMap.get('id');
    this.barcodeSrc = `https://stream.tamland.ir/tamland/barcode/${name}.png`
  }

}
