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
    const { gameType, count = 3 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompts = {
      "Vocabulary Race": `Generate ${count} unique vocabulary challenge items. Each should include:
- A challenging English word (IELTS level)
- 4 multiple choice options with synonyms/meanings
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "word": "word here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option"
  }
]`,
      "Grammar Battle": `Generate ${count} unique grammar questions for IELTS preparation. Each should include:
- A sentence with a blank to fill
- 4 grammar options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "question": "sentence with blank ___",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option"
  }
]`,
      "Listening Puzzle": `Generate ${count} unique listening comprehension challenges. Each should include:
- A simulated audio transcript scenario
- A clear question about what was heard
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "audio": "Audio transcript description",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option"
  }
]`,
      "Reading Sprint": `Generate ${count} quick reading comprehension questions. Each should include:
- A short passage or fact
- 4 multiple choice options
- The correct answer

Return ONLY valid JSON array format:
[
  {
    "passage": "passage text here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option"
  }
]`
    };

    const systemPrompt = systemPrompts[gameType as keyof typeof systemPrompts] || systemPrompts["Vocabulary Race"];

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
          { role: 'user', content: `Generate ${count} unique ${gameType} game items. Make them varied and realistic for IELTS preparation. Return only the JSON array, no additional text.` }
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
    
    let gameContent;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        gameContent = JSON.parse(jsonMatch[0]);
      } else {
        gameContent = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse generated game content');
    }

    return new Response(JSON.stringify({ gameContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-game-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
