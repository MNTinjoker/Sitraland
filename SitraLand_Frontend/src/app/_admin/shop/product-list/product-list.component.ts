import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { ShopService } from 'src/app/_services/shop.service';
import { environment } from 'src/environments/environment';
// import { UtilsService } from 'ng2-date-picker/common/services/utils/utils.service';
import { Table } from 'primeng/table';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @ViewChild(('dt')) dt!: Table;

  constructor(
    // private shopService: ShopService,
    private router: Router,
    private utilService: UtilService,
    private mainService: MainService,
  ) { }

  productList: any = [];
  server: string = environment.url + '/images/';
  userType: number = 0;
  filterConst: any;
  productConfigId: number = -1;

  ngOnInit() {
    this.getProducts();
  }


  async getProducts() {
    let data = await this.mainService.getProducts().toPromise();
    this.productList = data['data'];
    this.productList.forEach((element: { fldIsActiveTitle: string; isActive: any; }) => {
      element.fldIsActiveTitle = element.isActive ? "فعال" : "غیر فعال";
    });
  }

  goToProductDetail(id: string, title: any) {
    this.router.navigate(['/admin/product-detail/' + id], { queryParams: { data: title } });

  }

  goToProductConfig(id: string) {
    this.router.navigate(['/admin/product-config/' + id]);

  }

  goToProductProperty(id: string) {
    this.router.navigate(['/admin/product-property/' + id]);
  }

  deleteProduct(id: any) {
    this.utilService.sweetAlert({
      message: "از حذف اطمینان دارید؟"
    }).then(async check => {
      if (check.value) {
        try {
          await this.mainService.deleteProduct(id).toPromise();
          this.utilService.showNotify('با موفقیت حذف شد', 'success')
          this.getProducts();
        } catch (error) {
          this.utilService.showNotify('خطایی پیش آمده', 'error')
        }
      }
    });
  }



  goToConfg() {
    this.router.navigate(['admin/product-config/-1'])
  }
}
