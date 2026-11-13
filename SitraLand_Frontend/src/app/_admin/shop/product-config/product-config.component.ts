
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LightboxService } from 'src/app/share/lightbox.service';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import {
  Bold,
  ClassicEditor,
  EditorConfig,
  Essentials,
  Italic,
  Link
} from 'ckeditor5';


export const ValidFormat = ['jpg', 'jpeg', 'png'];

@Component({
  standalone: false,
  selector: 'app-product-config',
  templateUrl: './product-config.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-config.component.css']
})
export class ProductConfigComponent implements OnInit {
  files: any = [];
  constructor
    (
      private changeDetectorRef: ChangeDetectorRef,
      private _lightbox: LightboxService,
      private mainService: MainService,
      private router: Router,
      private activeRoute: ActivatedRoute,
      private utilService: UtilService
    ) {
    this.product.Filename = '';
    this.files = [];
  }

  element: any
  product: any = [];
  categoryHomeList: any = [];
  serverAddress: string = "";
  public album: any = [];
  filePreview: string = "";
  notShow = true;
  fileType: string = "";
  fileToUpload: any;
  submit: boolean = false;
  productId: any;
  merchantList: any = [];
  productCategoryList: any = [];
  customGalleryModel: any = [];
  productGallery: any = [];
  mainImagePath: string = '';
  savingGallery = false;
  OptionNgSelected: any;
  OptionNgSelected2: any;
  title: string = "";
  userType: number = 0;
  isShowPhotoGalleryModal: boolean = false;
  editMode: boolean = false;
  productModel: any = {};
  public Editor = ClassicEditor;

  // CKEditor 5 v49 no longer ships pre-built bundles, the editor is composed from its plugins.
  // Phase 2: the editor of the shop is minimal, only bold, italic and link are needed for a driver.
  public editorConfig: EditorConfig = {
    licenseKey: 'GPL',
    plugins: [
      Essentials,
      Bold,
      Italic,
      Link
    ],
    toolbar: [
      'bold',
      'italic',
      'link'
    ]
  };

  ngOnInit() {
    this.serverAddress = environment.url + '/images/';
    this.product.productId = +this.activeRoute.snapshot.paramMap.get('id');
    this.getCategoriess();
    if (this.product.productId != -1) {
      this.title = "ویرایش محصول";
      this.getProduct();
      this.getProductImage();
    } else {
      this.product.productId = -1;
      this.product.categorySelected = null;
      this.product.isActive = false;
      this.title = "ساخت محصول";
    }

    this.OptionNgSelected = {
      multiple: false,
      tags: false,
    };
    this.OptionNgSelected2 = {
      multiple: false,
      tags: false,
    };
  }


  open(src: any, isVideo = false): void {
    if (src == 1) {
      this.utilService.showNotify('برای مشاهده لطفا ابتدا ذخیره کنید', 'warning');
      return
    }
    if (isVideo) {
      window.open(src, '_blank');

      return
    }
    this.album = [];
    const album = {
      src: src
    }
    this.album.push(album);
    this._lightbox.open(this.album, 0);
  }

  close(): void {
    this._lightbox.close();
  }

  removeFile() {
    this.product.Filename = this.mainImagePath || '';
    this.fileType = '';
    this.fileToUpload = null;
    this.product.Base64 = '';
    this.notShow = true;
  }

  handleFileInput() {
    const inputElement = document.getElementById('files') as HTMLInputElement;
    let files: any = inputElement?.files;
    if (!files || !files[0]) {
      return;
    }
    let type = files[0]['name'].split('.').pop();
    if (!ValidFormat.includes(type.toLowerCase())) {
      this.utilService.showNotify("فرمت وارد شده معتبر نمی باشد.", "error");
      return;
    }
    this.fileToUpload = files.item(0);
    this.utilService.getBase64(files.item(0)).then((data: any) => {
      let base: any = data;
      let createdBase = base.split(",");
      this.fileToUpload["base64"] = createdBase[1];
      this.fileToUpload["Name"] = createdBase[1];
      this.product.Filename = this.fileToUpload['name'];
      this.product.Base64 = this.fileToUpload["base64"];
      this.fileType = this.fileToUpload["type"];
      this.notShow = true;
      this.changeDetectorRef.markForCheck();
    });
  }

  async getCategoriess() {
    let data = await this.mainService.getCategories().toPromise();
    this.categoryHomeList = data['data'];
    this.categoryHomeList.forEach((element) => {
      element.id = element.categoryId;
      element.text = element.categoryTitle;
    });
  }

  // async getHomeCategory() {
  //   let data = await this.mainService.getHomeCategory().toPromise();
  //   this.categoryHomeList = data['data'];
  //   this.categoryHomeList.forEach((element: { id: any; fldPkCategory: any; text: any; fldCategoryTitle: any; }) => {
  //     element.id = element.fldPkCategory;
  //     element.text = element.fldCategoryTitle;
  //   });
  // }

  // async getProductCategory() {
  //   let data = await this.mainService.getProductCategory().toPromise();
  //   this.productCategoryList = data['data'];
  //   this.productCategoryList.forEach((element: { id: any; fldPkCategory: any; text: any; fldCategoryTitle: any; }) => {
  //     element.id = element.fldPkCategory;
  //     element.text = element.fldCategoryTitle;
  //   });
  // }

  async saveProduct() {
    this.submit = true;
    if (!this.product.title || !this.product.description || this.product.categorySelected == null) {
      this.utilService.showNotify('لطفا همه فیلد هارو پر کنید ', "error");
      this.submit = false;
      return;
    }

    // Send a file name with extension for new uploads; for existing saved images no upload is sent.
    const hasNewMainImage = !!this.product.Base64;
    const imageName = hasNewMainImage ? (this.fileToUpload?.name || this.product.Filename) : null;

    let model = {
      editOrNewId: this.product.productId,
      productName: this.product.title,
      productDescription: this.product.description,
      price: this.product.price,
      count: this.product.count,
      isActive: this.product.isActive ? 1 : 0,
      image: hasNewMainImage ? this.product.Base64 : null,
      imageName: imageName,
      // categoryId: this.product.categorySelected ? this.product.categorySelected.join(',') : '',
      categoryId: this.product.categorySelected,
      extraDetails: this.product.extraDetail,
      imageFolderPath: "",

    }
    try {
      let data: any = await this.mainService.saveProduct(model).toPromise();
      if (data && (data['data'] == 1 || data['code'] == 200)) {
        this.utilService.showNotify("با موفقیت ذخیره شد", "success");
        this.router.navigate(['/admin/product-list']);
      }
      else {
        this.utilService.showNotify(data?.['message'] || 'خطا', "error");
        this.submit = false;
      }
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطا', "error");
      this.submit = false;
    }
  }

  // The price of the product is shown with thousand separators and it is saved as a clean number.
  get priceDisplay(): string {
    const value = this.product.price;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const digits = String(value).replace(/[^\d]/g, '');
    if (!digits) {
      return '';
    }
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  onPriceChange(value: any) {
    const digits = String(value ?? '').replace(/[^\d]/g, '');
    this.product.price = digits ? Number(digits) : null;
  }

  async getProduct() {
    try {
      let data: any = await this.mainService.getProduct(this.product.productId).toPromise();
      let info = data && data['data'] ? data['data'][0] : null;
      if (info) {
        this.editMode = true
        this.product.title = info['productName'];
        this.product.price = info['price'];
        this.product.count = info['count'];
        this.product.categorySelected = info['categoryId'];
        this.product.isActive = info['isActive'];
        this.product.description = info['productDescription'];
        this.product.extraDetail = info['extraDetails'];
        this.mainImagePath = info['imageFolderPath'] || '';
        this.product.Filename = this.mainImagePath;
        this.product.Base64 = '';
        this.notShow = true;
      }
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات محصول', 'error');
    }
  }

  async getProductImage() {
    try {
      let data: any = await this.mainService.getProductGallery(this.product.productId).toPromise();
      let paths: string[] = (data && data['data']) ? data['data'] : [];
      const pending = (this.productGallery || []).filter((item: any) => !item.isServer);
      const serverItems = paths.map((path: string) => ({
        name: path.split('/').pop() || path,
        path: path,
        src: this.serverAddress + path,
        isServer: true,
        isVideo: /\.(mp4|m4v|m3u8)$/i.test(path),
        isMain: !!this.mainImagePath && this.mainImagePath === path
      }));
      this.productGallery = [...serverItems, ...pending];
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت گالری تصاویر', 'error');
    }
  }

  async saveProductImage() {
    if (this.customGalleryModel.length == 0) {
      this.utilService.showNotify('لطفا عکس مورد نظر را انتخاب کنید', 'error');
      return
    }
    this.savingGallery = true;
    let imageList: any = []
    this.customGalleryModel.forEach((element: { name: any; base64: any; }) => {
      imageList.push({ imageName: element.name, image: element.base64 });
    });

    let model = {
      productId: this.product.productId,
      imageList: imageList
    }
    try {
      let res: any = await this.mainService.saveProductGallery(model).toPromise();
      if (res && (res['data'] == 1 || res['code'] == 200)) {
        this.customGalleryModel = [];
        await this.getProduct();
        await this.getProductImage();
        this.utilService.showNotify('گالری با موفقیت ذخیره شد', 'success')
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا در ذخیره گالری', 'error')
      }
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطا در ذخیره گالری', 'error')
    } finally {
      this.savingGallery = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  onSelect(event: { addedFiles: any[]; }) {
    event.addedFiles.forEach((element: { name: any; type: string; }) => {
      let photoModel: any = {};
      photoModel["name"] = element.name;
      photoModel["isServer"] = false;

      this.utilService.getBase64(element).then((data: any) => {
        let base: any = data;
        let createdBase = base.split(",");
        photoModel["base64"] = createdBase[1];
        photoModel["src"] = base;
        photoModel["isVideo"] = element.type.split('/')[0] == 'video' ? true : false;
        this.changeDetectorRef.markForCheck();
      });
      this.productGallery.push(photoModel);
      this.customGalleryModel.push(photoModel);
    });
  }

  removePendingGalleryImage(elem: any) {
    this.productGallery = (this.productGallery || []).filter((item: any) => item !== elem);
    this.customGalleryModel = (this.customGalleryModel || []).filter((item: any) => item !== elem);
  }

  async setAsMain(elem: any) {
    if (!elem?.isServer || !elem.path) {
      return;
    }
    try {
      const res: any = await this.mainService.setMainGalleryImage(this.product.productId, elem.path).toPromise();
      if (res && (res['data'] == 1 || res['code'] == 200)) {
        this.mainImagePath = elem.path;
        this.product.Filename = this.mainImagePath;
        this.product.Base64 = '';
        this.notShow = true;
        await this.getProduct();
        await this.getProductImage();
        this.utilService.showNotify('عکس اصلی محصول تنظیم شد', 'success');
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا در تنظیم عکس اصلی', 'error');
      }
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطا در تنظیم عکس اصلی', 'error');
    }
  }

  async deleteGalleryImage(elem: any) {
    if (!elem?.isServer || !elem.path) {
      return;
    }
    const confirm = await this.utilService.sweetAlert({ message: 'از حذف این عکس مطمئن هستید؟' });
    if (!confirm || !confirm.value) {
      return;
    }
    try {
      const res: any = await this.mainService.deleteProductGalleryImage(this.product.productId, elem.path).toPromise();
      if (res && (res['data'] == 1 || res['code'] == 200)) {
        await this.getProduct();
        await this.getProductImage();
        this.utilService.showNotify('عکس حذف شد', 'success');
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا در حذف عکس', 'error');
      }
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطا در حذف عکس', 'error');
    }
  }

  showPhotoGalleryModal() {
    this.isShowPhotoGalleryModal = true;
  }

}
