import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { access, copyFile, mkdir } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Get FFmpeg path - use bundled version from node_modules
function getFFmpegPath(): string {
  const platform = process.platform;
  const arch = process.arch;
  let platformDir = 'linux-x64';

  if (platform === 'darwin') {
    platformDir = arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64';
  } else if (platform === 'win32') {
    platformDir = 'win32-x64';
  }

  return path.join(process.cwd(), 'node_modules', '@ffmpeg-installer', platformDir, 'ffmpeg');
}

const ffmpegPath = getFFmpegPath();
const ffprobePath = ffmpegPath.replace(/ffmpeg$/, 'ffprobe');

// Check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Get audio duration using ffprobe
async function getAudioDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout.trim()) || 0;
  } catch (error) {
    console.error('Error getting audio duration:', error);
    return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { voiceoverUrl, ambientUrl, meditationId } = await request.json();

    const publicDir = path.join(process.cwd(), 'public');
    const outputDir = path.join(publicDir, 'audio', meditationId);

    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });

    // Convert URLs to file paths
    const voiceoverPath = path.join(publicDir, voiceoverUrl);
    const ambientPath = path.join(publicDir, ambientUrl);
    const mergedPath = path.join(outputDir, 'merged.mp3');
    const samplePath = path.join(outputDir, 'sample.mp3');

    // Check if voiceover exists
    if (!(await fileExists(voiceoverPath))) {
      throw new Error('Voiceover file not found');
    }

    // Get voiceover duration
    const voiceoverDuration = await getAudioDuration(voiceoverPath);

    // Check if ambient exists and has content
    const ambientExists = await fileExists(ambientPath);

    if (ambientExists) {
      // Merge voiceover with ambient audio
      // - Loop ambient to match voiceover duration
      // - Mix ambient at lower volume (0.3) behind voiceover
      try {
        await execAsync(
          `"${ffmpegPath}" -y -i "${voiceoverPath}" -stream_loop -1 -i "${ambientPath}" -filter_complex "[1:a]volume=0.25[ambient];[0:a][ambient]amix=inputs=2:duration=first:dropout_transition=3[out]" -map "[out]" -t ${voiceoverDuration} -c:a libmp3lame -q:a 2 "${mergedPath}"`
        );
      } catch (ffmpegError) {
        console.error('FFmpeg merge error, falling back to voiceover only:', ffmpegError);
        // If merge fails, just use the voiceover
        await copyFile(voiceoverPath, mergedPath);
      }
    } else {
      // If no ambient, just copy voiceover as merged
      await copyFile(voiceoverPath, mergedPath);
    }

    // Create 10-second sample from the middle of the track
    const sampleStart = Math.max(0, (voiceoverDuration / 2) - 5);
    try {
      await execAsync(
        `"${ffmpegPath}" -y -i "${mergedPath}" -ss ${sampleStart} -t 10 -c:a libmp3lame -q:a 2 "${samplePath}"`
      );
    } catch (sampleError) {
      console.error('Error creating sample, copying full file:', sampleError);
      // If sample creation fails, just copy the merged file
      await copyFile(mergedPath, samplePath);
    }

    const mergedUrl = `/audio/${meditationId}/merged.mp3`;
    const sampleUrl = `/audio/${meditationId}/sample.mp3`;

    return NextResponse.json({
      mergedUrl,
      sampleUrl,
      duration: voiceoverDuration,
    });
  } catch (error) {
    console.error('Merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge audio files' },
      { status: 500 }
    );
  }
}
