import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, of } from 'rxjs';

export const activatedRouteStub = {
  snapshot: {
    queryParams: {},
    queryParamMap: convertToParamMap({}),
    paramMap: convertToParamMap({}),
    url: []
  },
  queryParams: of({}) as Observable<any>,
  queryParamMap: of(convertToParamMap({})) as Observable<any>,
  paramMap: of(convertToParamMap({})) as Observable<any>,
  url: of([])
};

export const notifierStub = {
  notify: () => { },
  show: () => { },
  hide: () => { },
  hideAll: () => { }
};

/**
 * Configures the TestBed for the components of the application: the HTTP client is
 * replaced by the testing backend, the router is stubbed and the template of the
 * component under test is not rendered so that its child components are not needed.
 *
 * The module that declares the component has to be imported as well, otherwise the
 * template of the component is compiled without the directives it relies on.
 */
export function configureTestBed(component: Type<unknown>, module: Type<unknown>): void {
  TestBed.configureTestingModule({
    imports: [module],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ActivatedRoute, useValue: activatedRouteStub },
      { provide: NotifierService, useValue: notifierStub }
    ]
  })
    .overrideComponent(component, { set: { template: '' } });
}
