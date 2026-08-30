import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAlt } from './footer-alt';

describe('FooterAlt', () => {
  let component: FooterAlt;
  let fixture: ComponentFixture<FooterAlt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterAlt],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterAlt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
