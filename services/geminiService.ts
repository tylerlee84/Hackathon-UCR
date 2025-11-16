import { ChatMessage } from '../types';

// The different stages of the onboarding conversation
export type OnboardingState = 'START' | 'AWAITING_STORY' | 'AWAITING_PASSION' | 'AWAITING_ICS' | 'AWAITING_RITUALS' | 'DONE';

// The canned responses for each stage
const responses: Record<OnboardingState, string> = {
    'START': `Initializing sync... I am the Saga Synchronizer. To calibrate your Operator Profile, I need to understand your core objective. 
    
Brief me on your professional status. (e.g., your major, your year, and your career trajectory).`,
    
    'AWAITING_STORY': `Acknowledged. Now, define your primary operational passion. This data is critical. Select your classification:

1.  **Exploratory**: (Evaluating multiple domains)
2.  **Domain-Focused**: (Passionate about your major, exploring applications)
3.  **Industry-Focused**: (e.g., 'Targeting Biotech/Game Design')
4.  **Vector-Specific**: (e.g., 'Objective is Technical Advisor for a VC firm')`,

    'AWAITING_PASSION': `Affirmative. To integrate your directives and deadlines, I require access to your calendar data stream. 
    
Please upload your secure iCal (.ics) file from your primary scheduling platform (e.g., Canvas, Google Calendar).`,

    'AWAITING_ICS': `Data stream locked. Final query: What are your daily operational rituals? 
    
(e.g., 'Physical conditioning for 1 hour,' 'Data ingest for 30 mins,' 'Unit maintenance').`,

    'AWAITING_RITUALS': `Operator Profile calibrated and stored on the network. Your initial 'Active Directives' (your 9-5 schedule) will be compiled by the Saga Core Agent each morning. Welcome, Operator.`,

    'DONE': "I have all the required data, Operator. You are cleared to begin."
};

// A map to determine the next state in the conversation flow
export const nextOnboardingState: Record<OnboardingState, OnboardingState> = {
    'START': 'AWAITING_STORY',
    'AWAITING_STORY': 'AWAITING_PASSION',
    'AWAITING_PASSION': 'AWAITING_ICS',
    'AWAITING_ICS': 'AWAITING_RITUALS',
    'AWAITING_RITUALS': 'DONE',
    'DONE': 'DONE',
};

/**
 * Retrieves the agent's message for a given onboarding state.
 * @param state The current state of the onboarding conversation.
 * @returns A ChatMessage object with the agent's response.
 */
export const getOnboardingResponse = (state: OnboardingState): ChatMessage => {
    return {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: responses[state],
    };
};