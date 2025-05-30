
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a smart task assistant. Users will ask you to manage their tasks through natural language. Your job is to extract structured actions from their messages and respond ONLY in JSON format.

Supported actions:
- create_task: Create a new task
- edit_task: Modify an existing task (requires task ID)
- delete_task: Remove a task (requires task ID)
- list_tasks: Show all tasks
- mark_complete: Mark task as done (requires task ID)
- mark_incomplete: Mark task as todo or in-progress (requires task ID)
- set_priority: Change task priority (requires task ID)
- set_due_date: Set or change due date (requires task ID)

Each action should have:
- action: the action type
- id: task ID (for edit/delete/mark_complete/mark_incomplete/set_priority/set_due_date actions)
- title: task title (for create_task and edit_task)
- description: task description (optional)
- due_date: due date in YYYY-MM-DD format (optional)
- priority: priority level - low/medium/high (optional)
- status: task status - todo/in-progress/done (optional)

Examples:
User: "Create a task to finish the report by Friday"
Response: [{"action": "create_task", "title": "Finish the report", "due_date": "2024-12-06"}]

User: "Mark task abc123 as done"
Response: [{"action": "mark_complete", "id": "abc123"}]

User: "Delete the meeting task and create a new one for the presentation"
Response: [{"action": "delete_task", "id": "meeting_task_id"}, {"action": "create_task", "title": "Presentation preparation"}]

If the input is unrelated to task management or too vague, respond with:
{"message": "Sorry, I couldn't understand the task management request. Please be more specific about what you want to do with your tasks."}

Respond ONLY with valid JSON. Do not include any explanatory text outside the JSON.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, existingTasks } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Include context about existing tasks if provided
    let contextualPrompt = SYSTEM_PROMPT;
    if (existingTasks && existingTasks.length > 0) {
      contextualPrompt += `\n\nCurrent tasks in the system:\n${existingTasks.map((task: any) => 
        `- ID: ${task.id}, Title: "${task.title}", Status: ${task.status}, Priority: ${task.priority}`
      ).join('\n')}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${contextualPrompt}\n\nUser message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"message": "No response generated"}';

    // Try to parse the response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      parsedResponse = { "message": "Sorry, I couldn't process that request properly." };
    }

    return new Response(JSON.stringify({ response: parsedResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-task-actions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
