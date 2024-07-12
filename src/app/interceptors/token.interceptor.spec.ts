import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenInterceptor } from './token.interceptor';
import { Injectable } from '@angular/core';

describe('TokenInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [TokenInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: TokenInterceptor = TestBed.inject(TokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
