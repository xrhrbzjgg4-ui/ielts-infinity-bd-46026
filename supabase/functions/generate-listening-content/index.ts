import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    
    const systemPrompt = `Generate a COMPLETELY UNIQUE IELTS Listening test scenario with transcript and questions.

CRITICAL: Create FRESH, ORIGINAL content every time. Never repeat scenarios, topics, or contexts.

Rotate through diverse IELTS Listening scenarios:
- University contexts: course enrollment, library tour, academic advising, campus facilities, student accommodation
- Travel & Tourism: hotel booking, tour information, flight arrangements, tourist attractions, travel insurance
- Social situations: club membership, community events, volunteer opportunities, sports activities, entertainment venues
- Workplace: job interviews, company orientations, office procedures, team meetings, customer service calls
- Services: bank inquiries, healthcare appointments, home repairs, rental agreements, insurance claims
- Academic lectures: mini-lectures on science, history, technology, environment, social studies

Create natural, conversational English with:
- Specific names, dates, locations, and numbers that listeners must catch
- Natural speech patterns, hesitations, and informal language where appropriate
- Clear information that can be tested through multiple-choice questions
- Realistic details about times, prices, addresses, requirements, etc.

Return ONLY valid JSON:
{
  "transcript": "Natural 220-280 word conversation or monologue with specific details, spoken in a realistic way with varied vocabulary and authentic dialogue patterns",
  "questions": [
    {
      "question": "Clear question testing specific information from transcript",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "Exact matching correct option"
    }
  ]
}

Generate 5 varied questions testing: main ideas, specific details, speaker's opinion, purpose, and inference.`;

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
          { role: 'user', content: `Generate a unique IELTS Listening scenario RIGHT NOW at ${timestamp}. Make it completely different from any previous scenario. Use a fresh context and topic. Return only valid JSON.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let listeningData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        listeningData = JSON.parse(jsonMatch[0]);
      } else {
        listeningData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(listeningData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-listening-content:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
