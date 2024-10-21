// src/flows.ts
// Pranav Ahluwalia 19/10/2024
// Defining flows for the email automation server

import { Flow } from './types';

export const flows: Flow[] = [
  {
    trigger: 'websiteSignup',
    actions: [
      { type: 'timer', delay: 2 * 60 * 60 * 1000}, // 2 hours time delay - can be changed in future (this is in milliseconds)
      { type: 'email', subject: 'Welcome to our sock store!', body: 'Thank you for signing up...' } // Adding subject & body separately to the email to allow customisation later
    ]
  },
  {
    trigger: 'socksPurchased',
    actions: [
      { type: 'email', subject: 'Payment Received', body: 'Thank you for your purchase...' }, // Any number of actions can be added in both flows to change number and order of emails if needed
      { type: 'email', subject: 'Socks Dispatched', body: 'Your socks are on their way...' }
    ]
  }
];