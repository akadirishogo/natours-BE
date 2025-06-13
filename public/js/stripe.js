/* eslint-disable */
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51RZISCIVKRBExQBGR7XrjAORCT8UAvOosgpmIW55xntFsNUz8iTxaEhvk2fzJYoD7g425yNfNiZiN4P1UcT8nwTw00oI11oJi1');


export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const res = await fetch(`/api/v1/bookings/checkout-session/${tourId}`);

    if (!res.ok) throw new Error('Failed to fetch checkout session');

    const session = await res.json();

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.message || 'Something went wrong');
  }
};
