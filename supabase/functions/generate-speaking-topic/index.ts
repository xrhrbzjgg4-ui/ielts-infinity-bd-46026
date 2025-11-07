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
    const { part } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const timestamp = Date.now();
    let systemPrompt = '';
    
    if (part === 'part1') {
      systemPrompt = `Generate a UNIQUE and VARIED IELTS Speaking Part 1 topic. Return ONLY a valid JSON object:
{
  "part": "part1",
  "topic": "Topic name",
  "questions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?"],
  "timeLimit": 5,
  "instructions": "Answer questions about familiar topics"
}

IMPORTANT: Generate a DIFFERENT topic each time. Choose randomly from topics like:
- Hometown, Neighborhood, Accommodation
- Family, Friends, Relationships
- Work, Studies, Career aspirations
- Hobbies, Free time activities, Sports
- Food, Cooking, Eating habits
- Technology, Social media, Internet usage
- Travel, Transportation, Daily commute
- Shopping, Fashion, Personal style
- Weather, Seasons, Climate
- Music, Movies, Entertainment
- Pets, Animals, Nature
- Reading, Books, News
- Health, Exercise, Lifestyle
- Holidays, Celebrations, Traditions
- Art, Museums, Cultural activities

Generate 4 simple, personal questions about the chosen topic. Make it unique and different from: "Daily Routine".`;
    } else if (part === 'part2') {
      systemPrompt = `Generate a UNIQUE and VARIED IELTS Speaking Part 2 cue card. Return ONLY a valid JSON object:
{
  "part": "part2",
  "topic": "Describe...",
  "prompts": ["You should say:", "- Point 1", "- Point 2", "- Point 3", "And explain..."],
  "timeLimit": 2,
  "preparationTime": 1,
  "instructions": "You have 1 minute to prepare. Speak for 2 minutes."
}

IMPORTANT: Generate a DIFFERENT topic each time. Choose randomly from categories like:
- A memorable person (teacher, friend, family member, role model)
- A special place (building, city, natural location, childhood place)
- An important object (gift, possession, technology item)
- A memorable event (celebration, achievement, challenge, journey)
- A skill or hobby (learning experience, talent, interest)
- A decision or change (life choice, moving, career change)
- A piece of media (book, film, song, advertisement)
- A time period (childhood memory, recent experience, future plan)

Create appropriate prompts with specific bullet points for the chosen topic.`;
    } else {
      systemPrompt = `Generate UNIQUE and VARIED IELTS Speaking Part 3 discussion questions. Return ONLY a valid JSON object:
{
  "part": "part3",
  "topic": "Abstract discussion topic",
  "questions": ["Deep question 1?", "Deep question 2?", "Deep question 3?"],
  "timeLimit": 5,
  "instructions": "Discuss abstract ideas and give detailed opinions"
}

IMPORTANT: Generate a DIFFERENT topic each time. Choose randomly from abstract themes like:
- Technology and society, Digital transformation, AI impact
- Education systems, Learning methods, Skills for future
- Environmental issues, Sustainability, Climate action
- Work-life balance, Career choices, Job satisfaction
- Cultural differences, Globalization, Traditions vs modernity
- Health and lifestyle, Public health, Mental wellness
- Urban vs rural living, City development, Community
- Media influence, Social media impact, Information access
- Economic changes, Consumer behavior, Financial literacy
- Family structures, Parenting, Generational differences
- Arts and creativity, Cultural preservation, Entertainment
- Social issues, Equality, Community responsibility

Generate 3 thought-provoking, analytical questions about the chosen theme.`;
    }

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
          { role: 'user', content: `Generate unique IELTS Speaking ${part} content now. Timestamp: ${timestamp}. Make it completely different from previous generations.` }
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
    
    let speakingData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        speakingData = JSON.parse(jsonMatch[0]);
      } else {
        speakingData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(speakingData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-speaking-topic:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
