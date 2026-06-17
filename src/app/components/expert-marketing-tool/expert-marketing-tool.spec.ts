import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertMarketingTool } from './expert-marketing-tool';

describe('ExpertMarketingTool', () => {
  let component: ExpertMarketingTool;
  let fixture: ComponentFixture<ExpertMarketingTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertMarketingTool],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertMarketingTool);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
