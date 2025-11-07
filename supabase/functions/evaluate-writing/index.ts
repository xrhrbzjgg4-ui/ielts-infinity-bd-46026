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
    const { topic, essay, taskType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const wordCount = essay.trim().split(/\s+/).length;

    const systemPrompt = `You are an expert IELTS examiner. Evaluate this IELTS Academic Writing ${taskType === 'task1' ? 'Task 1' : 'Task 2'} essay according to official IELTS criteria.

Return ONLY a valid JSON object with this exact structure:
{
  "overallBand": 7.5,
  "taskAchievement": {
    "score": 7.5,
    "feedback": "Detailed feedback on how well the task requirements were met"
  },
  "coherenceCohesion": {
    "score": 7.5,
    "feedback": "Feedback on organization, paragraphing, and linking devices"
  },
  "lexicalResource": {
    "score": 7.5,
    "feedback": "Feedback on vocabulary range, accuracy, and appropriateness"
  },
  "grammaticalRange": {
    "score": 7.5,
    "feedback": "Feedback on grammar variety, accuracy, and complexity"
  },
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Area for improvement 1", "Area for improvement 2"],
  "wordCount": ${wordCount}
}

Use band scores from 0 to 9 in 0.5 increments. Be specific and constructive in feedback.`;

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
          { role: 'user', content: `Topic: ${topic}\n\nStudent's Essay:\n${essay}\n\nEvaluate this essay now.` }
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
    
    let evaluation;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        evaluation = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evaluate-writing:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
