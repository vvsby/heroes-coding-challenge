import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStageComponent } from './main-stage.component';

describe('MainStageComponent', () => {
  let component: MainStageComponent;
  let fixture: ComponentFixture<MainStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
