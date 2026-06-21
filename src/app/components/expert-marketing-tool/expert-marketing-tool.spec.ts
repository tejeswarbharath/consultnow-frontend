import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertMarketingToolComponent } from './expert-marketing-tool';

describe('ExpertMarketingTool', () => {
  let component: ExpertMarketingToolComponent;
  let fixture: ComponentFixture<ExpertMarketingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertMarketingToolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertMarketingToolComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
