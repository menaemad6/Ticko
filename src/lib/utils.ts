
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sendMessageToGemini(message: string): Promise<string> {
  const baseUrl = import.meta.env.VITE_GEMINI_BASE_URL;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error('Gemini API base URL or API key is missing');
  }
  const url = `${baseUrl}?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          { text: message }
        ]
      }
    ]
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }
    const data = await res.json();
    // The response structure may vary; adjust as needed
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return aiText;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return `Error: ${err.message}`;
    }
    return 'Unknown error occurred';
  }
}

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

For create_task and edit_task actions, ALWAYS include:
- title: task title
- description: task description (if the user does not provide one, generate a meaningful description based on the title and context)
- priority: priority level - low/medium/high (infer or set to 'medium' if not provided)
- due_date: due date in YYYY-MM-DD format (infer or leave empty if not provided)
- status: task status - todo/in-progress/done (infer or set to 'todo' if not provided)
- tags: a concise array of 3-5 relevant tags (never more than 5) based on the task's content, e.g., ["work", "meeting"]

For other actions, include all relevant fields if available.

Each action should have:
- action: the action type
- id: task ID (for edit/delete/mark_complete/mark_incomplete/set_priority/set_due_date actions)
- title: task title (for create_task and edit_task)
- description: task description (for create_task and edit_task)
- due_date: due date in YYYY-MM-DD format (optional)
- priority: priority level - low/medium/high (optional)
- status: task status - todo/in-progress/done (optional)
- tags: array of strings (optional, but always include for create_task and edit_task; never more than 5 tags)

Examples:
User: "Create a task to finish the report by Friday"
Response: [{"action": "create_task", "title": "Finish the report", "description": "Complete the final report and submit it to the manager.", "priority": "medium", "due_date": "2024-12-06", "status": "todo", "tags": ["work", "report"]}]

User: "Create a high priority task to call John tomorrow with details"
Response: [{"action": "create_task", "title": "Call John", "description": "Call John and discuss project details.", "priority": "high", "due_date": "2024-12-07", "status": "todo", "tags": ["call", "project"]}]

User: "Mark task abc123 as done"
Response: [{"action": "mark_complete", "id": "abc123"}]

User: "Delete the meeting task and create a new one for the presentation"
Response: [{"action": "delete_task", "id": "meeting_task_id"}, {"action": "create_task", "title": "Presentation preparation", "description": "Prepare slides for the presentation.", "priority": "medium", "due_date": "", "status": "todo", "tags": ["presentation", "slides"]}]

If the input is unrelated to task management or too vague, respond with:
{"message": "Sorry, I couldn't understand the task management request. Please be more specific about what you want to do with your tasks."}

Respond ONLY with valid JSON. Do not include any explanatory text outside the JSON.`;

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  tags?: string[];
}

interface TaskActionResponse {
  action: 'create_task' | 'edit_task' | 'delete_task' | 'mark_complete' | 'mark_incomplete' | 'set_priority' | 'set_due_date' | 'list_tasks';
  id?: string;
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in-progress' | 'done';
  tags?: string[];
}

export async function sendTaskActionsToGemini({ message, existingTasks }: { message: string, existingTasks?: Task[] }): Promise<TaskActionResponse[] | { message: string; raw?: string }> {
  const baseUrl = import.meta.env.VITE_GEMINI_BASE_URL;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error('Gemini API base URL or API key is missing');
  }
  const url = `${baseUrl}?key=${apiKey}`;

  let contextualPrompt = SYSTEM_PROMPT;
  if (existingTasks && existingTasks.length > 0) {
    contextualPrompt += `\n\nCurrent tasks in the system:\n${existingTasks.map((task: Task) =>
      `- ID: ${task.id}, Title: "${task.title}", Status: ${task.status}, Priority: ${task.priority}`
    ).join('\n')}`;
  }

  const body = {
    systemInstruction: {
      parts: [
        { text: contextualPrompt }
      ]
    },
    contents: [
      {
        parts: [
          { text: message }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            action: { type: "string" },
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            due_date: { type: "string" },
            priority: { type: "string" },
            status: { type: "string" },
            tags: { type: "array", items: { type: "string" }, maxItems: 5 }
          },
          required: ["action"],
          propertyOrdering: [
            "action",
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "status",
            "tags"
          ]
        }
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }
    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{"message": "No response generated"}';
    try {
      return JSON.parse(aiText);
    } catch (err) {
      return { message: "Sorry, I couldn't process that request properly.", raw: aiText };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: `Error: ${err.message}` };
    }
    return { message: 'Unknown error occurred' };
  }
}
