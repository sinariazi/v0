# Mood Whisper - Employee Engagement Platform

[... previous content ...]

## Mock Data for Development

For development purposes, we've implemented a mock data solution that allows the app to work without connecting to a real database. This is useful for testing and development when you don't have access to the actual database or want to work offline.

To use the mock data:

1. Ensure that your `NODE_ENV` is not set to 'production' in your `.env.local` file:



## STRIPE
environment variables:

1. `STRIPE_SECRET_KEY`: This is your Stripe secret key, used for server-side operations. It should start with `sk_test_` for test mode or `sk_live_` for live mode.
2. `STRIPE_PUBLISHABLE_KEY`: This is your Stripe publishable key, used for client-side operations. It should start with `pk_test_` for test mode or `pk_live_` for live mode.
3. `STRIPE_WEBHOOK_SECRET`: This is the signing secret for your Stripe webhook. You'll get this when you set up a webhook in your Stripe dashboard.
4. `STRIPE_BASIC_PLAN_PRICE_ID`, `STRIPE_PRO_PLAN_PRICE_ID`, `STRIPE_ENTERPRISE_PLAN_PRICE_ID`: These are the price IDs for your subscription plans in Stripe. You'll need to create these products and prices in your Stripe dashboard and then copy the price IDs here.
5. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: This is the same as `STRIPE_PUBLISHABLE_KEY`, but with the `NEXT_PUBLIC_` prefix so it can be used in client-side code.
6. `NEXT_PUBLIC_APP_URL`: This is the URL of your application. For local development, it's typically `http://localhost:3000`. For production, it would be your actual domain.


Remember to replace the placeholder values (like `sk_test_...`, `pk_test_...`, etc.) with your actual Stripe API keys and price IDs.

Also, make sure to add these new variables to your `.env.local` file for local development, and set them in your deployment environment (like Vercel) for production.

Lastly, don't forget to add `.env` to your `.gitignore` file if it's not already there, to avoid committing sensitive information to your repository.