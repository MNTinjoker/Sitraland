
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LightboxService } from 'src/app/share/lightbox.service';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  EditorConfig,
  Essentials,
  Font,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Image,
  ImageToolbar,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Table,
  TableToolbar,
  TodoList,
  Underline
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
  OptionNgSelected: any;
  OptionNgSelected2: any;
  title: string = "";
  userType: number = 0;
  isShowPhotoGalleryModal: boolean = false;
  editMode: boolean = false;
  productModel: any = {};
  public Editor = ClassicEditor;

  // CKEditor 5 v49 no longer ships pre-built bundles, the editor is composed from its plugins.
  public editorConfig: EditorConfig = {
    licenseKey: 'GPL',
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      BlockQuote,
      RemoveFormat,
      Link,
      List,
      TodoList,
      Table,
      TableToolbar,
      Image,
      ImageToolbar,
      Font,
      FontFamily,
      FontSize,
      Alignment,
      Indent,
      HorizontalLine
    ],
    toolbar: [
      'undo', 'redo', '|',
      'bold', 'italic', 'underline', 'strike', 'code', '|',
      'removeFormat', '|',
      'font', 'fontSize', '|',
      'link', 'unlink', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'blockQuote', '|',
      'insertTable', '|',
      'image', '|',
      'horizontalLine'
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
    this.product.Filename = '';
    this.fileType = '';
    this.fileToUpload = null;
    this.product.Base64 = '';
  }


  handleFileInput() {
    const inputElement = document.getElementById('files') as HTMLInputElement;
    let files: any = inputElement.files;
    let type = files[0]['name'].split('.').pop();
    if (!ValidFormat.includes(type.toLowerCase())) {
      this.utilService.showNotify("فرمت وارد شده معتبر نمی باشد.", "error");
      return;
    }
    this.fileToUpload = files.item(0);
    this.utilService.getBase64(files.item(0)).then((data: any) => {
      let base: any = data;
      this.product.Base64 = base;
      let createdBase = this.product.Base64.split(",");
      this.fileToUpload["base64"] = createdBase[1];
      this.fileToUpload["Name"] = createdBase[1];
      this.product.Filename = this.fileToUpload['name'];
      this.product.Base64 = this.fileToUpload["Name"];
      this.fileType = this.fileToUpload["type"];
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
    if (!this.product.title || !this.product.description || !this.product.categorySelected) {
      this.utilService.showNotify('لطفا همه فیلد هارو پر کنید ', "error");
      this.submit = false;
      return;
    }

    let model = {
      editOrNewId: this.product.productId,
      productName: this.product.title,
      productDescription: this.product.description,
      price: this.product.price,
      count: this.product.count,
      isActive: this.product.isActive ? 1 : 0,
      image: this.product.Base64,
      imageName: this.product.Filename,
      // categoryId: this.product.categorySelected ? this.product.categorySelected.join(',') : '',
      categoryId: this.product.categorySelected,
      extraDetails: this.product.extraDetail,
      imageFolderPath: "",

    }
    try {
      let data = await this.mainService.saveProduct(model).toPromise();
      if (data['data'] == 1) {
        this.utilService.showNotify("با موفقیت ذخیره شد", "success");
        this.router.navigate(['/admin/product-list']);
      }
      else {
        this.utilService.showNotify('خطا', "error");
        this.submit = false;
      }
    } catch (error) {
      this.utilService.showNotify('خطا', "error");
      this.submit = false;
    }
  }

  async getProduct() {
    let data = await this.mainService.getProduct(this.product.productId).toPromise();
    let info = data['data'] ? data['data'][0] : null;
    if (info) {
      this.editMode = true
      this.product.title = info['productName'];
      this.product.price = info['price'];
      this.product.count = info['count'];
      this.product.categorySelected = info['categoryId'];
      this.product.isActive = info['isActive'];
      this.product.description = info['productDescription'];
      this.product.extraDetail = info['extraDetails'];
      this.product.Filename = info['imageFolderPath'];
      this.notShow = true;
    }
  }

  async getProductImage() {
    try {
      let data = await this.mainService.getProductGallery(this.product.productId).toPromise();
      let paths: string[] = data['data'] || [];
      this.productGallery = paths.map((path: string) => ({
        name: path,
        src: this.serverAddress + path,
        isServer: true,
        isVideo: /\.(mp4|m4v|m3u8)$/i.test(path)
      }));
    } catch (error) {
      // this.utilService.showNotify('خطا در دریافت اطلاعات', 'error')

    }
  }

  async saveProductImage() {
    if (this.customGalleryModel.length == 0) {
      this.utilService.showNotify('لطفا عکس مورد نظر را انتخاب کنید', 'error');
      return
    }
    let imageList: any = []
    this.customGalleryModel.forEach((element: { name: any; base64: any; }, index: number) => {
      let listItem: any = {};
      listItem['imageName'] = element.name;
      listItem['image'] = element.base64;
      imageList.push(listItem);
    });

    let model = {
      productId: this.product.productId,
      imageList: imageList
    }
    try {
      let res = await this.mainService.saveProductGallery(model).toPromise();
      if (res['data'] == 1) {
        this.customGalleryModel = [];
        await this.getProductImage();
        this.utilService.showNotify('با موفقیت ذخیره شد', 'success')
      } else {
        this.utilService.showNotify(res['message'] || 'خطا در ذخیره اطلاعات', 'error')
      }
    } catch (error) {
      this.utilService.showNotify('خطا در ذخیره اطلاعات', 'error')

    }
  }
  onSelect(event: { addedFiles: any[]; }) {
    event.addedFiles.forEach((element: { name: any; type: string; }) => {
      let photoModel: any = {};
      photoModel["name"] = element.name;

      this.utilService.getBase64(element).then((data: any) => {
        let base: any = data;
        let createdBase = base.split(",");
        photoModel["base64"] = createdBase[1];
        photoModel["src"] = 'data:' + element.type + ';base64,' + photoModel["base64"];
        photoModel["isVideo"] = element.type.split('/')[0] == 'video' ? true : false;

      });
      this.productGallery.push(photoModel);
      this.customGalleryModel.push(photoModel);

    });

  }



  // async deleteImageProduct(imgId) {
  //   try {
  //     this.utilService.sweetAlert({ message: 'از حذف این عکس مطمئن هستید؟' }).then(async result => {
  //       if (result.value) {
  //         let res = await this.mainService.deleteProductImage(imgId).toPromise();
  //         this.getProductImage();
  //         this.utilService.showNotify('با موفقیت حذف شد', 'success')
  //       }
  //     })
  //   } catch (error) {
  //     this.utilService.showNotify('خطا در ذخیره اطلاعات', 'error')

  //   }
  // }

  showPhotoGalleryModal() {
    this.isShowPhotoGalleryModal = true;
  }

}
