// src/types.ts
// Pranav Ahluwalia 19/10/2024
// Types for the email automation server (can be customised easily in future)

export interface Event {
    eventName: string;
    userEmail: string;
}
  
export interface EmailAction {
    type: 'email';
    subject: string;
    body: string;
}
  
export interface TimerAction {
    type: 'timer';
    delay: number;
}
  
export type Action = EmailAction | TimerAction;

export interface Flow {
    trigger: string;
    actions: Action[];
}