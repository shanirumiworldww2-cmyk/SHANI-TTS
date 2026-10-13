import { Voice, CoquiModel, VoiceSettings } from '../types/tts';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 68,
  similarity: 82,
  styleExaggeration: 25,
  speakerBoost: true,
  speed: 1.0,
  pitch: 0,
  pauseDurationMs: 280,
  maxChunkChars: 240,
  audioFormat: 'wav',
  sampleRate: 24000,
};

export const PRESET_VOICES: Voice[] = [
  {
    "id": "voice-asad",
    "name": "Asad",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Deep, natural Urdu and English narrator with pristine diction for audiobooks and YouTube.",
    "tags": [
      "Urdu Native",
      "Audiobooks",
      "YouTube",
      "Documentary"
    ],
    "avatarColor": "#10b981",
    "previewSampleText": "یہ وائس ماڈل اردو اور انگریزی دونوں میں بالکل قدرتی اور صاف بولتا ہے، بغیر کسی رکاوٹ کے۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-uzma",
    "name": "Uzma",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Melodious Urdu & English female host for podcasts, tutorials, and storytelling.",
    "tags": [
      "Urdu Host",
      "Warm",
      "Melodious",
      "Bilingual"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "خوش آمدید! آپ اس ٹول کے ذریعے جتنا چاہیں ٹیکسٹ بغیر کسی لمٹ کے آڈیو میں تبدیل کر سکتے ہیں۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-tariq",
    "name": "Tariq",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Authoritative Pakistani news anchor and political podcast host.",
    "tags": [
      "News",
      "Journalism",
      "Urdu"
    ],
    "avatarColor": "#059669",
    "previewSampleText": "آج کے خصوصی نشریات میں ہم ٹیکنالوجی اور آرٹیفیشل انٹیلیجنس کے نئے انقلابات پر بات کریں گے۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-zainab",
    "name": "Zainab",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Gentle, poetic recitation voice for Urdu shayari and novels.",
    "tags": [
      "Poetry",
      "Audiobooks",
      "Urdu"
    ],
    "avatarColor": "#8b5cf6",
    "previewSampleText": "زندگی کے راستے میں کچھ موڑ ایسے آتے ہیں جہاں خاموشی لفظوں سے زیادہ گہری بات کہہ جاتی ہے۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-bilal",
    "name": "Bilal",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Modern youth YouTuber style, energetic and punchy for tech tutorials.",
    "tags": [
      "YouTube",
      "Energetic",
      "Tech"
    ],
    "avatarColor": "#f59e0b",
    "previewSampleText": "دوستو! آج کی ویڈیو میں ہم دیکھیں گے کہ آپ اپنے کمپیوٹر پر لوکل ماڈل کیسے سیٹ اپ کر سکتے ہیں۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-mehwish",
    "name": "Mehwish",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Friendly, smiling lifestyle vlogger voice with high engagement.",
    "tags": [
      "Lifestyle",
      "Vlog",
      "Friendly"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "امید ہے آپ سب خیریت سے ہوں گے! آئیے آج مل کر ایک زبردست پراجیکٹ مکمل کرتے ہیں۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-hamza",
    "name": "Hamza",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Deep baritone motivational speaker with rich resonance.",
    "tags": [
      "Motivational",
      "Deep Voice",
      "Baritone"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "کامیابی ان لوگوں کا مقدر بنتی ہے جو اپنے خوابوں کو حقیقت میں بدلنے کے لیے مسلسل محنت کرتے ہیں۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-ayesha",
    "name": "Ayesha",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Calm academic educator for educational courses and training.",
    "tags": [
      "Educational",
      "Academic",
      "Clear"
    ],
    "avatarColor": "#0ea5e9",
    "previewSampleText": "اس سبق میں ہم کمپیوٹر سائنس کے بنیادی اصول اور ڈیٹا اسٹرکچرز کا تفصیلی جائزہ لیں گے۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-farhan",
    "name": "Farhan",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Classic radio drama voice reminiscent of golden era radio narrators.",
    "tags": [
      "Radio Drama",
      "Classic",
      "Nostalgic"
    ],
    "avatarColor": "#78716c",
    "previewSampleText": "رات کی تاریکی پھیل چکی تھی اور پرانی عمارت کے دالان میں ہوا کی سنسناہٹ سنائی دے رہی تھی۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-sadia",
    "name": "Sadia",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Pakistani)",
    "language": "Urdu & English",
    "description": "Expressive children storybook reader with playful inflections.",
    "tags": [
      "Storybook",
      "Children",
      "Playful"
    ],
    "avatarColor": "#a855f7",
    "previewSampleText": "ایک دفعہ کا ذکر ہے کہ ایک چھوٹے سے جنگل میں ایک بہت ہی ہوشیار اور پیارا خرگوش رہتا تھا۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-salman",
    "name": "Salman",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Indian)",
    "language": "Urdu & Hindi",
    "description": "Traditional Delhi & Lucknow Urdu dialect with classical polite articulation.",
    "tags": [
      "Lucknowi",
      "Classical",
      "Polite"
    ],
    "avatarColor": "#14b8a6",
    "previewSampleText": "تسلیمات! تہذیب اور تمدن کے اس سفر میں ہم آپ کا دل کی گہرائیوں سے استقبال کرتے ہیں۔",
    "baseSpeakerId": "ur-IN-SalmanNeural"
  },
  {
    "id": "voice-gul",
    "name": "Gul",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Indian)",
    "language": "Urdu & Hindi",
    "description": "Subtle, lyrical Indian Urdu voice for cultural documentaries.",
    "tags": [
      "Poetic",
      "Heritage",
      "Indian Urdu"
    ],
    "avatarColor": "#e879f9",
    "previewSampleText": "ادب اور شاعری دلوں کو جوڑنے کا وہ حسین پل ہے جو صدیوں سے انسان کو انسان سے ملاتا ہے۔",
    "baseSpeakerId": "ur-IN-GulNeural"
  },
  {
    "id": "voice-swara",
    "name": "Swara",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Hindi (Indian)",
    "language": "Hindi & English",
    "description": "Contemporary conversational Hindi presenter with fluent bilingual switching.",
    "tags": [
      "Hindi",
      "Conversational",
      "Bilingual"
    ],
    "avatarColor": "#f97316",
    "previewSampleText": "नमस्ते! आज के इस एपिसोड में हम जानेंगे कि आप बिना किसी लिमिट के वॉइस कैसे जनरेट कर सकते हैं।",
    "baseSpeakerId": "hi-IN-SwaraNeural"
  },
  {
    "id": "voice-madhur",
    "name": "Madhur",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Hindi (Indian)",
    "language": "Hindi & English",
    "description": "Deep resonant Hindi voiceover artist with cinematic depth.",
    "tags": [
      "Hindi",
      "Cinematic",
      "Deep Voice"
    ],
    "avatarColor": "#ea580c",
    "previewSampleText": "सफलता की राह में आने वाली हर चुनौती आपको और मजबूत बनाती है। अपने लक्ष्य पर अडिग रहें।",
    "baseSpeakerId": "hi-IN-MadhurNeural"
  },
  {
    "id": "voice-gagan",
    "name": "Gagan",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Punjabi",
    "language": "Punjabi & Urdu",
    "description": "Energetic Punjabi male narrator with hearty regional rhythm.",
    "tags": [
      "Punjabi",
      "Regional",
      "Energetic"
    ],
    "avatarColor": "#84cc16",
    "previewSampleText": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਸਾਡੇ ਚੈਨਲ ਤੇ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ, ਜਿੱਥੇ ਆਪਾਂ ਨਵੀਂ ਤਕਨਾਲੋਜੀ ਬਾਰੇ ਗੱਲ ਕਰਾਂਗੇ।",
    "baseSpeakerId": "pa-IN-GaganNeural"
  },
  {
    "id": "voice-ojas",
    "name": "Ojas",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Punjabi",
    "language": "Punjabi & Urdu",
    "description": "Warm Punjabi female host with cheerful folk storytelling charm.",
    "tags": [
      "Punjabi",
      "Folk",
      "Warm"
    ],
    "avatarColor": "#eab308",
    "previewSampleText": "ਪੰਜਾਬ ਦੀ ਧਰਤੀ ਦਾ ਸੁਨੇਹਾ ਲੈ ਕੇ ਆਏ ਹਾਂ, ਜਿੱਥੇ ਪਿਆਰ ਅਤੇ ਮਿਠਾਸ ਹਰ ਗੱਲ ਵਿੱਚ ਝਲਕਦੀ ਹੈ।",
    "baseSpeakerId": "pa-IN-OjasNeural"
  },
  {
    "id": "voice-vikram",
    "name": "Vikram",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Indian (English)",
    "language": "English (India)",
    "description": "Clear, engaging tech lecturer for coding tutorials and courses.",
    "tags": [
      "Technical",
      "Articulate",
      "Tutorials"
    ],
    "avatarColor": "#4f46e5",
    "previewSampleText": "Let us initialize our local PyTorch tensor pipeline and configure the speaker embeddings for zero-shot synthesis.",
    "baseSpeakerId": "en-IN-PrabhatNeural"
  },
  {
    "id": "voice-neerja",
    "name": "Neerja",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Indian (English)",
    "language": "English (India)",
    "description": "Sophisticated corporate presenter for business software and demos.",
    "tags": [
      "Corporate",
      "Executive",
      "Indian English"
    ],
    "avatarColor": "#06b6d4",
    "previewSampleText": "Our quarterly report demonstrates remarkable acceleration in machine learning deployment across all regional hubs.",
    "baseSpeakerId": "en-IN-NeerjaNeural"
  },
  {
    "id": "voice-rehan",
    "name": "Rehan",
    "category": "Urdu & Regional",
    "gender": "Male",
    "accent": "Urdu (Karachi Street)",
    "language": "Urdu & Roman Urdu",
    "description": "Casual fast-paced Karachi conversationalist for social media reels.",
    "tags": [
      "Urban",
      "Casual",
      "Social Media"
    ],
    "avatarColor": "#3b82f6",
    "previewSampleText": "یار سین یہ ہے کہ اب آپ کو کسی بھی پیڈ اے آئی ٹول پر پیسے ضائع کرنے کی بالکل ضرورت نہیں ہے۔",
    "baseSpeakerId": "ur-PK-AsadNeural"
  },
  {
    "id": "voice-fatima",
    "name": "Fatima",
    "category": "Urdu & Regional",
    "gender": "Female",
    "accent": "Urdu (Lahori Cultural)",
    "language": "Urdu & Roman Urdu",
    "description": "Sophisticated Lahori literary tone with gentle modulation.",
    "tags": [
      "Literary",
      "Cultural",
      "Refined"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "لاہور کی شاموں میں ایک خاص جادو ہوتا ہے، جب پرانے دروازوں پر چراغاں اور خوشبوئیں بکھرتی ہیں۔",
    "baseSpeakerId": "ur-PK-UzmaNeural"
  },
  {
    "id": "voice-adam",
    "name": "Adam",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American (Deep)",
    "language": "English (US)",
    "description": "Deep, resonant, authoritative baritone for audiobooks and documentaries.",
    "tags": [
      "Audiobooks",
      "Documentary",
      "Deep Baritone"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "In the quiet corners of the ancient library, centuries of forgotten lore waited patiently for someone brave enough to turn the page.",
    "baseSpeakerId": "en-US-GuyNeural"
  },
  {
    "id": "voice-rachel",
    "name": "Rachel",
    "category": "Conversational",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Warm, natural conversational host with empathetic overtones.",
    "tags": [
      "Conversational",
      "Podcast",
      "Warm"
    ],
    "avatarColor": "#2563eb",
    "previewSampleText": "Welcome back to the studio. Today we are breaking down the fastest way to host your own local speech synthesis models.",
    "baseSpeakerId": "en-US-JennyNeural"
  },
  {
    "id": "voice-antoni",
    "name": "Antoni",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "American / Dramatic",
    "language": "English (US)",
    "description": "Rich, textured timbre built for movie trailers and dramatic dialogue.",
    "tags": [
      "Cinematic",
      "Dramatic",
      "Storytelling"
    ],
    "avatarColor": "#7c3aed",
    "previewSampleText": "When the shadows stretch across the horizon, only the relentless dreamers dare to ignite the torch.",
    "baseSpeakerId": "en-US-ChristopherNeural"
  },
  {
    "id": "voice-bella",
    "name": "Bella",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Gentle, expressive, delicate voice beloved for fiction and poetry.",
    "tags": [
      "Expressive",
      "Gentle",
      "Fiction"
    ],
    "avatarColor": "#db2777",
    "previewSampleText": "She stepped onto the dew-soaked grass, listening to the morning birds softly awakening in the dawn mist.",
    "baseSpeakerId": "en-US-AriaNeural"
  },
  {
    "id": "voice-liam",
    "name": "Liam",
    "category": "Commercial",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Punchy, modern, dynamic voice with energetic commercial punch.",
    "tags": [
      "Energetic",
      "Commercial",
      "Gaming"
    ],
    "avatarColor": "#ea580c",
    "previewSampleText": "Instant responsiveness. Uncompromising fidelity. Take full ownership of your voice AI pipeline without character caps.",
    "baseSpeakerId": "en-US-EricNeural"
  },
  {
    "id": "voice-davis",
    "name": "Davis",
    "category": "Audiobook",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Crisp, steady audiobook narrator with measured cadence.",
    "tags": [
      "Audiobook",
      "Crisp",
      "Steady"
    ],
    "avatarColor": "#6366f1",
    "previewSampleText": "The journey across the desert had taken forty days, but the oasis ahead shimmered with eternal promise.",
    "baseSpeakerId": "en-US-DavisNeural"
  },
  {
    "id": "voice-amber",
    "name": "Amber",
    "category": "Conversational",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Cheerful lifestyle host with authentic friendly tone.",
    "tags": [
      "Friendly",
      "Lifestyle",
      "Bright"
    ],
    "avatarColor": "#f59e0b",
    "previewSampleText": "Grab your coffee and let us jump straight into the top five creative workflows of the month.",
    "baseSpeakerId": "en-US-AmberNeural"
  },
  {
    "id": "voice-andrew",
    "name": "Andrew",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Distinguished corporate executive delivery for presentations.",
    "tags": [
      "Executive",
      "Corporate",
      "Leadership"
    ],
    "avatarColor": "#3b82f6",
    "previewSampleText": "Our strategic investments in localized artificial intelligence reflect our unwavering commitment to technical sovereignty.",
    "baseSpeakerId": "en-US-AndrewNeural"
  },
  {
    "id": "voice-brian",
    "name": "Brian",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "American (Gravel)",
    "language": "English (US)",
    "description": "Rugged, cinematic trailer narrator with gravitas and weight.",
    "tags": [
      "Trailer",
      "Gravel",
      "Epic"
    ],
    "avatarColor": "#475569",
    "previewSampleText": "In an empire fractured by greed, one warrior rose to restore honor to the forgotten realm.",
    "baseSpeakerId": "en-US-BrianNeural"
  },
  {
    "id": "voice-emma",
    "name": "Emma",
    "category": "News",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Poised keynote speaker with crystal clarity and confidence.",
    "tags": [
      "Keynote",
      "Confident",
      "Tech"
    ],
    "avatarColor": "#06b6d4",
    "previewSampleText": "Today we are unveiling the next chapter in open-source multimodal intelligence.",
    "baseSpeakerId": "en-US-EmmaNeural"
  },
  {
    "id": "voice-jacob",
    "name": "Jacob",
    "category": "Commercial",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "High-octane gaming streamer and tech reviewer.",
    "tags": [
      "Gaming",
      "Streamer",
      "Upbeat"
    ],
    "avatarColor": "#10b981",
    "previewSampleText": "What is up everyone! Today we are testing real-time voice latency benchmarks on consumer GPUs.",
    "baseSpeakerId": "en-US-JacobNeural"
  },
  {
    "id": "voice-jane",
    "name": "Jane",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Warm, soothing bedtime storyteller with gentle maternal tone.",
    "tags": [
      "Soothing",
      "Bedtime",
      "Gentle"
    ],
    "avatarColor": "#8b5cf6",
    "previewSampleText": "The stars twinkle high above the sleepy mountain village, whispering peaceful dreams to all below.",
    "baseSpeakerId": "en-US-JaneNeural"
  },
  {
    "id": "voice-jason",
    "name": "Jason",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Serious investigative journalism narrator for longform exposés.",
    "tags": [
      "Journalism",
      "Investigative",
      "Serious"
    ],
    "avatarColor": "#64748b",
    "previewSampleText": "Following a three-month investigation into the encrypted server networks, the truth finally surfaced.",
    "baseSpeakerId": "en-US-JasonNeural"
  },
  {
    "id": "voice-michelle",
    "name": "Michelle",
    "category": "Conversational",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Bubbly morning radio and entertainment podcast co-host.",
    "tags": [
      "Radio",
      "Entertainment",
      "Bubbly"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "Good morning listeners! We have got an incredible lineup of new music and tech revelations today.",
    "baseSpeakerId": "en-US-MichelleNeural"
  },
  {
    "id": "voice-monica",
    "name": "Monica",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Mindful meditation guide with serene breath control.",
    "tags": [
      "Meditation",
      "Mindful",
      "Serene"
    ],
    "avatarColor": "#14b8a6",
    "previewSampleText": "Close your eyes, breathe in deeply through your nose, and feel every tension melting away.",
    "baseSpeakerId": "en-US-MonicaNeural"
  },
  {
    "id": "voice-nancy",
    "name": "Nancy",
    "category": "Narrative",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Patient tutorial instructor for software demonstrations.",
    "tags": [
      "Tutorial",
      "Patient",
      "Software"
    ],
    "avatarColor": "#f97316",
    "previewSampleText": "In this walkthrough, we will configure the model inference parameters step by step.",
    "baseSpeakerId": "en-US-NancyNeural"
  },
  {
    "id": "voice-roger",
    "name": "Roger",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American (Senior)",
    "language": "English (US)",
    "description": "Wise vintage documentary narrator with storied grandfatherly timbre.",
    "tags": [
      "Vintage",
      "Senior",
      "Wise"
    ],
    "avatarColor": "#78716c",
    "previewSampleText": "Looking back through eight decades of technological revolutions, one truth remains unchanged.",
    "baseSpeakerId": "en-US-RogerNeural"
  },
  {
    "id": "voice-steffan",
    "name": "Steffan",
    "category": "Conversational",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Tech podcaster with engaging modern conversational flow.",
    "tags": [
      "Podcaster",
      "Modern",
      "Engaging"
    ],
    "avatarColor": "#22c55e",
    "previewSampleText": "When you remove cloud rate limits from your stack, the creative possibilities multiply overnight.",
    "baseSpeakerId": "en-US-SteffanNeural"
  },
  {
    "id": "voice-samuel",
    "name": "Samuel",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Reflective philosophical narrator for video essays.",
    "tags": [
      "Philosophical",
      "Essay",
      "Reflective"
    ],
    "avatarColor": "#a855f7",
    "previewSampleText": "Consciousness is not merely the mirror of reality, but the active architect of our understanding.",
    "baseSpeakerId": "en-US-GuyNeural"
  },
  {
    "id": "voice-harper",
    "name": "Harper",
    "category": "Commercial",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Stylish fashion and luxury commercial voice.",
    "tags": [
      "Fashion",
      "Luxury",
      "Sleek"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "Elegance is not about standing out, but about remaining timeless in every breath.",
    "baseSpeakerId": "en-US-JennyNeural"
  },
  {
    "id": "voice-ethan",
    "name": "Ethan",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Suspense thriller narrator with tense dramatic pacing.",
    "tags": [
      "Suspense",
      "Thriller",
      "Mystery"
    ],
    "avatarColor": "#1e293b",
    "previewSampleText": "Footsteps echoed down the empty corridor. He reached into his coat and felt the cold steel of the key.",
    "baseSpeakerId": "en-US-ChristopherNeural"
  },
  {
    "id": "voice-chloe",
    "name": "Chloe",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Intimate romance novel narrator with rich emotional depth.",
    "tags": [
      "Romance",
      "Intimate",
      "Emotional"
    ],
    "avatarColor": "#e11d48",
    "previewSampleText": "Across the crowded ballroom, their gazes met, and for a fleeting second, the world fell silent.",
    "baseSpeakerId": "en-US-AriaNeural"
  },
  {
    "id": "voice-wyatt",
    "name": "Wyatt",
    "category": "Narrative",
    "gender": "Male",
    "accent": "American (Western)",
    "language": "English (US)",
    "description": "Weathered cowboy timbre for frontier history and folklore.",
    "tags": [
      "Western",
      "Frontier",
      "Weathered"
    ],
    "avatarColor": "#b45309",
    "previewSampleText": "Out past the Rio Grande, the dust storms have a way of wiping clean any man’s past.",
    "baseSpeakerId": "en-US-EricNeural"
  },
  {
    "id": "voice-zoe",
    "name": "Zoe",
    "category": "Conversational",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Startup tech founder voice, quick-witted and inspiring.",
    "tags": [
      "Startup",
      "Founder",
      "Inspiring"
    ],
    "avatarColor": "#0284c7",
    "previewSampleText": "We built this open speech architecture so every creator can own their generative pipeline.",
    "baseSpeakerId": "en-US-AmberNeural"
  },
  {
    "id": "voice-nolan",
    "name": "Nolan",
    "category": "News",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Wall Street financial broadcaster with sharp analytical pace.",
    "tags": [
      "Finance",
      "Markets",
      "Analytical"
    ],
    "avatarColor": "#334155",
    "previewSampleText": "Trading opened higher this morning following record enterprise adoption of open AI weights.",
    "baseSpeakerId": "en-US-AndrewNeural"
  },
  {
    "id": "voice-maya",
    "name": "Maya",
    "category": "Narrative",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Science documentary presenter exploring quantum physics and astronomy.",
    "tags": [
      "Science",
      "Cosmos",
      "Presenter"
    ],
    "avatarColor": "#4f46e5",
    "previewSampleText": "To gaze into the deep field of the James Webb telescope is to witness the infancy of our universe.",
    "baseSpeakerId": "en-US-EmmaNeural"
  },
  {
    "id": "voice-julian",
    "name": "Julian",
    "category": "Audiobook",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "Biographical narrator tracing historical legacies.",
    "tags": [
      "Biography",
      "History",
      "Steady"
    ],
    "avatarColor": "#0f766e",
    "previewSampleText": "Benjamin Franklin’s relentless curiosity transformed him from an apprentice printer into a founding father.",
    "baseSpeakerId": "en-US-DavisNeural"
  },
  {
    "id": "voice-clara-us",
    "name": "Clara",
    "category": "Conversational",
    "gender": "Female",
    "accent": "American",
    "language": "English (US)",
    "description": "Museum and gallery audio guide narrator.",
    "tags": [
      "Museum",
      "Art",
      "Cultural"
    ],
    "avatarColor": "#7c3aed",
    "previewSampleText": "Notice how the brushstrokes in this 19th century canvas capture the fleeting illumination of twilight.",
    "baseSpeakerId": "en-US-JaneNeural"
  },
  {
    "id": "voice-mason",
    "name": "Mason",
    "category": "Commercial",
    "gender": "Male",
    "accent": "American",
    "language": "English (US)",
    "description": "High-energy sports broadcaster and fitness coach.",
    "tags": [
      "Sports",
      "Coach",
      "Dynamic"
    ],
    "avatarColor": "#c2410c",
    "previewSampleText": "Push past your perceived limits! The finish line is within sight, and victory belongs to the bold.",
    "baseSpeakerId": "en-US-BrianNeural"
  },
  {
    "id": "voice-riley",
    "name": "Riley",
    "category": "Character",
    "gender": "Neutral",
    "accent": "American (Neutral)",
    "language": "English (US)",
    "description": "Futuristic virtual assistant voice, clean and neutral.",
    "tags": [
      "AI Assistant",
      "Neutral",
      "Futuristic"
    ],
    "avatarColor": "#64748b",
    "previewSampleText": "System initialization complete. All neural synthesizers are calibrated and ready for generation.",
    "baseSpeakerId": "en-US-AriaNeural"
  },
  {
    "id": "voice-george",
    "name": "George",
    "category": "Narrative",
    "gender": "Male",
    "accent": "British (RP)",
    "language": "English (UK)",
    "description": "Distinguished British voice with cultured articulation for history.",
    "tags": [
      "British RP",
      "Cultured",
      "History"
    ],
    "avatarColor": "#059669",
    "previewSampleText": "The industrial revolution did not simply transform machines; it permanently reimagined the rhythm of human existence.",
    "baseSpeakerId": "en-GB-RyanNeural"
  },
  {
    "id": "voice-charlotte",
    "name": "Charlotte",
    "category": "News",
    "gender": "Female",
    "accent": "British",
    "language": "English (UK)",
    "description": "Crystal-clear journalistic delivery for BBC-style daily briefs.",
    "tags": [
      "Journalistic",
      "Poised",
      "News"
    ],
    "avatarColor": "#0891b2",
    "previewSampleText": "Global markets rallied today following technological advancements in on-device AI inference and open speech architectures.",
    "baseSpeakerId": "en-GB-SoniaNeural"
  },
  {
    "id": "voice-libby",
    "name": "Libby",
    "category": "Conversational",
    "gender": "Female",
    "accent": "British",
    "language": "English (UK)",
    "description": "Warm, relatable British conversational host for lifestyle podcasts.",
    "tags": [
      "Warm",
      "Relatable",
      "British"
    ],
    "avatarColor": "#d946ef",
    "previewSampleText": "Welcome along! Pull up a chair and let us discuss the most exciting developments in creative tech.",
    "baseSpeakerId": "en-GB-LibbyNeural"
  },
  {
    "id": "voice-alfie",
    "name": "Alfie",
    "category": "Conversational",
    "gender": "Male",
    "accent": "British (London)",
    "language": "English (UK)",
    "description": "Young, charismatic London voice for gaming and streetwear culture.",
    "tags": [
      "London",
      "Youthful",
      "Modern"
    ],
    "avatarColor": "#06b6d4",
    "previewSampleText": "Alright mate! Today we are checking out the coolest open source audio tools you can run on your rig.",
    "baseSpeakerId": "en-GB-AlfieNeural"
  },
  {
    "id": "voice-maisie",
    "name": "Maisie",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "British",
    "language": "English (UK)",
    "description": "Charming British fairytale narrator with expressive delight.",
    "tags": [
      "Fairytale",
      "Charming",
      "Expressive"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "At the bottom of the enchanted garden, beneath the great oak tree, lived a family of miniature hedgehogs.",
    "baseSpeakerId": "en-GB-MaisieNeural"
  },
  {
    "id": "voice-oliver",
    "name": "Oliver",
    "category": "Narrative",
    "gender": "Male",
    "accent": "British (Oxford)",
    "language": "English (UK)",
    "description": "Scholarly Oxford professor for academic literature and documentaries.",
    "tags": [
      "Oxford",
      "Academic",
      "Scholarly"
    ],
    "avatarColor": "#475569",
    "previewSampleText": "The architectural geometry of the Renaissance drew profound inspiration from classical antiquity.",
    "baseSpeakerId": "en-GB-OliverNeural"
  },
  {
    "id": "voice-thomas",
    "name": "Thomas",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "British (Dramatic)",
    "language": "English (UK)",
    "description": "Dramatic Shakespearean stage actor with powerful resonance.",
    "tags": [
      "Dramatic",
      "Shakespearean",
      "Theatrical"
    ],
    "avatarColor": "#7e22ce",
    "previewSampleText": "All the world is a stage, and all the men and women merely players upon it.",
    "baseSpeakerId": "en-GB-ThomasNeural"
  },
  {
    "id": "voice-noah",
    "name": "Noah",
    "category": "Conversational",
    "gender": "Male",
    "accent": "British",
    "language": "English (UK)",
    "description": "Indie documentary filmmaker with honest, observant delivery.",
    "tags": [
      "Indie",
      "Observant",
      "Film"
    ],
    "avatarColor": "#2563eb",
    "previewSampleText": "Walking through these quiet coastal towns, you see the remnants of maritime heritage etched into every stone.",
    "baseSpeakerId": "en-GB-NoahNeural"
  },
  {
    "id": "voice-nat",
    "name": "Nat",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Australian",
    "language": "English (AU)",
    "description": "Friendly Australian voice for travel documentaries and outdoor guides.",
    "tags": [
      "Aussie",
      "Outdoors",
      "Friendly"
    ],
    "avatarColor": "#eab308",
    "previewSampleText": "G day! Today we are exploring the ancient sandstone gorges of the Australian Outback.",
    "baseSpeakerId": "en-AU-NatNeural"
  },
  {
    "id": "voice-william-au",
    "name": "William",
    "category": "Commercial",
    "gender": "Male",
    "accent": "Australian",
    "language": "English (AU)",
    "description": "Confident Australian commercial voice with energetic natural flair.",
    "tags": [
      "Commercial",
      "Dynamic",
      "Aussie"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "Engineered for extreme performance and built to outlast the harshest conditions on Earth.",
    "baseSpeakerId": "en-AU-WilliamNeural"
  },
  {
    "id": "voice-annette",
    "name": "Annette",
    "category": "News",
    "gender": "Female",
    "accent": "Australian",
    "language": "English (AU)",
    "description": "Professional Australian national broadcaster.",
    "tags": [
      "Broadcaster",
      "Clear",
      "Aussie"
    ],
    "avatarColor": "#0ea5e9",
    "previewSampleText": "Good evening, here are the top national and international stories developing across the region.",
    "baseSpeakerId": "en-AU-AnnetteNeural"
  },
  {
    "id": "voice-freya",
    "name": "Freya",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Australian",
    "language": "English (AU)",
    "description": "Vibrant Sydney creative director with sunny charisma.",
    "tags": [
      "Sydney",
      "Vibrant",
      "Charisma"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "Creativity is all about breaking down barriers and letting your wildest technological ideas come to life.",
    "baseSpeakerId": "en-AU-FreyaNeural"
  },
  {
    "id": "voice-darren",
    "name": "Darren",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Australian",
    "language": "English (AU)",
    "description": "Laid-back wildlife presenter exploring coral reefs and rainforests.",
    "tags": [
      "Wildlife",
      "Laid-back",
      "Nature"
    ],
    "avatarColor": "#10b981",
    "previewSampleText": "Just beneath the surface of the Great Barrier Reef lies an ecosystem more diverse than any tropical forest.",
    "baseSpeakerId": "en-AU-DarrenNeural"
  },
  {
    "id": "voice-liam-ca",
    "name": "Liam (CA)",
    "category": "Conversational",
    "gender": "Male",
    "accent": "Canadian",
    "language": "English (CA)",
    "description": "Clear, approachable Canadian narrator with neutral northern pacing.",
    "tags": [
      "Canadian",
      "Approachable",
      "Clear"
    ],
    "avatarColor": "#3b82f6",
    "previewSampleText": "Welcome to the Great White North, where innovation meets the raw majesty of untamed wilderness.",
    "baseSpeakerId": "en-CA-LiamNeural"
  },
  {
    "id": "voice-clara-ca",
    "name": "Clara (CA)",
    "category": "Narrative",
    "gender": "Female",
    "accent": "Canadian",
    "language": "English (CA)",
    "description": "Warm bilingual Canadian presenter.",
    "tags": [
      "Canadian",
      "Warm",
      "Presenter"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "From the rocky shores of Nova Scotia to the peaks of Banff, Canada’s landscape inspires endless wonder.",
    "baseSpeakerId": "en-CA-ClaraNeural"
  },
  {
    "id": "voice-emily-ie",
    "name": "Emily",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "Irish",
    "language": "English (IE)",
    "description": "Melodic Irish storyteller with lyrical lilt for fantasy and folklore.",
    "tags": [
      "Irish",
      "Lyrical",
      "Folklore"
    ],
    "avatarColor": "#10b981",
    "previewSampleText": "In the emerald hills of Connemara, ancient legends speak of a hidden well where dreams turn to gold.",
    "baseSpeakerId": "en-IE-EmilyNeural"
  },
  {
    "id": "voice-connor-ie",
    "name": "Connor",
    "category": "Conversational",
    "gender": "Male",
    "accent": "Irish (Dublin)",
    "language": "English (IE)",
    "description": "Expressive Dublin conversational voice, rich and engaging.",
    "tags": [
      "Dublin",
      "Expressive",
      "Irish"
    ],
    "avatarColor": "#15803d",
    "previewSampleText": "There is nothing quite like a hearty laugh with good friends on a rainy evening in Dublin town.",
    "baseSpeakerId": "en-IE-ConnorNeural"
  },
  {
    "id": "voice-angus",
    "name": "Angus",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Scottish",
    "language": "English (UK)",
    "description": "Rugged Scottish Highland storyteller with deep earthy warmth.",
    "tags": [
      "Scottish",
      "Highland",
      "Rugged"
    ],
    "avatarColor": "#1e3a8a",
    "previewSampleText": "Across the misty waters of Loch Ness, the heather-covered hills stand sentinel over centuries of clan history.",
    "baseSpeakerId": "en-GB-RyanNeural"
  },
  {
    "id": "voice-isla",
    "name": "Isla",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Scottish",
    "language": "English (UK)",
    "description": "Gentle Scottish voice with sweet musical cadence.",
    "tags": [
      "Scottish",
      "Musical",
      "Sweet"
    ],
    "avatarColor": "#a855f7",
    "previewSampleText": "Welcome to our cozy fireside chat, where tales of old come alive in the dancing shadows.",
    "baseSpeakerId": "en-GB-SoniaNeural"
  },
  {
    "id": "voice-arthur",
    "name": "Arthur",
    "category": "Audiobook",
    "gender": "Male",
    "accent": "British (Victorian)",
    "language": "English (UK)",
    "description": "Classical Victorian narrator for gothic and mystery literature.",
    "tags": [
      "Victorian",
      "Gothic",
      "Mystery"
    ],
    "avatarColor": "#581c87",
    "previewSampleText": "It was a dark and tempestuous night in London when the mysterious courier delivered the sealed parcel.",
    "baseSpeakerId": "en-GB-ThomasNeural"
  },
  {
    "id": "voice-alvaro",
    "name": "Alvaro",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Spanish (Spain)",
    "language": "Spanish (ES)",
    "description": "Spanish Castilian narrative voice with elegant European diction.",
    "tags": [
      "Spanish",
      "Castilian",
      "Narrative"
    ],
    "avatarColor": "#dc2626",
    "previewSampleText": "Bienvenidos al estudio de voz. Hoy exploraremos el potencial de los modelos de síntesis locales.",
    "baseSpeakerId": "es-ES-AlvaroNeural"
  },
  {
    "id": "voice-elvira",
    "name": "Elvira",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Spanish (Spain)",
    "language": "Spanish (ES)",
    "description": "Warm Spanish Castilian podcast host.",
    "tags": [
      "Spanish",
      "Warm",
      "Castilian"
    ],
    "avatarColor": "#f97316",
    "previewSampleText": "La puesta de sol sobre el Mediterráneo pintaba el océano en tonos dorados y violetas.",
    "baseSpeakerId": "es-ES-ElviraNeural"
  },
  {
    "id": "voice-jorge-mx",
    "name": "Jorge",
    "category": "Commercial",
    "gender": "Male",
    "accent": "Spanish (Mexican)",
    "language": "Spanish (MX)",
    "description": "Dynamic Mexican Spanish voice for promos and gaming.",
    "tags": [
      "Mexican",
      "Dynamic",
      "Commercial"
    ],
    "avatarColor": "#e11d48",
    "previewSampleText": "Rendimiento sin límites y calidad insuperable. Descubre la verdadera libertad creativa.",
    "baseSpeakerId": "es-MX-JorgeNeural"
  },
  {
    "id": "voice-dalia-mx",
    "name": "Dalia",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Spanish (Mexican)",
    "language": "Spanish (MX)",
    "description": "Friendly Mexican Spanish conversational host.",
    "tags": [
      "Mexican",
      "Friendly",
      "Podcast"
    ],
    "avatarColor": "#db2777",
    "previewSampleText": "Hola a todos, qué gusto tenerlos aquí para compartir las mejores herramientas de inteligencia artificial.",
    "baseSpeakerId": "es-MX-DaliaNeural"
  },
  {
    "id": "voice-tomas-ar",
    "name": "Tomas",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Spanish (Argentine)",
    "language": "Spanish (AR)",
    "description": "Argentine Spanish voice with musical Porteño cadence.",
    "tags": [
      "Argentine",
      "Porteño",
      "Narrative"
    ],
    "avatarColor": "#0284c7",
    "previewSampleText": "Caminar por las calles de Buenos Aires es respirar tango, literatura y pasión en cada esquina.",
    "baseSpeakerId": "es-AR-TomasNeural"
  },
  {
    "id": "voice-gonzalo-co",
    "name": "Gonzalo",
    "category": "Audiobook",
    "gender": "Male",
    "accent": "Spanish (Colombian)",
    "language": "Spanish (CO)",
    "description": "Crystal-clear Colombian Spanish narrator with pristine diction.",
    "tags": [
      "Colombian",
      "Pristine",
      "Audiobook"
    ],
    "avatarColor": "#16a34a",
    "previewSampleText": "En el corazón de la cordillera andina, la niebla matutina abraza los cafetales centenarios.",
    "baseSpeakerId": "es-CO-GonzaloNeural"
  },
  {
    "id": "voice-henri",
    "name": "Henri",
    "category": "Narrative",
    "gender": "Male",
    "accent": "French (Parisian)",
    "language": "French (FR)",
    "description": "Refined Parisian French voice for documentaries and essays.",
    "tags": [
      "French",
      "Parisian",
      "Refined"
    ],
    "avatarColor": "#2563eb",
    "previewSampleText": "L’élégance de la pensée réside dans la précision du verbe et la clarté de l’esprit.",
    "baseSpeakerId": "fr-FR-HenriNeural"
  },
  {
    "id": "voice-denise",
    "name": "Denise",
    "category": "Conversational",
    "gender": "Female",
    "accent": "French (Parisian)",
    "language": "French (FR)",
    "description": "Graceful French podcast host and cultural critic.",
    "tags": [
      "French",
      "Graceful",
      "Culture"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "Bienvenue dans notre atelier créatif où nous explorons les frontières du son et de l’intelligence.",
    "baseSpeakerId": "fr-FR-DeniseNeural"
  },
  {
    "id": "voice-jean-ca",
    "name": "Jean",
    "category": "News",
    "gender": "Male",
    "accent": "French (Canadian)",
    "language": "French (CA)",
    "description": "Broadcaster voice in Quebec French.",
    "tags": [
      "Quebec",
      "French Canadian",
      "News"
    ],
    "avatarColor": "#0284c7",
    "previewSampleText": "Voici les nouvelles en direct de Montréal avec nos correspondants sur le terrain.",
    "baseSpeakerId": "fr-CA-JeanNeural"
  },
  {
    "id": "voice-sylvie-ca",
    "name": "Sylvie",
    "category": "Conversational",
    "gender": "Female",
    "accent": "French (Canadian)",
    "language": "French (CA)",
    "description": "Warm Quebec French presenter.",
    "tags": [
      "Quebec",
      "Warm",
      "Friendly"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "Bonjour tout le monde! C’est un grand plaisir de vous retrouver pour cet épisode passionnant.",
    "baseSpeakerId": "fr-CA-SylvieNeural"
  },
  {
    "id": "voice-conrad",
    "name": "Conrad",
    "category": "Narrative",
    "gender": "Male",
    "accent": "German (Standard)",
    "language": "German (DE)",
    "description": "Authoritative German voice with clear Teutonic precision.",
    "tags": [
      "German",
      "Precise",
      "Authoritative"
    ],
    "avatarColor": "#0d9488",
    "previewSampleText": "Wissenschaftliche Präzision und technologische Souveränität bilden das Fundament unserer Entwicklung.",
    "baseSpeakerId": "de-DE-ConradNeural"
  },
  {
    "id": "voice-katja",
    "name": "Katja",
    "category": "Conversational",
    "gender": "Female",
    "accent": "German (Standard)",
    "language": "German (DE)",
    "description": "Clear, engaging German narrator for audiobooks and tutorials.",
    "tags": [
      "German",
      "Audiobook",
      "Engaging"
    ],
    "avatarColor": "#8b5cf6",
    "previewSampleText": "Willkommen zurück in unserem Studio für zukunftsweisende Sprachsynthese und Audio-Produktion.",
    "baseSpeakerId": "de-DE-KatjaNeural"
  },
  {
    "id": "voice-jonas-at",
    "name": "Jonas",
    "category": "Narrative",
    "gender": "Male",
    "accent": "German (Austrian)",
    "language": "German (AT)",
    "description": "Viennese Austrian German narrator with cultured cadence.",
    "tags": [
      "Austrian",
      "Viennese",
      "Cultured"
    ],
    "avatarColor": "#475569",
    "previewSampleText": "Die reiche musikalische Tradition Wiens hallt bis heute durch die historischen Säle der Stadt.",
    "baseSpeakerId": "de-AT-JonasNeural"
  },
  {
    "id": "voice-ingrid-at",
    "name": "Ingrid",
    "category": "Conversational",
    "gender": "Female",
    "accent": "German (Austrian)",
    "language": "German (AT)",
    "description": "Warm Austrian host for nature and alpine documentaries.",
    "tags": [
      "Austrian",
      "Alpine",
      "Nature"
    ],
    "avatarColor": "#10b981",
    "previewSampleText": "Zwischen den schneebedeckten Gipfeln der Alpen offenbart sich die unberührte Schönheit der Natur.",
    "baseSpeakerId": "de-AT-IngridNeural"
  },
  {
    "id": "voice-diego-it",
    "name": "Diego",
    "category": "Conversational",
    "gender": "Male",
    "accent": "Italian",
    "language": "Italian (IT)",
    "description": "Charismatic Italian voice with passionate cadence.",
    "tags": [
      "Italian",
      "Charismatic",
      "Passionate"
    ],
    "avatarColor": "#16a34a",
    "previewSampleText": "L’arte di comunicare con passione e autenticità è il vero cuore della creatività italiana.",
    "baseSpeakerId": "it-IT-DiegoNeural"
  },
  {
    "id": "voice-elsa-it",
    "name": "Elsa",
    "category": "Audiobook",
    "gender": "Female",
    "accent": "Italian",
    "language": "Italian (IT)",
    "description": "Melodious Italian narrator for literature and culinary journeys.",
    "tags": [
      "Italian",
      "Melodious",
      "Culinary"
    ],
    "avatarColor": "#e11d48",
    "previewSampleText": "La brezza marina accarezzava le scogliere della costiera amalfitana al calar della sera.",
    "baseSpeakerId": "it-IT-ElsaNeural"
  },
  {
    "id": "voice-isabella-it",
    "name": "Isabella",
    "category": "Cinematic",
    "gender": "Female",
    "accent": "Italian",
    "language": "Italian (IT)",
    "description": "Dramatic Italian actress voice for theatrical cinema.",
    "tags": [
      "Italian",
      "Theatrical",
      "Cinema"
    ],
    "avatarColor": "#7c3aed",
    "previewSampleText": "Nel silenzio del teatro antico, ogni battito del cuore risuonava come un’eco immortale.",
    "baseSpeakerId": "it-IT-IsabellaNeural"
  },
  {
    "id": "voice-antonio-br",
    "name": "Antonio",
    "category": "Conversational",
    "gender": "Male",
    "accent": "Portuguese (Brazilian)",
    "language": "Portuguese (BR)",
    "description": "Vibrant Brazilian Portuguese host with tropical warmth.",
    "tags": [
      "Brazilian",
      "Warm",
      "Podcast"
    ],
    "avatarColor": "#16a34a",
    "previewSampleText": "E aí pessoal! Sejam todos muito bem-vindos ao melhor estúdio de voz com tecnologia aberta.",
    "baseSpeakerId": "pt-BR-AntonioNeural"
  },
  {
    "id": "voice-francisca-br",
    "name": "Francisca",
    "category": "Narrative",
    "gender": "Female",
    "accent": "Portuguese (Brazilian)",
    "language": "Portuguese (BR)",
    "description": "Friendly Brazilian Portuguese narrator for audiobooks.",
    "tags": [
      "Brazilian",
      "Friendly",
      "Audiobook"
    ],
    "avatarColor": "#f59e0b",
    "previewSampleText": "A floresta amazônica guarda segredos ancestrais que a ciência apenas começou a desvendar.",
    "baseSpeakerId": "pt-BR-FranciscaNeural"
  },
  {
    "id": "voice-duarte-pt",
    "name": "Duarte",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Portuguese (Portugal)",
    "language": "Portuguese (PT)",
    "description": "European Portuguese narrator with Lisbon diction.",
    "tags": [
      "Portuguese",
      "Lisbon",
      "Narrative"
    ],
    "avatarColor": "#0f766e",
    "previewSampleText": "Das caravelas do passado aos satélites do futuro, o espírito de descoberta move a humanidade.",
    "baseSpeakerId": "pt-PT-DuarteNeural"
  },
  {
    "id": "voice-raquel-pt",
    "name": "Raquel",
    "category": "News",
    "gender": "Female",
    "accent": "Portuguese (Portugal)",
    "language": "Portuguese (PT)",
    "description": "European Portuguese news anchor.",
    "tags": [
      "Portuguese",
      "News",
      "European"
    ],
    "avatarColor": "#c026d3",
    "previewSampleText": "Boa noite. Iniciamos o nosso noticiário com as principais decisões da cimeira tecnológica europeia.",
    "baseSpeakerId": "pt-PT-RaquelNeural"
  },
  {
    "id": "voice-dmitry",
    "name": "Dmitry",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Russian",
    "language": "Russian (RU)",
    "description": "Deep Russian baritone with epic cinematic weight.",
    "tags": [
      "Russian",
      "Deep",
      "Epic"
    ],
    "avatarColor": "#dc2626",
    "previewSampleText": "Сквозь бескрайние сибирские просторы поезд мчался навстречу ледяному северному сиянию.",
    "baseSpeakerId": "ru-RU-DmitryNeural"
  },
  {
    "id": "voice-svetlana",
    "name": "Svetlana",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Russian",
    "language": "Russian (RU)",
    "description": "Expressive Russian host for science and audiobooks.",
    "tags": [
      "Russian",
      "Expressive",
      "Science"
    ],
    "avatarColor": "#2563eb",
    "previewSampleText": "Добро пожаловать в мир открытых технологий искусственного интеллекта и голосового синтеза.",
    "baseSpeakerId": "ru-RU-SvetlanaNeural"
  },
  {
    "id": "voice-ahmet",
    "name": "Ahmet",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Turkish",
    "language": "Turkish (TR)",
    "description": "Resonant Turkish voiceover for historical documentaries.",
    "tags": [
      "Turkish",
      "Resonant",
      "Documentary"
    ],
    "avatarColor": "#b91c1c",
    "previewSampleText": "İstanbul’un bin yıllık sokaklarında dolaşırken, tarihin fısıltılarını her köşede hissedebilirsiniz.",
    "baseSpeakerId": "tr-TR-AhmetNeural"
  },
  {
    "id": "voice-emel",
    "name": "Emel",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Turkish",
    "language": "Turkish (TR)",
    "description": "Warm Turkish host for podcasts and educational content.",
    "tags": [
      "Turkish",
      "Warm",
      "Host"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "Merhaba! Bugün yerel bilgisayarınızda sınırsız karakterle ses üretmenin yollarını inceliyoruz.",
    "baseSpeakerId": "tr-TR-EmelNeural"
  },
  {
    "id": "voice-hamed-ar",
    "name": "Hamed",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Arabic (Saudi)",
    "language": "Arabic (SA)",
    "description": "Modern Standard Arabic deep narrator with authoritative classical diction.",
    "tags": [
      "Arabic",
      "Classical",
      "Fusha"
    ],
    "avatarColor": "#059669",
    "previewSampleText": "في أعماق الصحراء العربية الشاسعة، تلتقي أصالة الماضي مع طموحات المستقبل اللامحدود.",
    "baseSpeakerId": "ar-SA-HamedNeural"
  },
  {
    "id": "voice-zariyah-ar",
    "name": "Zariyah",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Arabic (Gulf)",
    "language": "Arabic (SA)",
    "description": "Warm Gulf Arabic presenter for cultural podcasts.",
    "tags": [
      "Arabic",
      "Gulf",
      "Cultural"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "أهلاً بكم في هذا اللقاء الخاص، حيث نستعرض أحدث ابتكارات الذكاء الاصطناعي التوليدي.",
    "baseSpeakerId": "ar-SA-ZariyahNeural"
  },
  {
    "id": "voice-shakir-eg",
    "name": "Shakir",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Arabic (Egyptian)",
    "language": "Arabic (EG)",
    "description": "Expressive Egyptian Arabic storyteller with theatrical charm.",
    "tags": [
      "Egyptian",
      "Storyteller",
      "Arabic"
    ],
    "avatarColor": "#b45309",
    "previewSampleText": "على ضفاف النيل الخالد، تسري الحكايات والأساطير التي ألهمت البشرية لآلاف السنين.",
    "baseSpeakerId": "ar-EG-ShakirNeural"
  },
  {
    "id": "voice-salma-eg",
    "name": "Salma",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Arabic (Egyptian)",
    "language": "Arabic (EG)",
    "description": "Melodious Egyptian Arabic host for lifestyle and arts.",
    "tags": [
      "Egyptian",
      "Melodious",
      "Lifestyle"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "مساء الخير عليكم جميعاً! النهارده معانا جولة رائعة في عالم الصوتيات المفتوحة المصدر.",
    "baseSpeakerId": "ar-EG-SalmaNeural"
  },
  {
    "id": "voice-hamdan-ae",
    "name": "Hamdan",
    "category": "News",
    "gender": "Male",
    "accent": "Arabic (UAE)",
    "language": "Arabic (AE)",
    "description": "Formal UAE Emirati news broadcaster.",
    "tags": [
      "Emirati",
      "Formal",
      "UAE"
    ],
    "avatarColor": "#0d9488",
    "previewSampleText": "نرحب بكم في نشرة الأخبار الخاصة بمستقبل التحول الرقمي والذكاء الاصطناعي في دولة الإمارات.",
    "baseSpeakerId": "ar-AE-HamdanNeural"
  },
  {
    "id": "voice-keita-jp",
    "name": "Keita",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Japanese (Tokyo)",
    "language": "Japanese (JA)",
    "description": "Japanese documentary and anime male lead voice.",
    "tags": [
      "Japanese",
      "Anime",
      "Documentary"
    ],
    "avatarColor": "#dc2626",
    "previewSampleText": "夜明けの富士山を望む静寂の中、新たな技術の夜明けが今まさに始まろうとしています。",
    "baseSpeakerId": "ja-JP-KeitaNeural"
  },
  {
    "id": "voice-nanami-jp",
    "name": "Nanami",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Japanese (Tokyo)",
    "language": "Japanese (JA)",
    "description": "Gentle Japanese host with polite natural cadence.",
    "tags": [
      "Japanese",
      "Polite",
      "Gentle"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "みなさんこんにちは！今日も最新のオープンソース音声AIの世界を一緒にお届けします。",
    "baseSpeakerId": "ja-JP-NanamiNeural"
  },
  {
    "id": "voice-naoki-jp",
    "name": "Naoki",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "Japanese",
    "language": "Japanese (JA)",
    "description": "Dramatic Japanese voice for cinema trailers and video games.",
    "tags": [
      "Japanese",
      "Cinema",
      "Gaming"
    ],
    "avatarColor": "#7c3aed",
    "previewSampleText": "失われた光を取り戻すため、戦士は遥かなる時を超えて立ち上がった。",
    "baseSpeakerId": "ja-JP-KeitaNeural"
  },
  {
    "id": "voice-aoi-jp",
    "name": "Aoi",
    "category": "Commercial",
    "gender": "Female",
    "accent": "Japanese",
    "language": "Japanese (JA)",
    "description": "Upbeat commercial and anime companion voice.",
    "tags": [
      "Japanese",
      "Anime",
      "Upbeat"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "あなたの創造力を解き放つ、次世代の音声スタジオへようこそ！",
    "baseSpeakerId": "ja-JP-NanamiNeural"
  },
  {
    "id": "voice-injoon-kr",
    "name": "InJoon",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Korean (Seoul)",
    "language": "Korean (KO)",
    "description": "Korean drama lead male voice with heartfelt emotional depth.",
    "tags": [
      "Korean",
      "K-Drama",
      "Emotional"
    ],
    "avatarColor": "#2563eb",
    "previewSampleText": "끝없이 펼쳐진 수평선을 바라보며 우리는 새로운 꿈을 향해 나아갑니다.",
    "baseSpeakerId": "ko-KR-InJoonNeural"
  },
  {
    "id": "voice-sunhi-kr",
    "name": "SunHi",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Korean (Seoul)",
    "language": "Korean (KO)",
    "description": "Warm Korean lifestyle and tech vlog host.",
    "tags": [
      "Korean",
      "Warm",
      "Vlog"
    ],
    "avatarColor": "#db2777",
    "previewSampleText": "안녕하세요 여러분! 오늘 영상에서는 로컬 환경에서 음성을 무료로 생성하는 방법을 알아볼게요.",
    "baseSpeakerId": "ko-KR-SunHiNeural"
  },
  {
    "id": "voice-bongjin-kr",
    "name": "BongJin",
    "category": "News",
    "gender": "Male",
    "accent": "Korean",
    "language": "Korean (KO)",
    "description": "Authoritative Korean news presenter.",
    "tags": [
      "Korean",
      "News",
      "Authoritative"
    ],
    "avatarColor": "#0f766e",
    "previewSampleText": "이상으로 오늘 저녁 주요 뉴스를 전해드렸습니다. 시청해 주신 여러분 고맙습니다.",
    "baseSpeakerId": "ko-KR-InJoonNeural"
  },
  {
    "id": "voice-yunxi-zh",
    "name": "Yunxi",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Chinese (Mandarin)",
    "language": "Chinese (ZH)",
    "description": "Rich Mandarin Chinese narrator with classical gravitas.",
    "tags": [
      "Mandarin",
      "Classical",
      "Gravitas"
    ],
    "avatarColor": "#dc2626",
    "previewSampleText": "长江奔流不息，见证着五千年文明的深厚底蕴与现代科技的日新月异。",
    "baseSpeakerId": "zh-CN-YunxiNeural"
  },
  {
    "id": "voice-xiaoxiao-zh",
    "name": "Xiaoxiao",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Chinese (Mandarin)",
    "language": "Chinese (ZH)",
    "description": "Friendly Mandarin Chinese host for podcasts and educational software.",
    "tags": [
      "Mandarin",
      "Friendly",
      "Clear"
    ],
    "avatarColor": "#f59e0b",
    "previewSampleText": "大家好！欢迎来到开源语音工作站，让我们一起开启无限创意的声音之旅。",
    "baseSpeakerId": "zh-CN-XiaoxiaoNeural"
  },
  {
    "id": "voice-yunjian-zh",
    "name": "Yunjian",
    "category": "Audiobook",
    "gender": "Male",
    "accent": "Chinese (Mandarin)",
    "language": "Chinese (ZH)",
    "description": "Chinese audiobook and historical novel reader.",
    "tags": [
      "Mandarin",
      "Audiobook",
      "History"
    ],
    "avatarColor": "#b45309",
    "previewSampleText": "群山耸立在云海之间，松柏傲立风霜，诉说着岁月沧桑的故事。",
    "baseSpeakerId": "zh-CN-YunxiNeural"
  },
  {
    "id": "voice-hsiaochen-tw",
    "name": "HsiaoChen",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Taiwanese Mandarin",
    "language": "Chinese (TW)",
    "description": "Gentle Taiwanese Mandarin presenter.",
    "tags": [
      "Taiwanese",
      "Gentle",
      "Melodic"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "哈囉大家好！今天很高興可以和大家分享這個超棒的本地語音生成工具。",
    "baseSpeakerId": "zh-TW-HsiaoChenNeural"
  },
  {
    "id": "voice-hiumaan-hk",
    "name": "HiuMaan",
    "category": "Narrative",
    "gender": "Female",
    "accent": "Cantonese (Hong Kong)",
    "language": "Chinese (HK)",
    "description": "Melodious Hong Kong Cantonese storyteller.",
    "tags": [
      "Cantonese",
      "Hong Kong",
      "Storyteller"
    ],
    "avatarColor": "#0284c7",
    "previewSampleText": "歡迎收聽今天的廣東話廣播，我們會為大家帶來最新最熱門的科技資訊。",
    "baseSpeakerId": "zh-HK-HiuMaanNeural"
  },
  {
    "id": "voice-wanlung-hk",
    "name": "WanLung",
    "category": "Cinematic",
    "gender": "Male",
    "accent": "Cantonese (Hong Kong)",
    "language": "Chinese (HK)",
    "description": "Cinematic Cantonese male voice for trailers and film.",
    "tags": [
      "Cantonese",
      "Cinematic",
      "Drama"
    ],
    "avatarColor": "#7e22ce",
    "previewSampleText": "喺呢個繁華嘅都市背後，每個人都有屬於自己嘅傳奇故事。",
    "baseSpeakerId": "zh-HK-HiuMaanNeural"
  },
  {
    "id": "voice-ardi-id",
    "name": "Ardi",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Indonesian",
    "language": "Indonesian (ID)",
    "description": "Articulate Indonesian narrator for educational channels.",
    "tags": [
      "Indonesian",
      "Educational",
      "Clear"
    ],
    "avatarColor": "#16a34a",
    "previewSampleText": "Selamat datang di masa depan teknologi suara tanpa batas karakter dan tanpa batasan kuota.",
    "baseSpeakerId": "id-ID-ArdiNeural"
  },
  {
    "id": "voice-gadis-id",
    "name": "Gadis",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Indonesian",
    "language": "Indonesian (ID)",
    "description": "Warm Indonesian podcast and lifestyle host.",
    "tags": [
      "Indonesian",
      "Warm",
      "Friendly"
    ],
    "avatarColor": "#f97316",
    "previewSampleText": "Halo semuanya! Terima kasih sudah mendengarkan podcast kami hari ini tentang kecerdasan buatan.",
    "baseSpeakerId": "id-ID-GadisNeural"
  },
  {
    "id": "voice-namminh-vn",
    "name": "NamMinh",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Vietnamese",
    "language": "Vietnamese (VI)",
    "description": "Clear Vietnamese male narrator for news and history.",
    "tags": [
      "Vietnamese",
      "History",
      "Clear"
    ],
    "avatarColor": "#b91c1c",
    "previewSampleText": "Chào mừng các bạn đến với kênh kiến thức công nghệ và âm thanh số thế hệ mới.",
    "baseSpeakerId": "vi-VN-NamMinhNeural"
  },
  {
    "id": "voice-hoaimy-vn",
    "name": "HoaiMy",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Vietnamese",
    "language": "Vietnamese (VI)",
    "description": "Melodious Vietnamese female host for audiobooks.",
    "tags": [
      "Vietnamese",
      "Melodious",
      "Audiobook"
    ],
    "avatarColor": "#db2777",
    "previewSampleText": "Cuộc sống là một hành trình kỳ diệu nơi mỗi giai điệu đều mang theo một thông điệp yêu thương.",
    "baseSpeakerId": "vi-VN-HoaiMyNeural"
  },
  {
    "id": "voice-niwat-th",
    "name": "Niwat",
    "category": "Narrative",
    "gender": "Male",
    "accent": "Thai",
    "language": "Thai (TH)",
    "description": "Resonant Thai male narrator for documentaries.",
    "tags": [
      "Thai",
      "Resonant",
      "Documentary"
    ],
    "avatarColor": "#d97706",
    "previewSampleText": "ยินดีต้อนรับสู่สตูดิโอเสียงสังเคราะห์ที่ทรงพลังที่สุดบนคอมพิวเตอร์ของคุณ",
    "baseSpeakerId": "th-TH-NiwatNeural"
  },
  {
    "id": "voice-premwadee-th",
    "name": "Premwadee",
    "category": "Conversational",
    "gender": "Female",
    "accent": "Thai",
    "language": "Thai (TH)",
    "description": "Gentle Thai female host for meditation and stories.",
    "tags": [
      "Thai",
      "Gentle",
      "Soothing"
    ],
    "avatarColor": "#8b5cf6",
    "previewSampleText": "ขอให้ทุกคนมีความสุขและความสงบในจิตใจตลอดการเดินทางในวันนี้",
    "baseSpeakerId": "th-TH-PremwadeeNeural"
  },
  {
    "id": "voice-angelo-ph",
    "name": "Angelo",
    "category": "Conversational",
    "gender": "Male",
    "accent": "Filipino (Tagalog)",
    "language": "Filipino (PH)",
    "description": "Friendly Filipino Tagalog host for YouTube and tutorials.",
    "tags": [
      "Filipino",
      "Tagalog",
      "Friendly"
    ],
    "avatarColor": "#0284c7",
    "previewSampleText": "Mabuhay! Narito ang pinakamadaling paraan para gumawa ng mataas na kalidad na boses gamit ang sariling computer.",
    "baseSpeakerId": "fil-PH-AngeloNeural"
  },
  {
    "id": "voice-titan-nexus",
    "name": "Titan Nexus",
    "category": "Character",
    "gender": "Male",
    "accent": "Sci-Fi AI Synth",
    "language": "English (US)",
    "description": "Deep robotic interstellar AI commander with mechanical harmonic resonance.",
    "tags": [
      "Sci-Fi",
      "AI Commander",
      "Robotic"
    ],
    "avatarColor": "#06b6d4",
    "previewSampleText": "Commander, orbital synthesizers are locked. Unlimited audio generation protocol engaged.",
    "baseSpeakerId": "en-US-ChristopherNeural"
  },
  {
    "id": "voice-cyber-v",
    "name": "Cyber V",
    "category": "Character",
    "gender": "Female",
    "accent": "Cyberpunk Android",
    "language": "English (US)",
    "description": "Sleek cyberpunk synth assistant with metallic precision.",
    "tags": [
      "Cyberpunk",
      "Android",
      "Futuristic"
    ],
    "avatarColor": "#ec4899",
    "previewSampleText": "Neural link synchronized. Neural audio processing operating at peak efficiency across all sectors.",
    "baseSpeakerId": "en-US-AriaNeural"
  },
  {
    "id": "voice-eldertree",
    "name": "Eldertree",
    "category": "Character",
    "gender": "Male",
    "accent": "Ancient Wizard",
    "language": "English (US)",
    "description": "Wise ancient wizard for fantasy lore and RPG adventures.",
    "tags": [
      "Wizard",
      "Fantasy",
      "Lorekeeper"
    ],
    "avatarColor": "#854d0e",
    "previewSampleText": "Deep within the roots of the forgotten world, magic still stirs for those who remember the incantations.",
    "baseSpeakerId": "en-US-GuyNeural"
  },
  {
    "id": "voice-shadow-stalker",
    "name": "Shadow Stalker",
    "category": "Character",
    "gender": "Male",
    "accent": "Stealth Assassin",
    "language": "English (US)",
    "description": "Hushed, dangerous stealth operative voice for video games.",
    "tags": [
      "Stealth",
      "Assassin",
      "Gaming"
    ],
    "avatarColor": "#1e293b",
    "previewSampleText": "Keep your head low. The guards change watch in sixty seconds, and we only get one chance.",
    "baseSpeakerId": "en-US-EricNeural"
  },
  {
    "id": "voice-velvet-whisper",
    "name": "Velvet Whisper",
    "category": "Character",
    "gender": "Female",
    "accent": "ASMR Whisper",
    "language": "English (US)",
    "description": "Ultra-soft soothing whisper for sleep stories and ASMR relaxation.",
    "tags": [
      "ASMR",
      "Whisper",
      "Sleep Story"
    ],
    "avatarColor": "#d8b4fe",
    "previewSampleText": "Softly close your eyes, let go of the day, and drift into the peaceful quiet of the night.",
    "baseSpeakerId": "en-US-JennyNeural"
  },
  {
    "id": "voice-radio-1940",
    "name": "Radio 1940",
    "category": "Character",
    "gender": "Male",
    "accent": "Vintage Mid-Century",
    "language": "English (UK)",
    "description": "Mid-century radio serial host with vintage microphone crackle.",
    "tags": [
      "Vintage",
      "Radio 1940",
      "Historical"
    ],
    "avatarColor": "#78716c",
    "previewSampleText": "Good evening, ladies and gentlemen! We interrupt this broadcast to bring you a bulletin from the front.",
    "baseSpeakerId": "en-GB-OliverNeural"
  },
  {
    "id": "voice-neon-valkyrie",
    "name": "Neon Valkyrie",
    "category": "Character",
    "gender": "Female",
    "accent": "Arena Announcer",
    "language": "English (UK)",
    "description": "Electrifying battle arena announcer for esports tournaments.",
    "tags": [
      "Esports",
      "Announcer",
      "Hype"
    ],
    "avatarColor": "#f43f5e",
    "previewSampleText": "Round three begins now! Champions take your positions and prepare for maximum overdrive!",
    "baseSpeakerId": "en-GB-SoniaNeural"
  },
  {
    "id": "voice-chronicle-master",
    "name": "Chronicle Master",
    "category": "Character",
    "gender": "Male",
    "accent": "Dungeon Master",
    "language": "English (US)",
    "description": "Immersive tabletop RPG Dungeon Master guiding epic quests.",
    "tags": [
      "Dungeon Master",
      "Tabletop",
      "RPG"
    ],
    "avatarColor": "#4f46e5",
    "previewSampleText": "You enter the cavernous vault. The torchlight flickers against ancient runes carved into the stone doors.",
    "baseSpeakerId": "en-US-DavisNeural"
  },
  {
    "id": "voice-pixie-sprout",
    "name": "Pixie Sprout",
    "category": "Character",
    "gender": "Female",
    "accent": "Cartoon Pixie",
    "language": "English (US)",
    "description": "High-pitched whimsical fairy voice for animated cartoons and children apps.",
    "tags": [
      "Cartoon",
      "Fairy",
      "Whimsical"
    ],
    "avatarColor": "#a855f7",
    "previewSampleText": "Tee-hee! Look at all the colorful sparkles floating through the magical forest today!",
    "baseSpeakerId": "en-US-AnaNeural"
  },
  {
    "id": "voice-quantum-sovereign",
    "name": "Quantum Sovereign",
    "category": "Character",
    "gender": "Neutral",
    "accent": "Spacetime AI",
    "language": "English (US)",
    "description": "Omniscient, calm cosmic consciousness exploring eternity.",
    "tags": [
      "Cosmic",
      "Omniscient",
      "Spacetime"
    ],
    "avatarColor": "#6366f1",
    "previewSampleText": "Across billions of galaxies, matter converges and disperses in the eternal dance of creation.",
    "baseSpeakerId": "en-US-GuyNeural"
  }
];

export const PRESET_MODELS: CoquiModel[] = [
  {
    id: 'coqui-xtts-v2',
    name: 'Coqui XTTS-v2',
    architecture: 'XTTS-v2',
    description: 'State-of-the-art multi-lingual voice generation & zero-shot cloning. Generates 17 languages from just a 3-second reference audio sample.',
    sampleRate: 24000,
    isCustom: false,
    status: 'ready',
    multiSpeaker: true,
    vramFootprint: '~2.8 GB VRAM (CUDA)',
    device: 'CUDA / MPS / CPU',
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'tr', 'ru', 'nl', 'cs', 'ar', 'zh', 'ja', 'ko', 'hu', 'hi', 'ur'],
  },
  {
    id: 'coqui-vits-ljspeech',
    name: 'Coqui VITS (LJSpeech)',
    architecture: 'VITS',
    description: 'Variational Inference with adversarial learning for end-to-end Text-to-Speech. Blazing fast inference (10x real-time on CPU).',
    sampleRate: 22050,
    isCustom: false,
    status: 'ready',
    multiSpeaker: false,
    vramFootprint: '~0.8 GB VRAM / Minimal CPU',
    device: 'CPU / CUDA',
    languages: ['en'],
  },
  {
    id: 'coqui-vits-vctk',
    name: 'Coqui VCTK Multi-Speaker (109 Voices)',
    architecture: 'VCTK',
    description: 'Pre-trained multi-speaker VITS model covering 109 diverse English speakers with various regional accents.',
    sampleRate: 22050,
    isCustom: false,
    status: 'ready',
    multiSpeaker: true,
    vramFootprint: '~1.1 GB VRAM',
    device: 'CPU / CUDA',
    languages: ['en'],
  },
  {
    id: 'coqui-yourtts',
    name: 'Coqui YourTTS',
    architecture: 'YourTTS',
    description: 'Multi-speaker & cross-lingual zero-shot voice conversion and synthesis model. Low resource footprint.',
    sampleRate: 16000,
    isCustom: false,
    status: 'ready',
    multiSpeaker: true,
    vramFootprint: '~0.9 GB VRAM',
    device: 'CPU / CUDA',
    languages: ['en', 'fr', 'pt'],
  },
  {
    id: 'pocket-tts-kyutai',
    name: 'Pocket TTS (Kyutai 100M CPU Engine)',
    architecture: 'Pocket-TTS',
    description: 'Lightweight, ultra-fast 100M parameter CPU neural TTS by Kyutai Labs. Runs 6x real-time on CPU with 200ms latency, zero GPU requirements, and zero-shot voice cloning.',
    sampleRate: 24000,
    isCustom: false,
    status: 'ready',
    multiSpeaker: true,
    vramFootprint: 'Zero GPU / ~250 MB RAM (CPU-Native)',
    device: 'CPU (Any Laptop/PC/Server)',
    languages: ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'ur'],
  },
];

export const SAMPLE_TEXT_SCRIPTS = [
  {
    id: 'urdu-sample',
    title: 'Urdu & Roman Urdu Script',
    text: 'السلام علیکم! TOOL BY SHANI اسٹوڈیو میں آپ کا خیر مقدم ہے۔ اب آپ بغیر کسی کریکٹر لمٹ اور بغیر کسی کوٹہ ایرر کے، 130 سے زائد حقیقت پسندانہ آوازوں میں لامحدود متن کو انتہائی قدرتی اور صاف آڈیو میں تبدیل کر سکتے ہیں۔',
  },
  {
    id: 'audiobook',
    title: 'Audiobook Chapter (Epic Fantasy)',
    text: 'The wind through the obsidian peaks whispered of forgotten kingdoms. Elden tightened his cloak against the biting freeze, watching the faint glow of ember-moss beneath the ancient archway.\n\n"Seven centuries," he murmured to himself, his breath condensing in the pale mountain air. "Seven centuries since anyone walked this path with open eyes."\n\nFar below in the misted valley, the church bells of Oakhaven chimed midnight. It was time. He drew the silver compass from his pocket, watching its needle spin wildly before locking dead north toward the sunken spire.',
  },
  {
    id: 'documentary',
    title: 'Documentary Narration (Cosmos & Deep Sea)',
    text: 'Deep beneath the photic zone, in the perpetual midnight of the Mariana Trench, life persists not through sunlight, but through raw geothermal chemistry. Superheated water, laden with minerals from the Earth’s mantle, billows from hydrothermal vents into the freezing abyss.\n\nHere, giant tube worms and ghost crabs thrive in complete darkness. To study these ecosystems is to glimpse what life might resemble beneath the frozen ice sheets of Europa or Enceladus.',
  },
  {
    id: 'podcast',
    title: 'Tech Podcast Intro',
    text: 'Welcome back to TOOL BY SHANI, the studio where we explore the bleeding edge of open source AI, localized speech models, and developer sovereignty.\n\nToday, we are joined by lead engineers who transitioned their entire audio infrastructure from costly cloud APIs to private, locally hosted Coqui and Pocket TTS pipelines. We will discuss latency benchmarks, zero-shot speaker embedding math, and how to scale unlimited character audiobooks on consumer hardware.',
  },
  {
    id: 'dialogue',
    title: 'Multi-Speaker Dialogue (Script)',
    text: 'Speaker A: Did you verify the checkpoint weights before running the inference loop?\nSpeaker B: Yes, the tensor dimensions match perfectly. We are getting sub-100 millisecond time-to-first-chunk.\nSpeaker A: Incredible. That means we can stream entire chapters without hitting any cloud quotas.\nSpeaker B: Exactly. True ownership of the entire synthesis pipeline.',
  },
];
