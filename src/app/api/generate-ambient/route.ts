import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access, copyFile } from 'fs/promises';
import path from 'path';

// Map scenes to ambient audio characteristics
const SCENE_AUDIO_CONFIG: Record<string, { description: string; baseFile: string }> = {
  beach: {
    description: 'Ocean waves, seagulls, gentle breeze',
    baseFile: 'ocean-waves.mp3',
  },
  forest: {
    description: 'Birds chirping, rustling leaves, gentle stream',
    baseFile: 'forest-ambience.mp3',
  },
  mountain: {
    description: 'Wind, distant eagle calls, peaceful silence',
    baseFile: 'mountain-wind.mp3',
  },
  garden: {
    description: 'Water fountain, birds, wind chimes',
    baseFile: 'garden-zen.mp3',
  },
  space: {
    description: 'Deep space drones, gentle cosmic sounds',
    baseFile: 'space-ambient.mp3',
  },
  cozy: {
    description: 'Crackling fire, soft rain outside',
    baseFile: 'fireplace-rain.mp3',
  },
};

// Check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { scene, duration, meditationId } = await request.json();

    const config = SCENE_AUDIO_CONFIG[scene] || SCENE_AUDIO_CONFIG.beach;

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'public', 'audio', meditationId);
    await mkdir(outputDir, { recursive: true });

    // Check if base ambient file exists
    const baseAmbientPath = path.join(process.cwd(), 'public', 'audio', 'ambient', config.baseFile);
    const outputPath = path.join(outputDir, 'ambient.mp3');

    if (await fileExists(baseAmbientPath)) {
      // Copy the base ambient file to the meditation folder
      await copyFile(baseAmbientPath, outputPath);
    } else {
      // Generate a placeholder/fallback ambient audio
      // In production, you would integrate with a service like Mubert
      // For now, we'll create a simple placeholder
      await generatePlaceholderAmbient(outputPath, duration, scene);
    }

    const ambientUrl = `/audio/${meditationId}/ambient.mp3`;

    return NextResponse.json({
      ambientUrl,
      scene: config.description,
    });
  } catch (error) {
    console.error('Ambient generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ambient audio' },
      { status: 500 }
    );
  }
}

// Generate a simple placeholder ambient sound
// This creates a very basic audio file - in production you'd use real ambient tracks
async function generatePlaceholderAmbient(
  outputPath: string,
  duration: number,
  scene: string
): Promise<void> {
  // For the MVP, we'll check if there's a default ambient file
  const defaultAmbientPath = path.join(process.cwd(), 'public', 'audio', 'ambient', 'default.mp3');

  if (await fileExists(defaultAmbientPath)) {
    await copyFile(defaultAmbientPath, outputPath);
    return;
  }

  // If no ambient files exist at all, create a minimal silent file
  // This is just a placeholder - you should add real ambient tracks
  const silentMp3 = createMinimalMp3();
  await writeFile(outputPath, silentMp3);

  console.log(`Note: No ambient audio found for "${scene}". Created placeholder.`);
  console.log('To add ambient audio, place MP3 files in public/audio/ambient/');
}

// Create a minimal valid MP3 file (very short silent audio)
function createMinimalMp3(): Buffer {
  // This is a minimal MP3 frame that represents silence
  // It's about 0.026 seconds of silence
  // In production, replace with actual ambient audio files
  const mp3Frame = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  // Repeat frame multiple times to create longer silence
  const frames: Buffer[] = [];
  for (let i = 0; i < 1000; i++) {
    frames.push(mp3Frame);
  }

  return Buffer.concat(frames);
}
