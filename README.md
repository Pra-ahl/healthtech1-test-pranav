Hey 👋

I'm Pranav, candidate for the Senior Software Engineer role.

Below you'll find run instructions and my observations for the email automation take home test.


**To get started, run the following commands in the terminal:**

1. git clone <repository-url>
2. cd sock-email-automation
3. npm install
4. npm start (or npm run dev for auto reloading if you change anything in the code)


**To test the email server, here are the commands you'll need to run in a separate terminal:**

1. To test website sign-ups: curl -X POST -H "Content-Type: application/json" -d '{"eventName": "websiteSignup", "userEmail": "test@example.com"}' http://localhost:3000/event

2. To test payments: curl -X POST -H "Content-Type: application/json" -d '{"eventName": "socksPurchased", "userEmail": "test@example.com"}' http://localhost:3000/event

3. To test a non-existent event: curl -X POST -H "Content-Type: application/json" -d '{"eventName": "ILoveHT1", "userEmail": "test@example.com"}' http://localhost:3000/event

You may need to change the port in the server.ts file as well as in the commands above to any other valid port number if you get an error about the port being in use.


**IMPOPRTANT NOTES TO READ BEFORE YOU RUN:**

1. If the website sign up command is sent, the server will wait 2 hrs as per your instruction. Feel free to change this time delay in flows.ts to make testing this faster. But the server is async so it won't block the thread if you send subsequent POST requests.

2. My computer is slow and I noticed that when I press ctrl+c to stop the server and run the command again it takes a while before the server actually starts back up. If this happens to you, just change the port in the server.ts file to 3001 or any other valid port number and it should work.


**Failure cases I've considered**

1. The server might fail to send an email - I've added retry logic. If the send email func fails 3 times in a row, the server will notify an admin of the failure (just printing this for simplicity, but in reality it would connect to your logging or other internal infrastructure)

2. The 2 hr wait could block up the thread - so I've added async logic so that the server won't block the thread if you send subsequent POST requests.


**Tests**

1. Basic testing can be done by running the commands above as well as editing the timer in flows.ts or by editing the sendEmail function to always return false.

2. More in depth testing can be done with the src/server.test.ts file. To do this in a terminal run -  npm test. I've made a test suite that tests for valid events, unknown events and also checks that the flows are correct.






Notes for Pranav for later:
//   test('should retry sending email up to 3 times and notify admin on failure', async () => {
//     (sendEmail as jest.Mock).mockResolvedValue(false);

//     const consoleSpy = jest.spyOn(console, 'log');
//     const emailAction: Action = { type: 'email', subject: 'Test Email', body: 'Test Body' };

//     await executeAction(emailAction, 'test@example.com');

//     expect(sendEmail).toHaveBeenCalledTimes(3);
//     expect(consoleSpy).toHaveBeenCalledWith('3 retries failed, admin pete@ht1 notified.');
//   });