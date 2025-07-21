// src/utils/stripe.js
import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

export function getStripe(publishableKey) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}
