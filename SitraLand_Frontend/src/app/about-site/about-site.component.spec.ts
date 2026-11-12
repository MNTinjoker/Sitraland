import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutSiteComponent } from './about-site.component';
import { AboutSiteModule } from './about-site.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('AboutSiteComponent', () => {
  let component: AboutSiteComponent;
  let fixture: ComponentFixture<AboutSiteComponent>;

  beforeEach(async () => {
    configureTestBed(AboutSiteComponent, AboutSiteModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});