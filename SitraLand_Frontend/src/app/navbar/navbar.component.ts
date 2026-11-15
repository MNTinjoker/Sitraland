import { ChangeDetectorRef, HostListener, Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { SiteBrandingService } from '../services/site-branding.service';
import { UtilService } from '../services/util.service';
// import { UtilService } from '../../_services/util.service';
// import { CookieService } from 'ngx-cookie-service';
// import { MainService } from '../../_services/main.service';
// import { NotifyService } from '../../_services/notify.service';
// import swal from "sweetalert2";
// import { UserService } from '../../_services/user.service';
// import { LMSService } from '../../_services/lms.service';
// import { Subscription, timer } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import * as moment from "jalali-moment";
// import { TicketService } from './../../ticket/ticket.service';
// import { version } from '../../../../package.json';

export interface imenu {
  text: string;
  link: string;
}

export const AdminMenu: imenu[] = [
  { text: ' محصولات', link: '/admin/product-list' },
  { text: 'سفارشات', link: '/admin/orders-report' },
  { text: 'مدیریت کاربران', link: '/admin/user-managment' },
  { text: 'تنظیمات سایت', link: '/admin/site-settings' },
];


declare var $: any;

@Component({
  standalone: false,
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  isAdmin = false;
  logo: string = '../../assets/images/navbar-logo.webp';
  innerWidth = window.innerWidth;
  showNav: boolean = true;
  showAdminSiderBar: boolean = false;
  sidebarList: any = [];
  userMenu = [
    "/",
    "/home",
    "/product-cartegory",
    "/footer",
    "/basket",
    "/checkout-shop",
    "/about-site",
  ];
  userMenuWithId = [
    /^\/product-detail\/[0-9]*$/,
    /^\/product-cartegory\/[0-9]*$/,
    /^\/order-detail\/[0-9]*$/,
    /^\/about-site\/[0-9]*$/,
  ]
  withOutMenu = ['/signup', '/login'];




  // showStudentsForTeacher = false;
  // userPhone;
  // model: any = {};
  // disableNext: boolean = false;
  // usertype;

  // userID;
  // notSeen: number;
  // phoneCons;
  // tellphoneCons;
  // Option = {
  //   multiple: false,
  //   tags: false,
  // };
  userName = 'مهمان'
  cartCount = 0
  private cartSub?: Subscription;
  private brandingSub?: Subscription;
  private navResizeObserver?: ResizeObserver;


  @HostListener("window:resize", ["$event.target"])
  onResize(event: any) {
    let wid = event.window.innerWidth;
    let sidebar = document.getElementById("sidebar");
    let sidebarAdmin = document.getElementById("sidebar-admin");
    let sidebarOperator = document.getElementById("sidebar-operator");
    let hamburger1 = document.getElementById("hamburger-1");
    let footerD = document.getElementById("footerD");

    if (wid && wid < 1025) {
      sidebar?.classList.add("hideSidebar");
      sidebarAdmin?.classList.add("hideSidebar");
      sidebarOperator?.classList.add("hideSidebar");
      hamburger1?.classList.remove("d-none");
      hamburger1?.classList.add("d-block");
    hamburger1?.classList.add("hamburger");
      document.body.classList.remove("overflow-hidden");
    } else {
      this.hamburgerClick();
    }
    window.setTimeout(() => this.measureNavHeight(), 0);
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private utilService: UtilService,
    private cartService: CartService,
    private brandingService: SiteBrandingService
  ) {
    this.router.events.subscribe((e) => {
      // Keep the user/admin menu state in sync with the current page.
      this.chcekUser();
      this.seeUserMenu();
      this.changeDetectorRef.markForCheck();
      if (e instanceof NavigationEnd) {
        window.setTimeout(() => this.measureNavHeight(), 0);
      }
    });
  }


  ngOnInit() {
    this.chcekUser();
    this.checkScreen();
    this.sidebarList = AdminMenu;
    this.seeUserMenu();

    // The cart badge is shared, so it updates without a page navigation.
    this.cartSub = this.cartService.count$.subscribe(count => {
      this.cartCount = count;
      this.changeDetectorRef.markForCheck();
    });

    this.brandingSub = this.brandingService.settings$.subscribe(settings => {
      this.logo = this.brandingService.imageUrl(settings?.['navbarLogo'] || settings?.['siteLogo'], '../../assets/images/navbar-logo.webp');
      this.changeDetectorRef.markForCheck();
    });
    this.brandingService.ensureLoaded();
  }

  ngAfterViewInit(): void {
    this.measureNavHeight();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    this.brandingSub?.unsubscribe();
    this.navResizeObserver?.disconnect();
  }

  /**
   * The top bar is positioned with "fixed", so every element that has to sit
   * right below it (the admin toolbar) needs its real height. The height is not
   * constant: the logo and the search box decide it and they change with the
   * viewport, so it is measured and published as a CSS variable.
   */
  private measureNavHeight() {
    const nav = document.getElementById('nav');
    if (!nav) {
      return;
    }

    const apply = () => {
      const height = Math.round(nav.getBoundingClientRect().height);
      if (height > 0) {
        document.documentElement.style.setProperty('--sitra-nav-height', `${height}px`);
      }
    };

    apply();

    if (typeof ResizeObserver !== 'undefined') {
      this.navResizeObserver?.disconnect();
      this.navResizeObserver = new ResizeObserver(apply);
      this.navResizeObserver.observe(nav);
    }

    // The logo arrives after the first paint and can change the bar height.
    window.setTimeout(apply, 250);
  }

  hamburgerClick2() {
    let sidebar = document.getElementById("sidebar");
    let sidebarAdmin = document.getElementById("sidebar-admin");
    let sidebarOperator = document.getElementById("sidebar-operator");
    sidebar?.classList.toggle("hideSidebar");
    sidebarAdmin?.classList.toggle("hideSidebar");
    sidebarOperator?.classList.toggle("hideSidebar");
  }

  searchTerm: string = '';

  search(term: string) {
    const value = (term ?? '').trim();
    this.searchTerm = value;
    if (!value) {
      this.router.navigate(['/product-cartegory']);
      return;
    }
    this.router.navigate(['/product-cartegory'], { queryParams: { search: value } });
  }

  goToAdminPage() {
    this.showAdminSiderBar = true;
    this.handleClick();
    const url = location.pathname.split('?')[0];
    if (!url.startsWith('/admin')) {
      this.router.navigate(['/admin/product-list']);
    }
  }

  handleClick() {
    if (window.innerWidth && window.innerWidth < 1025) {
      let sidebar = document.getElementById("sidebar");
      let hamburger1 = document.getElementById("hamburger-1");
      sidebar?.classList.add("hideSidebar");
      hamburger1?.classList.remove("d-none");
      hamburger1?.classList.add("d-block");
      document.body.classList.remove("overflow-hidden");
    }
  }

  hamburgerClick() {
    let sidebar = document.getElementById("sidebar");
    let sidebarAdmin = document.getElementById("sidebar-admin");
    let sidebarOperator = document.getElementById("sidebar-operator");
    let hamburger1 = document.getElementById("hamburger-1");
    sidebar?.classList.remove("hideSidebar");
    sidebarAdmin?.classList.remove("hideSidebar");
    sidebarOperator?.classList.remove("hideSidebar");
    hamburger1?.classList.remove("d-block");
    hamburger1?.classList.add("d-none");
  }

  checkScreen() {
    let sidebar = document.getElementById("sidebar");
    let sidebarAdmin = document.getElementById("sidebar-admin");
    let hamburger1 = document.getElementById("hamburger-1");
    if (this.innerWidth && this.innerWidth < 1025) {
      sidebar?.classList.add("hideSidebar");
      sidebarAdmin?.classList.add("hideSidebar");
      hamburger1?.classList.remove("d-none");
      hamburger1?.classList.add("d-block");
      this.showNav = false;
    } else {
      sidebar?.classList.remove("hideSidebar");
      sidebarAdmin?.classList.remove("hideSidebar");
      hamburger1?.classList.remove("d-block");
      hamburger1?.classList.add("d-none");
      this.showNav = true;
    }
    return true;
  }

  closeAfterClick() {
    let sidebarAdmin = document.getElementById("sidebar-admin");
    let hamburger1 = document.getElementById("hamburger-1");
    if (this.innerWidth && this.innerWidth < 1024) {
      sidebarAdmin?.classList.add("hideSidebar");
      hamburger1?.classList.remove("d-none");
      hamburger1?.classList.add("d-block");
    } else {
      return;
    }
  }

  seeUserMenu() {
    const url = location.pathname.split("?")[0];
    // Always show admin navigation on admin routes for admin users.
    if (url.startsWith('/admin')) {
      this.showAdminSiderBar = this.isAdmin || localStorage.getItem('isAdmin') === '1';
      this.isAdmin = localStorage.getItem('isAdmin') === '1';
      return;
    }
    if (
      this.userMenu.includes(url) ||
      this.userMenuWithId.find((x) => x.test(url))
    ) {
      this.showAdminSiderBar = false;
    } else {
      this.showAdminSiderBar = localStorage.getItem('isAdmin') === '1';
    }
  }

  notSeeMenu() {
    let url = location.pathname.split("?")[0];
    if (this.withOutMenu.includes(url)) {
      return true;
    }
    return false;
  }

  chcekUser() {
    if (localStorage.getItem('isAdmin') == '1') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    if (localStorage.getItem('userName') != null) {
      this.userName = localStorage.getItem('userName');
    }
  }

  logOut() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    this.userName = 'مهمان';
    this.isAdmin = false;
    this.cartCount = 0;

    this.router.navigate(['/home']);
  }

  //   let tamShopUrl = location.pathname.split("?")[0];
  //   if (
  //     tamShopUrl.startsWith("/tamshop") ||
  //     tamShopUrl.startsWith("/orders-list") ||
  //     tamShopUrl.startsWith("/product-category") ||
  //     tamShopUrl.startsWith("/product-detail") ||
  //     tamShopUrl.startsWith("/checkout-shop")
  //   ) {
  //     this.tamShopMenu = true;
  //   } else {
  //     this.tamShopMenu = false;
  //   }
  //   if (
  //     location.pathname.split("?")[0].startsWith("/order-detail") &&
  //     this.utilService.checkUserType() != 2 &&
  //     this.utilService.checkUserType() != 12 &&
  //     this.utilService.checkUserType() != 22
  //   ) {
  //     this.tamShopMenu = false;
  //   }


  //   this.logoInLivePage = window.location.pathname.startsWith("/live");
  //   this.LMSService.coinSubject.subscribe((value) => {
  //     this.tamCoin = value;
  //   });

  //   this.LMSService.walletSubject.subscribe((value) => {
  //     this.money = value;
  //   });

  //   this.LMSService.giftSubject.subscribe((value) => {
  //     this.giftCardPrice = value;
  //   });

  //   this.mainService.avatarPicture.subscribe((value) => {
  //     this.model.avatar = value;
  //   });

  //   this.ticketService.hasNotseenTicket.subscribe((value) => {
  //     this.hasNotSeenTicket = value;
  //   });

  //   this.usertype = this.utilService.checkUserType();
  //   this.userID = localStorage.getItem("operatorUser");
  //   this.adminMenu = AdminMenu.filter((x) =>
  //     x.roleAccess.includes(this.usertype)
  //   );
  //   this.crmMenu = crmMenu.filter((x) => x.roleAccess.includes(this.usertype));

  //   let name = localStorage.getItem("username");

  //   this.userPhone = name;
  //   if (name == "null" || !name) {
  //     this.userPhone = localStorage.getItem("mobile");
  //   }

  //   if (
  //     window.location.pathname.startsWith("/operator") &&
  //     this.userID !== null
  //   ) {
  //     this.inOperator = true;
  //     this.getUserInfoOperator();
  //     this.getUserMoreInfo(+this.userID);
  //   } else {
  //     this.getUserInfo();
  //     localStorage.setItem("operator", null);
  //     this.inOperator = false;
  //   }

  //   this.isAdmin =
  //     this.usertype != 2 && this.usertype != 12 && this.usertype != 22;
  //   const role = +this.utilService.checkUserType();
  //   this.showCrmList = [1, 5, 8, 9, 10, 11, 13, 15, 20, 21].includes(role)
  //     ? true
  //     : null;
  //   this.isOperator = [1, 3, 5, 10, 13, 20, 21].includes(role);
  //   this.ticketAdmins = [1, 8, 9, 10, 11, 13, 15, 20, 21, 26, 28].includes(
  //     role
  //   );
  //   this.utilService.checkBasketNumber();
  //   if (this.usertype == 8) {
  //     this.consultantReport();
  //   }
  //   this.getSchoolUrl();
  // }


  // async logOut() {
  //   let url = "/";
  //   let adminInfo = localStorage.getItem("adminInfo");
  //   let token = localStorage.getItem("token");

  //   try {
  //     if (!adminInfo) {
  //       url = this.logOutUrl;
  //       let model = {
  //         Token: token,
  //       };
  //       await this.userService.signout(model).toPromise();
  //       localStorage.setItem("showIpModal", "2");
  //     } else {
  //     }
  //   } catch (error) {
  //     console.assert(error);
  //   } finally {
  //     localStorage.removeItem("secret");
  //     localStorage.removeItem("schoolId");
  //     localStorage.removeItem("operator");
  //     localStorage.removeItem("jwt");
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("regionId");
  //     localStorage.removeItem("mobile");
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("operatorUser");
  //     localStorage.removeItem("fullname");
  //     sessionStorage.clear();
  //     this.cookieService.deleteAll();
  //     if (adminInfo) {
  //       let info = JSON.parse(adminInfo);
  //       localStorage.setItem("token", info.token);
  //       localStorage.setItem("jwt", info.jwt);
  //       localStorage.setItem("mobile", info.mobile);
  //       localStorage.setItem("schoolId", info.schoolId);
  //       localStorage.setItem("secret", info.secret);
  //       localStorage.removeItem("adminInfo");
  //     }
  //     this.router.navigate([url]);
  //   }
  // }



  // notSeeMenu() {
  //   if (!this.isAdmin) {
  //     return true;
  //   }
  //   let url = location.pathname.split("?")[0];
  //   if (
  //     this.withOutMenu.includes(url) ||
  //     url.startsWith("/result") ||
  //     url.startsWith("/landing")
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }



  // goftino() {
  //   var frame = document.getElementById("goftino_w");
  //   if (frame) {
  //     frame["contentWindow"].document.getElementById("box-widget-icon").click();
  //   }
  // }

  // hideGoftino() {
  //   setTimeout(() => {
  //     var frame = document.getElementById("goftino_w");
  //     if (
  //       frame &&
  //       frame["contentWindow"].document.getElementById("box-widget-icon")
  //     ) {
  //       frame["contentWindow"].document.getElementById(
  //         "box-widget-icon"
  //       ).style.display = "none";
  //     }
  //   }, 1500);
  // }



}
