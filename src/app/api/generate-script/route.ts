import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { OnboardingAnswers } from '@/types';

// Lazy initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file.');
  }
  return new OpenAI({ apiKey });
}

const intentionDescriptions: Record<string, string> = {
  relaxation: 'deep physical and mental relaxation',
  sleep: 'preparing for restful, peaceful sleep',
  focus: 'enhancing mental clarity and concentration',
  anxiety: 'releasing anxiety and finding inner calm',
  confidence: 'building self-confidence and inner strength',
  healing: 'emotional healing and self-compassion',
};

const sceneDescriptions: Record<string, string> = {
  beach: 'a peaceful tropical beach with gentle waves and warm sun',
  forest: 'a serene ancient forest with dappled sunlight and soft earth',
  mountain: 'a majestic mountain summit with expansive views and fresh air',
  garden: 'a tranquil Japanese garden with flowing water and cherry blossoms',
  space: 'floating peacefully among the stars in infinite space',
  cozy: 'a warm cozy cabin with a crackling fireplace on a snowy evening',
};

const stressAdaptations: Record<string, string> = {
  low: 'Start with a brief centering breath and move into the visualization fairly quickly.',
  moderate: 'Include progressive relaxation of the body before the main visualization.',
  high: 'Begin with extended breathing exercises and body scan to release physical tension before the visualization.',
  overwhelmed: 'Start very slowly with grounding techniques, extended breathing, and gentle reassurance before any visualization.',
};

export async function POST(request: NextRequest) {
  try {
    const answers: OnboardingAnswers = await request.json();
    const meditationId = uuidv4();

    const durationMinutes = parseInt(answers.duration) || 10;
    const wordCount = durationMinutes * 120; // Roughly 120 words per minute for meditation pace

    const systemPrompt = `You are an expert meditation script writer who creates personalized guided visualization meditations. Your scripts are:
- Warm, calming, and professionally written
- Paced appropriately for meditation (with natural pauses indicated by "...")
- Written in second person ("you")
- Deeply immersive with rich sensory details
- Therapeutically sound and psychologically supportive

IMPORTANT RULES:
1. NEVER use phrases like "as we discussed" or reference previous conversations
2. Include breathing cues naturally throughout
3. Use the person's name sparingly (2-3 times maximum)
4. Include natural pauses (indicated by "...") for breathing and reflection
5. End with a gentle return to awareness
6. Write approximately ${wordCount} words for a ${durationMinutes}-minute meditation`;

    const userPrompt = `Create a personalized guided visualization meditation for ${answers.name} with these specifications:

PRIMARY INTENTION: ${intentionDescriptions[answers.intention] || answers.intention}

VISUALIZATION SETTING: ${sceneDescriptions[answers.preferredScene] || answers.preferredScene}

STRESS LEVEL ADAPTATION: ${stressAdaptations[answers.stressLevel] || 'Use a balanced approach.'}

${answers.specificFocus ? `PERSONAL FOCUS: The person mentioned: "${answers.specificFocus}". Weave this theme into the meditation naturally without directly quoting it.` : ''}

DURATION: ${durationMinutes} minutes (approximately ${wordCount} words)

Create a complete meditation script that flows naturally from introduction through the visualization and back to awareness. Remember to include "..." for pauses and breathing moments.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const script = completion.choices[0]?.message?.content || '';

    if (!script) {
      throw new Error('Failed to generate meditation script');
    }

    return NextResponse.json({
      script,
      meditationId,
    });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}
