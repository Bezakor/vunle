import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// ElevenLabs voice IDs for meditation-appropriate voices
const VOICE_IDS = {
  female: 'EXAVITQu4vr4xnSDxMaL', // Sarah - calm, warm female voice
  male: 'pNInz6obpgDQGcFmaJgB', // Adam - calm, warm male voice
};

// Fallback voices if the above aren't available
const FALLBACK_VOICE_IDS = {
  female: '21m00Tcm4TlvDq8ikWAM', // Rachel
  male: 'ErXwobaYiN019PkySvjV', // Antoni
};

export async function POST(request: NextRequest) {
  try {
    const { script, voiceGender, meditationId } = await request.json();

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const voiceId = VOICE_IDS[voiceGender as keyof typeof VOICE_IDS] || VOICE_IDS.female;

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75, // Higher stability for meditation
            similarity_boost: 0.75,
            style: 0.3, // Lower style for more neutral, calm delivery
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      // Try fallback voice if primary fails
      const fallbackVoiceId = FALLBACK_VOICE_IDS[voiceGender as keyof typeof FALLBACK_VOICE_IDS] || FALLBACK_VOICE_IDS.female;

      const fallbackResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: script,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text();
        console.error('ElevenLabs error:', errorText);
        throw new Error('Failed to generate voiceover');
      }

      const audioBuffer = await fallbackResponse.arrayBuffer();
      return await saveAndRespond(audioBuffer, meditationId);
    }

    const audioBuffer = await response.arrayBuffer();
    return await saveAndRespond(audioBuffer, meditationId);
  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voiceover' },
      { status: 500 }
    );
  }
}

async function saveAndRespond(audioBuffer: ArrayBuffer, meditationId: string) {
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'public', 'audio', meditationId);
  await mkdir(outputDir, { recursive: true });

  // Save audio file
  const voiceoverPath = path.join(outputDir, 'voiceover.mp3');
  await writeFile(voiceoverPath, Buffer.from(audioBuffer));

  // Estimate duration (rough estimate based on file size)
  // More accurate would be to use a library to read the MP3 header
  const fileSizeKB = audioBuffer.byteLength / 1024;
  const estimatedDuration = (fileSizeKB / 16) * 1; // Rough estimate: ~16KB per second at 128kbps

  const voiceoverUrl = `/audio/${meditationId}/voiceover.mp3`;

  return NextResponse.json({
    voiceoverUrl,
    duration: Math.round(estimatedDuration),
  });
}
