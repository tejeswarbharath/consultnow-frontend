import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDiscoveryComponent } from './expert-discovery.component';

describe('ExpertDiscovery', () => {
  let component: ExpertDiscoveryComponent;
  let fixture: ComponentFixture<ExpertDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDiscoveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertDiscoveryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
