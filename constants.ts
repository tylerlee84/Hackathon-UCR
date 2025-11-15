import type { Workflow } from './types';
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, CodeBracketIcon, DocumentTextIcon, MagnifyingGlassIcon, UserCircleIcon, Cog6ToothIcon, PaperAirplaneIcon, SparklesIcon, ShareIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import React from 'react';

// NOTE: In a real app, this data would come from an API.
// For this self-contained example, we embed the JSON data here.

const GET_CALENDAR_STATE: Workflow = {
  "name": "Get Calendar State",
  "id": "TCu4MAm8WdraO0tR",
  "nodes": [
    { "parameters": {}, "id": "fbe2fb7b-489c-4a91-9c45-7f7ddfe0e8dd", "name": "Manual Trigger", "type": "n8n-nodes-base.manualTrigger", "typeVersion": 1, "position": [0, 300] },
    { "parameters": { "operation": "getAll", "calendar": "primary", "additionalFields": { "timeMin": "={{$json[\"timeMin\"] || $now}}", "timeMax": "={{$json[\"timeMax\"] || $now.plus({ hours: 720 })}}" } }, "id": "a0c20a54-10e7-4b7e-9c12-1c04a3ec2963", "name": "Google Calendar Events", "type": "n8n-nodes-base.googleCalendar", "typeVersion": 3, "position": [240, 40] },
    { "parameters": { "functionCode": "const results = []\nfor (const item of items) {\n  const event = item.json\n  const start = event.start?.dateTime || event.start?.date || event.created || new Date().toISOString()\n  const end = event.end?.dateTime || event.end?.date || new Date(new Date(start).getTime() + 3600000).toISOString()\n  results.push({ json: { Subject: event.summary || 'Google Event', StartDateTime: new Date(start).toISOString(), EndDateTime: new Date(end).toISOString(), Source: 'Google Calendar' } })\n}\nreturn results" }, "id": "f0082d0f-16bb-4c9a-9390-22f2afe7b01b", "name": "Normalize Google Events", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [520, 40] },
    { "parameters": { "operation": "getAll", "resource": "event", "additionalFields": { "calendarId": "={{$json[\"outlookCalendarId\"] || 'primary'}}" } }, "id": "038037c4-f389-4393-8da5-1cc67debbcb8", "name": "Outlook Events", "type": "n8n-nodes-base.microsoftOutlook", "typeVersion": 1, "position": [240, 200] },
    { "parameters": { "functionCode": "const results = []\nfor (const item of items) {\n  const event = item.json\n  const start = event.start?.dateTime || event.start?.date || new Date().toISOString()\n  const end = event.end?.dateTime || event.end?.date || new Date(new Date(start).getTime() + 3600000).toISOString()\n  results.push({ json: { Subject: event.subject || 'Outlook Event', StartDateTime: new Date(start).toISOString(), EndDateTime: new Date(end).toISOString(), Source: 'Outlook' } })\n}\nreturn results" }, "id": "38b1b46d-8ed7-4b8f-9749-6ae2783f4c3d", "name": "Normalize Outlook Events", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [520, 200] },
    { "parameters": { "requestMethod": "GET", "url": "https://api.todoist.com/rest/v2/tasks", "jsonParameters": true, "options": {}, "headerParametersJson": "={\"Authorization\": \"Bearer {{$json.todoistToken}}\"}" }, "id": "5a245ebe-6b12-4ec4-8a48-528620be66a4", "name": "Todoist Tasks", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [240, 360] },
    { "parameters": { "functionCode": "const results = []\nfor (const item of items) {\n  const event = item.json\n  const start = event.due?.date || event.due?.datetime || new Date().toISOString()\n  const end = event.due?.datetime || new Date(new Date(start).getTime() + 3600000).toISOString()\n  results.push({ json: { Subject: event.content || 'Todoist Task', StartDateTime: new Date(start).toISOString(), EndDateTime: new Date(end).toISOString(), Source: 'Todoist' } })\n}\nreturn results" }, "id": "d6da0d2b-3f7b-4880-8f4f-6aaf220de765", "name": "Normalize Todoist Tasks", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [520, 360] },
    { "parameters": { "requestMethod": "GET", "url": "={{$json[\"canvasBaseUrl\"] || 'https://canvas.instructure.com'}}/api/v1/calendar_events", "jsonParameters": true, "queryParametersJson": "={\"type[]\": [\"assignment\", \"quiz\", \"event\"], \"all_events\": true, \"per_page\": 100, \"context_codes[]\": $json.canvasContextCodes || []}", "options": { "queryParameterArrays": { "enabled": true } }, "headerParametersJson": "={\"Authorization\": \"Bearer {{$json.canvasAccessToken}}\"}" }, "id": "8b1f453f-c238-4e7f-ac33-aea8a7b32b13", "name": "Canvas Events", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [240, 520] },
    { "parameters": { "functionCode": "const results = []\nfor (const item of items) {\n  const event = item.json\n  const rawStart = event.start_at || event.due_at || event.end_at || event.all_day_date || new Date().toISOString()\n  const startDate = new Date(rawStart)\n  const endDate = event.end_at ? new Date(event.end_at) : new Date(startDate.getTime() + 3600000)\n  const title = event.title || event.context_name || 'Canvas Event'\n  results.push({ json: { Subject: title, StartDateTime: startDate.toISOString(), EndDateTime: endDate.toISOString(), Source: 'Canvas' } })\n}\nreturn results" }, "id": "2c4f1b87-8675-4e1c-8760-fac62d45cbe3", "name": "Normalize Canvas Events", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [520, 520] },
    { "parameters": { "mode": "passThrough", "mergeByFields": { "values": [] } }, "id": "88ecf26c-b938-45f7-bbc0-9288a91af824", "name": "Merge Events", "type": "n8n-nodes-base.merge", "typeVersion": 1, "position": [820, 280] },
    { "parameters": {}, "id": "a4d3437f-05f7-4f44-9cf7-34cd4dd8f61a", "name": "Return Events", "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1, "position": [1040, 280] }
  ],
  "connections": {
    "Manual Trigger": { "main": [[{ "node": "Google Calendar Events", "type": "main", "index": 0 }], [{ "node": "Outlook Events", "type": "main", "index": 0 }], [{ "node": "Todoist Tasks", "type": "main", "index": 0 }], [{ "node": "Canvas Events", "type": "main", "index": 0 }]] },
    "Google Calendar Events": { "main": [[{ "node": "Normalize Google Events", "type": "main", "index": 0 }]] },
    "Normalize Google Events": { "main": [[{ "node": "Merge Events", "type": "main", "index": 0 }]] },
    "Outlook Events": { "main": [[{ "node": "Normalize Outlook Events", "type": "main", "index": 0 }]] },
    "Normalize Outlook Events": { "main": [[{ "node": "Merge Events", "type": "main", "index": 1 }]] },
    "Todoist Tasks": { "main": [[{ "node": "Normalize Todoist Tasks", "type": "main", "index": 0 }]] },
    "Normalize Todoist Tasks": { "main": [[{ "node": "Merge Events", "type": "main", "index": 2 }]] },
    "Canvas Events": { "main": [[{ "node": "Normalize Canvas Events", "type": "main", "index": 0 }]] },
    "Normalize Canvas Events": { "main": [[{ "node": "Merge Events", "type": "main", "index": 3 }]] },
    "Merge Events": { "main": [[{ "node": "Return Events", "type": "main", "index": 0 }]] }
  }
};

const TOOL_RESEARCH_AGENT: Workflow = {
  "name": "Tool - Research Agent",
  "id": "tool-research_agent",
  "meta": { "description": "Specialist agent that researches a single topic and returns a Knowledge Packet." },
  "nodes": [
    { "id": "b4e710df-ea6b-4c6e-b32f-9aa1cc3a17bc", "name": "Execute Workflow Trigger", "type": "n8n-nodes-base.executeWorkflowTrigger", "typeVersion": 1, "position": [200, 200], "parameters": { "notes": "Workflow is invoked with { \"topic\": \"...\" }." } },
    { "id": "a2a49d88-52ae-4d43-b49d-cc8fc2d9ab2a", "name": "Google Search", "type": "@n8n/n8n-nodes-langchain.tool", "typeVersion": 1, "position": [200, 20], "parameters": { "toolType": "googleSearch", "description": "Performs Google searches for the research agent." } },
    { "id": "45be137e-7a59-4206-8b54-9a0626d31ed2", "name": "Web Browser", "type": "@n8n/n8n-nodes-langchain.tool", "typeVersion": 1, "position": [400, 20], "parameters": { "toolType": "webBrowser", "description": "Reads a URL and returns topic-focused content for synthesis." } },
    { "id": "45cc0338-8cbb-4dda-bdcc-38223ed4340f", "name": "Research Agent", "type": "@n8n/n8n-nodes-langchain.agent", "typeVersion": 1, "position": [600, 200], "parameters": { "prompt": "..." } }
  ],
  "connections": {
    "Execute Workflow Trigger": { "main": [[{ "node": "Research Agent", "type": "main", "index": 0 }]] },
    "Google Search": { "main": [], "tool": [[{ "node": "Research Agent", "type": "tool", "index": 0 }]] },
    "Web Browser": { "main": [], "tool": [[{ "node": "Research Agent", "type": "tool", "index": 1 }]] }
  }
};

const TOOL_CREATE_CALENDAR_EVENT: Workflow = {
  "name": "tool-create_calendar_event",
  "id": "tool-create_calendar_event",
  "nodes": [
    { "parameters": {}, "id": "2d8adf70-8d26-487b-9a52-353a1a211a6b", "name": "Execute Workflow Trigger", "type": "n8n-nodes-base.executeWorkflowTrigger", "typeVersion": 1, "position": [0, 300] },
    { "parameters": { "keepOnlySet": false, "values": { "string": [{ "name": "user_id", "value": "={{$json.user_id}}" }, { "name": "title", "value": "={{$json.title}}" }, { "name": "start_time_iso", "value": "={{$json.start_time_iso}}" }, { "name": "end_time_iso", "value": "={{$json.end_time_iso}}" }] }, "options": {} }, "id": "4f2acb57-5b55-4a8d-9a4c-f5d52c96a3ce", "name": "Set Event Details", "type": "n8n-nodes-base.set", "typeVersion": 2, "position": [240, 180] },
    { "parameters": { "requestMethod": "GET", "url": "={{$json.userServiceUrl || 'https://example.com/api/users'}}/{{$json.user_id}}", "jsonParameters": true, "options": {} }, "id": "c1941a01-9d72-4b7d-86fa-59da6b343f21", "name": "Get User Profile", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [240, 420] },
    { "parameters": { "mode": "combine", "mergeByFields": { "values": [] } }, "id": "cda250a1-6695-41f4-a011-907275aa9795", "name": "Merge Profile & Event", "type": "n8n-nodes-base.merge", "typeVersion": 2, "position": [520, 300] },
    { "parameters": { "functionCode": "return items.map(item => {\n  const payload = item.json || {}\n  const start = payload.start_time_iso || new Date().toISOString()\n  const end = payload.end_time_iso || new Date(new Date(start).getTime() + 3600000).toISOString()\n  const summary = payload.title || 'Focus Block'\n  return { json: { title: summary, start_time_iso: start, end_time_iso: end, google_auth_token: payload.google_auth_token || payload.googleAuthToken || payload.oauth_token || '', calendarId: payload.calendar_id || 'primary' } }\n})" }, "id": "bf6405ad-9f3d-4067-9bd3-06fe70883ac3", "name": "Prepare Calendar Event", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [760, 300] },
    { "parameters": { "operation": "create", "calendar": "={{$json.calendarId || 'primary'}}", "start": "={{$json.start_time_iso}}", "end": "={{$json.end_time_iso}}", "additionalFields": { "summary": "={{$json.title}}" } }, "id": "0d83d225-d4eb-49a5-ab35-7e2a76fa6919", "name": "Create Google Calendar Event", "type": "n8n-nodes-base.googleCalendar", "typeVersion": 3, "position": [1000, 300] },
    { "parameters": { "functionCode": "return items.map(item => ({ json: { success: true, event_id: item.json.id || item.json.eventId || '' } }))" }, "id": "53b28a55-7b1b-4779-9dcb-d9c5967dfa60", "name": "Format Response", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [1240, 300] }
  ],
  "connections": {
    "Execute Workflow Trigger": { "main": [[{ "node": "Set Event Details", "type": "main", "index": 0 }], [{ "node": "Get User Profile", "type": "main", "index": 0 }]] },
    "Set Event Details": { "main": [[{ "node": "Merge Profile & Event", "type": "main", "index": 0 }]] },
    "Get User Profile": { "main": [[{ "node": "Merge Profile & Event", "type": "main", "index": 1 }]] },
    "Merge Profile & Event": { "main": [[{ "node": "Prepare Calendar Event", "type": "main", "index": 0 }]] },
    "Prepare Calendar Event": { "main": [[{ "node": "Create Google Calendar Event", "type": "main", "index": 0 }]] },
    "Create Google Calendar Event": { "main": [[{ "node": "Format Response", "type": "main", "index": 0 }]] }
  }
};

const TOOL_GET_NEWS: Workflow = {
  "name": "tool-get_news",
  "id": "tool-get_news",
  "nodes": [
    { "parameters": {}, "id": "f6d8b9c7-9a7b-4ce3-9f8e-04f6fd57f1c0", "name": "Execute Workflow Trigger", "type": "n8n-nodes-base.executeWorkflowTrigger", "typeVersion": 1, "position": [0, 300] },
    { "parameters": { "requestMethod": "GET", "url": "https://hn.algolia.com/api/v1/search", "jsonParameters": true, "queryParametersJson": "={\"query\": $json.query || 'technology', \"hitsPerPage\": 5}", "options": {} }, "id": "a15a1551-7a32-44c0-926f-4841a08fb4ba", "name": "Fetch Headlines", "type": "n8n-nodes-base.httpRequest", "typeVersion": 1, "position": [240, 300] },
    { "parameters": { "functionCode": "const articles = []\nfor (const item of items) {\n  const hit = item.json.hits || []\n  for (const story of hit) {\n    if (!story.title && !story.story_title) continue\n    articles.push({ json: { title: story.title || story.story_title, snippet: story.excerpt || story.story_text || story._highlightResult?.title?.value || '', url: story.url || story.story_url || '' } })\n  }\n}\nreturn articles.slice(0, 5)" }, "id": "2ee0f1b4-66b7-4db4-8d4c-34b6f2a5e5fe", "name": "Format News Response", "type": "n8n-nodes-base.code", "typeVersion": 1, "position": [520, 300] }
  ],
  "connections": {
    "Execute Workflow Trigger": { "main": [[{ "node": "Fetch Headlines", "type": "main", "index": 0 }]] },
    "Fetch Headlines": { "main": [[{ "node": "Format News Response", "type": "main", "index": 0 }]] }
  }
};

const AGENT_DAILY_SCHEDULER: Workflow = {
  "name": "Agent - Daily Scheduler",
  "id": "agent-daily-scheduler",
  "nodes": [
    { "parameters": { "triggerTimes": [{ "hour": 5, "minute": 0 }] }, "id": "b6d97a12-1084-420d-a377-0f5482d94c6e", "name": "Daily Kickoff", "type": "n8n-nodes-base.cron", "typeVersion": 1, "position": [0, 0] },
    { "parameters": { "workflowId": "TCu4MAm8WdraO0tR", "options": {} }, "id": "ca7daae8-1cae-47dd-8e19-159889782752", "name": "tool-get_calendar_events", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1, "position": [260, -220] },
    { "parameters": { "workflowId": "tool-create_calendar_event", "options": {} }, "id": "7fd7eebc-7a18-4a83-a2f7-4b26b4f1ee21", "name": "tool-create_calendar_event", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1, "position": [260, -420] },
    { "parameters": { "workflowId": "tool-get_news", "options": {} }, "id": "8f1e7e56-02d4-43cf-98da-8a1999d8e9df", "name": "tool-get_news", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1, "position": [260, -620] },
    { "parameters": { "workflowId": "tool-research_agent", "options": {} }, "id": "c64cf2f4-dedf-4cc3-b51c-05865b20f822", "name": "tool-research_agent", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1, "position": [260, -820] },
    { "parameters": { "agent": "openAiFunctionsAgent", "model": "gpt-4o-mini", "systemMessage": "...", "tools": [{ "name": "tool-get_calendar_events", "type": "workflow", "workflowId": "TCu4MAm8WdraO0tR" }, { "name": "tool-create_calendar_event", "type": "workflow", "workflowId": "tool-create_calendar_event" }, { "name": "tool-get_news", "type": "workflow", "workflowId": "tool-get_news" }, { "name": "tool-research_agent", "type": "workflow", "workflowId": "tool-research_agent" }] }, "id": "7ec0820c-5d37-4c19-8ae0-1ddcb05c2a4f", "name": "Dungeon Master Agent", "type": "@n8n/n8n-nodes-langchain.agent", "typeVersion": 1, "position": [520, 0] },
    { "parameters": { "keepOnlySet": true, "values": { "json": [{ "name": "", "value": [{ "json": { "user_context": { "user_id": "tyler_lee_uci", "user_quadrant": "Hyper-Specific", "passionate_industry": "Biotech, Life Science VC", "specific_goal": "Technical Advisor for Life Science VC firm", "fundamental_question_medium": "Help as many people as possible on a wide-scale level", "ics_link": "https://canvas.uci.edu/...", "google_auth_token": "token_for_tyler" } } }, { "json": { "user_context": { "user_id": "sarah_chen_cal", "user_quadrant": "Passionate Major", "passionate_industry": "Game Design", "specific_goal": "Explore jobs at Riot Games", "fundamental_question_medium": "Build worlds that bring people joy", "ics_link": "https://calendar.google.com/...", "google_auth_token": "token_for_sarah" } } }] }] }, "options": {} }, "id": "88d2f281-e8e6-4e8a-9d0a-9ad85e8750c2", "name": "User Database", "type": "n8n-nodes-base.set", "typeVersion": 2, "position": [260, 0] }
  ],
  "connections": {
    "Daily Kickoff": { "main": [[{ "node": "User Database", "type": "main", "index": 0 }]] },
    "tool-get_calendar_events": { "main": [], "tool": [[{ "node": "Dungeon Master Agent", "type": "tool", "index": 1 }]] },
    "tool-create_calendar_event": { "main": [], "tool": [[{ "node": "Dungeon Master Agent", "type": "tool", "index": 2 }]] },
    "tool-get_news": { "main": [], "tool": [[{ "node": "Dungeon Master Agent", "type": "tool", "index": 3 }]] },
    "tool-research_agent": { "main": [], "tool": [[{ "node": "Dungeon Master Agent", "type": "tool", "index": 4 }]] },
    "User Database": { "main": [[{ "node": "Dungeon Master Agent", "type": "main", "index": 0 }]] }
  }
};

// Simplified workflow for the new Onboarding Agent
const ONBOARDING_AGENT: Workflow = {
    "name": "Agent - Onboarding",
    "id": "agent-onboarding",
    "nodes": [
        { "id": "trigger-onboarding", "name": "API Trigger", "type": "n8n-nodes-base.executeWorkflowTrigger", "typeVersion": 1, "position": [200, 300], "parameters": {} },
        { "id": "chat-tool", "name": "Chat with User", "type": "n8n-nodes-base.wait", "typeVersion": 1, "position": [450, 200], "parameters": {"description": "Sends a message to user and waits for reply"} },
        { "id": "save-profile-tool", "name": "Save User Profile", "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1, "position": [450, 400], "parameters": {"workflowId": "tool-save-user-profile"} },
        { "id": "onboarding-agent-main", "name": "Onboarding Agent", "type": "@n8n/n8n-nodes-langchain.agent", "typeVersion": 1, "position": [700, 300], "parameters": { "prompt": "System Prompt for Onboarding Agent..."} }
    ],
    "connections": {
        "API Trigger": { "main": [[{ "node": "Onboarding Agent", "type": "main", "index": 0 }]] },
        "Chat with User": { "main": [], "tool": [[{ "node": "Onboarding Agent", "type": "tool", "index": 0 }]] },
        "Save User Profile": { "main": [], "tool": [[{ "node": "Onboarding Agent", "type": "tool", "index": 1 }]] }
    }
};


export const WORKFLOWS: Workflow[] = [
  AGENT_DAILY_SCHEDULER,
  GET_CALENDAR_STATE,
  TOOL_RESEARCH_AGENT,
  TOOL_CREATE_CALENDAR_EVENT,
  TOOL_GET_NEWS,
  ONBOARDING_AGENT
];

export const NODE_STYLE_MAP: { [key: string]: { icon: React.FC<any>; color: string } } = {
  'n8n-nodes-base.manualTrigger': { icon: PaperAirplaneIcon, color: 'green' },
  'n8n-nodes-base.cron': { icon: CalendarDaysIcon, color: 'green' },
  'n8n-nodes-base.executeWorkflowTrigger': { icon: PaperAirplaneIcon, color: 'green' },
  'n8n-nodes-base.googleCalendar': { icon: CalendarDaysIcon, color: 'blue' },
  'n8n-nodes-base.microsoftOutlook': { icon: CalendarDaysIcon, color: 'blue' },
  'n8n-nodes-base.httpRequest': { icon: GlobeAltIcon, color: 'blue' },
  'n8n-nodes-base.code': { icon: CodeBracketIcon, color: 'yellow' },
  'n8n-nodes-base.set': { icon: Cog6ToothIcon, color: 'yellow' },
  'n8n-nodes-base.merge': { icon: ShareIcon, color: 'yellow' },
  'n8n-nodes-base.respondToWebhook': { icon: PaperAirplaneIcon, color: 'purple' },
  'n8n-nodes-base.executeWorkflow': { icon: Cog6ToothIcon, color: 'indigo' },
  '@n8n/n8n-nodes-langchain.tool': { icon: MagnifyingGlassIcon, color: 'cyan' },
  '@n8n/n8n-nodes-langchain.agent': { icon: SparklesIcon, color: 'fuchsia' },
// Fix: Add a type for 'n8n-nodes-base.wait' to avoid falling back to default
  'n8n-nodes-base.wait': { icon: ChatBubbleLeftRightIcon, color: 'purple' },
  'default': { icon: Cog6ToothIcon, color: 'gray' },
};