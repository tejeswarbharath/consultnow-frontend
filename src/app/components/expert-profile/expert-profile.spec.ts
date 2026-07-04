import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExpertProfile } from './expert-profile';
import { ExpertService } from '../../services/expert.service';

describe('ExpertProfile', () => {
  let component: ExpertProfile;
  let fixture: ComponentFixture<ExpertProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertProfile, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'test-expert-id',
              },
            },
          },
        },
        ExpertService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpertProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
