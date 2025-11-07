import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { module, count = 5 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompts = {
      Reading: `You are an IELTS Academic Reading test generator. Generate ${count} unique reading comprehension questions with passages. Each question should include:
- A realistic passage (100-150 words) on academic topics
- A clear question about the passage
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "passage": "passage text here",
    "question": "question text here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option text"
  }
]`,
      Listening: `You are an IELTS Listening test generator. Generate ${count} unique listening comprehension questions. Each question should include:
- A simulated audio transcript/description
- A clear question
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "passage": "You would hear: 'transcript here'",
    "question": "question text here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option text"
  }
]`,
      Writing: `You are an IELTS Writing task analyzer. Generate ${count} unique writing task questions focused on essay structure and planning. Each should include:
- A realistic IELTS writing prompt
- A question about approach/structure
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "passage": "Essay prompt: prompt text here",
    "question": "question about structure/approach",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option text"
  }
]`,
      Speaking: `You are an IELTS Speaking test generator. Generate ${count} unique speaking task questions. Each should include:
- A speaking topic/prompt
- A question about response strategy
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "passage": "Topic: topic description",
    "question": "question about response strategy",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option text"
  }
]`
    };

    const systemPrompt = systemPrompts[module as keyof typeof systemPrompts] || systemPrompts.Reading;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${count} unique ${module} practice questions for IELTS. Make them varied and realistic. Return only the JSON array, no additional text.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let questions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse generated questions');
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-practice-questions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
