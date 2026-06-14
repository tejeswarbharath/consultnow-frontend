import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDiscovery } from './expert-discovery';

describe('ExpertDiscovery', () => {
  let component: ExpertDiscovery;
  let fixture: ComponentFixture<ExpertDiscovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertDiscovery],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertDiscovery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
