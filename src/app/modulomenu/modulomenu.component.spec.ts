import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulomenuComponent } from './modulomenu.component';

describe('ModulomenuComponent', () => {
  let component: ModulomenuComponent;
  let fixture: ComponentFixture<ModulomenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulomenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulomenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
