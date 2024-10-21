// src/server.test.ts
// Pranav Ahluwalia 19/10/2024
// Tests for Email automation server

// /*
//  * IMPORTS AND MOCK SERVER SETUP
// */

import request from 'supertest';
import express from 'express';
import { flows } from './flows';
import { Event, Flow, Action } from './types';
import { eventHandler, sendEmail, executeAction, executeFlow } from './server';

jest.mock('./server', () => {
  const originalModule = jest.requireActual('./server');
  return {
    ...originalModule,
    sendEmail: jest.fn(), // mock function for send email so I can control the returned value in my test cases below
  };
});

const app = express();
app.use(express.json());
app.post('/event', eventHandler);

// /*
//  * TEST SUITE
// */

describe('Event API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should accept a valid event and start the flow', async () => {
    (sendEmail as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .post('/event')
      .send({ eventName: 'websiteSignup', userEmail: 'test@example.com' });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe('Event received and flow started');
  }, 10000);

  test('should return 404 for an unknown event', async () => {
    const response = await request(app)
      .post('/event')
      .send({ eventName: 'unknownEvent', userEmail: 'test@example.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No matching flow found for the event');
  });


  // These tests below will need to be customised if the actions in the flows are changed

  test('websiteSignup flow should have correct actions', () => {
    const signupFlow = flows.find(flow => flow.trigger === 'websiteSignup');
    expect(signupFlow).toBeDefined();
    expect(signupFlow?.actions.length).toBe(2);
    expect(signupFlow?.actions[0].type).toBe('timer');
    expect(signupFlow?.actions[1].type).toBe('email');
  });

  test('socksPurchased flow should have correct actions', () => {
    const purchaseFlow = flows.find(flow => flow.trigger === 'socksPurchased');
    expect(purchaseFlow).toBeDefined();
    expect(purchaseFlow?.actions.length).toBe(2);
    expect(purchaseFlow?.actions[0].type).toBe('email');
    expect(purchaseFlow?.actions[1].type).toBe('email');
  });
});