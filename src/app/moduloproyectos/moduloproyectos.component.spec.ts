import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloproyectosComponent } from './moduloproyectos.component';

describe('ModuloproyectosComponent', () => {
  let component: ModuloproyectosComponent;
  let fixture: ComponentFixture<ModuloproyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloproyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloproyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
