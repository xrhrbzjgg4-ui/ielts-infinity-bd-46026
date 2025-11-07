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
    const { taskType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const timestamp = new Date().toISOString();

    const systemPrompt = taskType === 'task1' 
      ? `Generate a COMPLETELY UNIQUE IELTS Academic Writing Task 1 topic. 

CRITICAL: Create FRESH content every single time. Never repeat the same chart type, data, or subject matter consecutively.

Rotate through diverse chart types and topics:
- Line graphs: population trends, economic indicators, climate data, website traffic, enrollment numbers
- Bar charts: sales comparisons, survey results, demographic data, energy consumption, education statistics  
- Pie charts: budget allocation, market share, time management, resource distribution, voting patterns
- Tables: comparative data across countries/years, scientific measurements, transport statistics
- Process diagrams: manufacturing, water cycle, product lifecycle, recycling process, food production
- Maps: urban development, facility locations, geographical changes over time

Return ONLY valid JSON:
{
  "taskType": "task1",
  "topic": "Detailed description with specific data points, time periods, and measurements",
  "instructions": "Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "timeLimit": 20,
  "wordLimit": 150
}`
      : `Generate a COMPLETELY UNIQUE IELTS Academic Writing Task 2 essay topic.

CRITICAL: Create FRESH, ORIGINAL topics every time. Never repeat themes or questions.

Rotate through diverse categories:
- Education: university access, curriculum changes, online vs traditional learning, assessment methods, early childhood education
- Technology: social media impact, artificial intelligence, privacy concerns, digital divide, automation
- Environment: climate action, renewable energy, wildlife conservation, plastic waste, sustainable cities
- Society: income inequality, cultural diversity, work-life balance, urbanization, aging population
- Health: public health policy, mental wellness, exercise habits, healthcare access, preventive medicine
- Arts & Culture: funding for arts, cultural preservation, museums vs digital media, creative education
- Government & Law: taxation, public spending, citizen responsibility, international cooperation, legal reforms
- Work & Career: remote work, gig economy, career changes, retirement age, workplace diversity

Question types (alternate):
- Opinion: "To what extent do you agree or disagree?"
- Discussion: "Discuss both views and give your opinion"
- Advantages/Disadvantages: "Do the advantages outweigh the disadvantages?"
- Problem/Solution: "What are the causes and solutions?"
- Two-part: "Why is this? Is it positive or negative?"

Return ONLY valid JSON:
{
  "taskType": "task2",
  "topic": "Specific, thought-provoking statement or question with real-world relevance",
  "instructions": "Write an essay giving your opinion and supporting it with relevant examples. Write at least 250 words.",
  "timeLimit": 40,
  "wordLimit": 250
}`;

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
          { role: 'user', content: `Generate a unique IELTS Writing ${taskType === 'task1' ? 'Task 1' : 'Task 2'} topic RIGHT NOW at ${timestamp}. Make it completely different from any previous topic. Use fresh angles and perspectives. Return only valid JSON.` }
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
    
    let topicData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        topicData = JSON.parse(jsonMatch[0]);
      } else {
        topicData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(topicData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-writing-topic:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
