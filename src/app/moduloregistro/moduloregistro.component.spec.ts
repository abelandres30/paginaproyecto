import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloregistroComponent } from './moduloregistro.component';

describe('ModuloregistroComponent', () => {
  let component: ModuloregistroComponent;
  let fixture: ComponentFixture<ModuloregistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloregistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
