import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from 'src/app/_services/shop.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-product-property',
  templateUrl: './product-property.component.html',
  styleUrls: ['./product-property.component.css']
})
export class ProductPropertyComponent implements OnInit {

  propertyOption: any;
  propertyValueOption: any;
  model: any = {};
  propertiesList: any = [];
  propertyValuesList: any = [];
  editMode: boolean = false;
  submit: boolean = false;
  productId: number;
  ProductPropertyList: any = [];
  isEditMode: boolean = false;
  constructor(private shopService: ShopService, private utilService: UtilService, private activeRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.productId = +this.activeRoute.snapshot.paramMap.get('id');

    await this.getProductProperty();
    await this.getProperties();

    this.propertyOption = {
      multiple: false,
      tags: false,
    }
    this.propertyValueOption = {
      multiple: true,
      tags: false,
    }
  }
  async getProductProperty() {
    try {
      let res: any = await this.shopService.getProductProperty(this.productId).toPromise();
      if (res && res.data.length > 0) {
        this.ProductPropertyList = res.data;
      }
    } catch (error) {
      this.utilService.showNotify('خطایی پیش آمده', 'error')
    }
  }
  async getProperties() {
    this.shopService.getProperties().subscribe(
      (data: any) => {
        this.propertiesList = data.data;
        this.propertiesList.forEach(element => {
          element.id = element.fldPkProperty,
            element.text = element.fldTitleProperty
        });
      },
      error => {
        this.utilService.showNotify('خطایی پیش آمده', 'error')
      }
    )
  }
  selectedProperty(event) {
    this.getPropertyValues(event);
  }
  getPropertyValues(selectedProperty) {
    if (selectedProperty) {
      this.shopService.getPropertyValue(selectedProperty).subscribe(
        (data: any) => {
          this.propertyValuesList = data.data;
          this.propertyValuesList.forEach(element => {
            element.id = element.fldPkPropertyValue,
              element.text = element.fldPropertyValueTitle
          });
        },
        error => {
          this.utilService.showNotify('خطایی پیش آمده', 'error')
        }
      )
    }
  }

  async saveInfo() {
    if (!this.productId || !this.model.property || !this.model.propertyValue) {
      this.utilService.showNotify('لطفا مقادیر را وارد نمایید', 'error');
      return
    }
    let propertyValueString = this.model['propertyValue'].join(',');
    let saveModel = {
      productId: Number(this.productId),
      values: propertyValueString,
      propertyId: Number(this.model['property'])
    }
    try {
      let res = await this.shopService.saveProductProperty(saveModel).toPromise();
      this.utilService.showNotify('با موفقیت ذخیره شد', 'success')
      await this.getProductProperty();
      this.isEditMode = false;

      this.clear();
    } catch (error) {
      this.utilService.showNotify('خطایی پیش آمده', 'error')
    }
  }

  async delete(data) {
    try {
      this.utilService.sweetAlert({ message: 'از حذف ویژگی  مطمئن هستید؟' }).then(async result => {
        if (result.value) {
          let res = await this.shopService.deletePropertiy(data.fldFkProperty, this.productId).toPromise();
          this.utilService.showNotify('با موفقیت حذف شد', 'success')
          await this.getProductProperty();
        } else {
          return;
        }
      })
    } catch (error) {
      this.utilService.showNotify('خطایی پیش آمده', 'error')
    }
  }

  edit(data) {
    this.isEditMode = true;
    let stringVal: string = data.fldFkPropertyValue;
    let arrayPropertyVal = stringVal.split(',')
    this.getPropertyValues(data.fldFkProperty);
    this.model['property'] = data.fldFkProperty
    this.model['propertyValue'] = arrayPropertyVal;
  }

  clear() {
    this.model['propertyValue'] = '';
    this.model['property'] = '';
  }
}
