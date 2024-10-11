import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckoutService } from './checkout.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
declare var Stripe: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  stripe: any;
  card: any;
  clientSecret: any;
  isLoading = false;
  errorMessage: string = '';

  constructor(private checkoutService: CheckoutService) {}
  ngOnInit(): void {
    this.stripe = Stripe(
      'pk_test_51NC6jIAOtqVOFTRBVJznLyNVriog4gfNhqEILZ4J85jqKmaRC6ino14d9FOmfXadK9c5uzzjWPiHaOzfhOX7GVF200IqVcuiRS'
    );

    const appearance = {
      theme: 'night',
      variables: {
        fontFamily: 'Sohne, system-ui, sans-serif',
        fontWeightNormal: '500',
        borderRadius: '8px',
        colorBackground: '#0A2540',
        colorPrimary: '#EFC078',
        accessibleColorOnColorPrimary: '#1A1B25',
        colorText: 'white',
        colorTextSecondary: 'white',
        colorTextPlaceholder: '#ABB2BF',
        tabIconColor: 'white',
        logoColor: 'dark',
      },
      rules: {
        '.Input': {
          backgroundColor: '#212D63',
          border: '1px solid var(--colorPrimary)',
        },
      },
    };

    const client = this.clientSecret;
    const elements = this.stripe.elements({ client, appearance });
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async checkout(amount: number) {
    this.isLoading = true;
    let result = await this.checkoutService.checkout(amount);
    this.clientSecret = result.clientSecret;
    this.stripe
      .confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Customer Name',
          },
        },
      })
      .then((result: any) => {
        this.isLoading = false;
        if (result.error) {
          // Show error to your customer
          this.errorMessage = result.error.message;
        } else {
          // The payment succeeded!
          console.log('Payment successful!', result);
        }
      });
  }
}
