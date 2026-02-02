import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-ac', // Using a stable version
    appInfo: {
        name: 'ClassifiedHub',
        version: '0.1.0',
    },
});
