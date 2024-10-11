import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  async checkout(amount: number) {
    return firstValueFrom(
      this.http.post<ResponseModel>(`http://localhost:5000/api/checkout`, {
        price: amount,
      })
    );
  }
}

export type ResponseModel = { clientSecret: string; publishableKey: string };
