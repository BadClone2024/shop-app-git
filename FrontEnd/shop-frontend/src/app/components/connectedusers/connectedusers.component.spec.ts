import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedusersComponent } from './connectedusers.component';

describe('ConnectedusersComponent', () => {
  let component: ConnectedusersComponent;
  let fixture: ComponentFixture<ConnectedusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
