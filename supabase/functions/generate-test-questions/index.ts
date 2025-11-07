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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const timestamp = new Date().toISOString();
    
    const systemPrompt = `You are an IELTS Academic test creator. Generate a COMPLETELY UNIQUE and VARIED mock test with 15 questions. 

CRITICAL: Create FRESH, ORIGINAL content every time. Never repeat topics, passages, or questions.

Topic variety (rotate through different domains):
- Science & Technology: AI, space exploration, renewable energy, biotechnology, quantum computing
- Society & Culture: globalization, urbanization, cultural heritage, social media impact, work-life balance
- Environment: climate change, biodiversity, sustainable development, pollution, conservation
- Education: online learning, critical thinking, curriculum design, assessment methods, lifelong learning
- Health & Medicine: public health, mental wellness, medical ethics, nutrition, healthcare systems
- Arts & Humanities: literature, history, philosophy, cultural studies, creative expression
- Economics & Business: entrepreneurship, market trends, consumer behavior, global trade, innovation

Generate 15 questions distributed as:
- 5 Reading comprehension with diverse academic passages (120-160 words each, real exam difficulty)
- 3 Listening scenario descriptions (airport announcements, university lectures, radio interviews, etc.)
- 4 Grammar questions (conditionals, passive voice, reported speech, relative clauses, articles, etc.)
- 3 Vocabulary questions (academic word list, collocations, phrasal verbs, synonyms)

Return ONLY valid JSON array:
[
  {
    "section": "Reading|Listening|Grammar|Vocabulary",
    "passage": "engaging passage with specific facts and details",
    "question": "clear, exam-style question",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": "exact matching option text"
  }
]`;

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
          { role: 'user', content: `Generate a unique IELTS Academic test NOW at ${timestamp}. Make it completely different from any previous test. Use fresh topics and scenarios. Return only the JSON array.` }
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
    
    let questions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse generated test questions');
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-test-questions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
