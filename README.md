# MindScape - AI-Powered Personalized Meditation Generator

A beautiful web application that creates custom guided visualization meditations based on user preferences. The app uses AI to generate personalized meditation scripts and converts them to soothing audio experiences.

## Features

- **Typeform-style Onboarding**: Smooth, animated question flow to gather user preferences
- **AI Script Generation**: Uses OpenAI GPT-4 to create personalized meditation scripts
- **Text-to-Speech**: Converts scripts to natural-sounding voiceovers using ElevenLabs
- **Ambient Audio**: Adds background soundscapes matching the visualization theme
- **Audio Merging**: Combines voiceover with ambient audio for immersive experience
- **Preview & Download**: Listen to a sample and download the full meditation

## Prerequisites

Before running this app, you need:

1. **Node.js 18+** installed
2. **FFmpeg** installed on your system (for audio processing)
3. **API Keys** for:
   - OpenAI (for script generation)
   - ElevenLabs (for text-to-speech)

## Setup Instructions

### 1. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html and add to PATH

### 2. Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy and save your key (starts with `sk-`)

#### ElevenLabs API Key
1. Go to https://elevenlabs.io/sign-up
2. Create an account (free tier available)
3. Go to your Profile → API Keys
4. Copy your API key

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your API keys
```

Your `.env.local` should look like:
```
OPENAI_API_KEY=sk-your-actual-key-here
ELEVENLABS_API_KEY=your-actual-key-here
```

### 4. Add Ambient Audio (Optional but Recommended)

Create ambient audio files for better meditation experiences:

```bash
mkdir -p public/audio/ambient
```

Add MP3 files with these names:
- `ocean-waves.mp3` - Beach/ocean sounds
- `forest-ambience.mp3` - Forest sounds with birds
- `mountain-wind.mp3` - Wind sounds
- `garden-zen.mp3` - Garden/water sounds
- `space-ambient.mp3` - Cosmic ambient sounds
- `fireplace-rain.mp3` - Fireplace with rain
- `default.mp3` - Fallback ambient audio

You can find royalty-free ambient audio at:
- https://freesound.org
- https://pixabay.com/music
- https://mixkit.co/free-sound-effects

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit http://localhost:3000 to use the app.

## How It Works

1. **Onboarding**: User answers questions about their meditation preferences
2. **Script Generation**: OpenAI creates a personalized meditation script
3. **Voice Synthesis**: ElevenLabs converts the script to natural speech
4. **Audio Enhancement**: System adds ambient background audio
5. **Delivery**: User receives downloadable meditation files

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-script/   # OpenAI script generation
│   │   ├── generate-voice/    # ElevenLabs TTS
│   │   ├── generate-ambient/  # Ambient audio handling
│   │   └── merge-audio/       # FFmpeg audio merging
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main app with onboarding
├── components/
│   ├── QuestionCard.tsx      # Individual question display
│   ├── ProgressBar.tsx       # Progress indicator
│   ├── GeneratingScreen.tsx  # Loading/progress screen
│   └── ResultScreen.tsx      # Final download screen
├── lib/
│   └── questions.ts          # Onboarding questions config
└── types/
    └── index.ts              # TypeScript types
```

## Customization

### Adding New Questions

Edit `src/lib/questions.ts` to add or modify onboarding questions.

### Changing Voice Options

Edit `src/app/api/generate-voice/route.ts` to use different ElevenLabs voices.

### Modifying Script Generation

Edit `src/app/api/generate-script/route.ts` to adjust the meditation script style.

## Cost Estimates

- **OpenAI GPT-4**: ~$0.01-0.03 per meditation script
- **ElevenLabs**: Free tier = 10,000 characters/month, then ~$0.30 per 1,000 characters

## Troubleshooting

### "Failed to generate script"
- Check your OpenAI API key is valid
- Ensure you have API credits available

### "Failed to generate voiceover"
- Check your ElevenLabs API key
- Verify you haven't exceeded your character limit

### "Failed to merge audio"
- Ensure FFmpeg is installed: `ffmpeg -version`
- Check file permissions in the `public/audio` directory

## Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] User accounts and meditation history
- [ ] More visualization scenes
- [ ] Background music generation with AI
- [ ] Mobile app version

## License

MIT License - feel free to use and modify for your projects.
