import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('asdasdasd'); // pass stripe public key here

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`http://127.0.0.1/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Use stripe object to automatically create the checkout form + charge the credit card
    await stripe.redirectToCheckout({sessionId: session.data.session.id});

  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
