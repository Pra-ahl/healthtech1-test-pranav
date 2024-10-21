// src/server.ts
// Pranav Ahluwalia 19/10/2024
// Email automation server

// /*
//  * SERVER SETUP
// */

import express from 'express';
import { Event, Flow, Action, EmailAction } from './types';
import { flows } from './flows';


const app = express();
app.use(express.json());

console.log('Express app created and JSON middleware added.');


// /*
//  * HELPER FUNCTIONS
// */

// Provided email sending func
export const sendEmail = async (): Promise<boolean> => {
  const randomNumber = Math.random();
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced timeout for testing
  return randomNumber < 0.95;
};

// Func to execute actions defined in flows.ts
export const executeAction = async (action: Action, userEmail: string): Promise<boolean> => {
  console.log(`Executing action: ${action.type}`);
  switch (action.type) {
    case 'email':
      let retries = 0;
      let success = false;
      while (retries < 3 && !success) {
        success = await sendEmail();
        if (success) {
          console.log(`Email sent to ${userEmail}: ${action.subject}`);
        } else {
          console.log(`Email failed, retrying (${retries + 1}/3)`);
          retries++;
        }
      }
      if (!success) {
        console.error(`Email failed after 3 retries. Subject: ${action.subject}`);
        console.log('3 retries failed, admin pete@ht1 notified.');
      }
      return success;
    case 'timer':
      console.log(`Waiting for ${action.delay}ms`);
      await new Promise(resolve => setTimeout(resolve, action.delay));
      console.log(`Waited for ${action.delay}ms`);
      return true;
    default:
      console.error(`Unknown action type: ${(action as any).type}`);
      return false;
  }
};

// Func to execute flows defined in flows.ts
export const executeFlow = async (flow: Flow, userEmail: string): Promise<void> => {
  console.log(`Starting flow execution for ${flow.trigger}`);
  for (const action of flow.actions) {
    const success = await executeAction(action, userEmail);
    if (!success) {
      if (action.type === 'email') {
        console.error(`Email failed to send after retries. Subject: ${(action as EmailAction).subject}`);
      } else {
        console.error(`Action failed: ${action.type}`);
      }
    }
  }
  console.log(`Flow execution completed for ${flow.trigger}`);
};


// /*
//  * API
// */
export const eventHandler = async (req: express.Request, res: express.Response) => {
  console.log('Received POST request to /event');
  const event: Event = req.body;
  console.log('Event:', event);
  const matchingFlow = flows.find(flow => flow.trigger === event.eventName);

  if (matchingFlow) {
    console.log(`Matching flow found for event: ${event.eventName}`);
    await executeFlow(matchingFlow, event.userEmail);
    res.status(202).json({ message: 'Event received and flow started' });
  } else {
    console.log(`No matching flow found for event: ${event.eventName}`);
    res.status(404).json({ message: 'No matching flow found for the event' });
  }
};

app.post('/event', eventHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Server setup complete');