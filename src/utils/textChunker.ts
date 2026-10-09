import { TextChunk } from '../types/tts';

/**
 * Splits arbitrary length text into natural, linguistic chunks
 * optimized for Coqui XTTS-v2 / VITS neural synthesis.
 * Preserves sentence rhythm, punctuation, and speech cadence.
 */
export function splitTextIntoChunks(text: string, maxChunkChars: number = 240): TextChunk[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Normalize line endings
  const normalized = trimmed.replace(/\r\n/g, '\n');

  // Split into paragraphs
  const paragraphs = normalized.split(/\n{2,}/);
  const rawChunks: string[] = [];

  for (const paragraph of paragraphs) {
    const cleanPara = paragraph.trim();
    if (!cleanPara) continue;

    if (cleanPara.length <= maxChunkChars) {
      rawChunks.push(cleanPara);
      continue;
    }

    // Split paragraph by sentence terminators (. ! ? ; or newline)
    // Positive lookahead or regex match
    const sentenceRegex = /([^.!?;\n]+[.!?;\n]+(?:\s+|$)|[^.!?;\n]+$)/g;
    const sentences = cleanPara.match(sentenceRegex) || [cleanPara];

    let currentChunk = '';

    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (!cleanSentence) continue;

      if ((currentChunk + ' ' + cleanSentence).trim().length <= maxChunkChars) {
        currentChunk = currentChunk ? `${currentChunk} ${cleanSentence}` : cleanSentence;
      } else {
        if (currentChunk) {
          rawChunks.push(currentChunk);
          currentChunk = '';
        }

        // If a single sentence is longer than maxChunkChars, split on clause boundaries (, : -) or words
        if (cleanSentence.length > maxChunkChars) {
          const subClauses = splitLongSentence(cleanSentence, maxChunkChars);
          rawChunks.push(...subClauses);
        } else {
          currentChunk = cleanSentence;
        }
      }
    }

    if (currentChunk) {
      rawChunks.push(currentChunk);
    }
  }

  // Convert raw strings into TextChunk objects
  return rawChunks.map((chunkText, idx) => {
    const words = chunkText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    // Average speech rate is ~145-160 words per minute (approx 2.5 words/sec)
    const estimatedDurationSec = Math.max(0.8, Number((wordCount / 2.6).toFixed(1)));

    return {
      index: idx,
      text: chunkText,
      charCount: chunkText.length,
      wordCount,
      estimatedDurationSec,
      status: 'idle',
    };
  });
}

function splitLongSentence(sentence: string, maxChunkChars: number): string[] {
  const chunks: string[] = [];
  // Try splitting on comma, colon, em-dash
  const clauseRegex = /([^,:—–]+[,:—–]+(?:\s+|$)|[^,:—–]+$)/g;
  const clauses = sentence.match(clauseRegex) || [sentence];

  let current = '';

  for (const clause of clauses) {
    const cleanClause = clause.trim();
    if (!cleanClause) continue;

    if ((current + ' ' + cleanClause).trim().length <= maxChunkChars) {
      current = current ? `${current} ${cleanClause}` : cleanClause;
    } else {
      if (current) {
        chunks.push(current);
        current = '';
      }

      // If a single clause is still too long, split strictly on word boundaries
      if (cleanClause.length > maxChunkChars) {
        const words = cleanClause.split(/\s+/);
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).trim().length <= maxChunkChars) {
            wordChunk = wordChunk ? `${wordChunk} ${w}` : w;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = w;
          }
        }
        if (wordChunk) chunks.push(wordChunk);
      } else {
        current = cleanClause;
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

/**
 * Text Preprocessing helper: expands common symbols and normalizes whitespace
 */
export function preprocessText(text: string): string {
  let processed = text;

  // Replace common symbols with readable phonetics
  processed = processed
    .replace(/&/g, ' and ')
    .replace(/@/g, ' at ')
    .replace(/%/g, ' percent ')
    .replace(/\$/g, ' dollars ')
    .replace(/€/g, ' euros ')
    .replace(/£/g, ' pounds ')
    .replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ')
    .replace(/\bvs\.\b/gi, 'versus')
    .replace(/\betc\.\b/gi, 'et cetera')
    .replace(/\be\.g\.\b/gi, 'for example')
    .replace(/\bi\.e\.\b/gi, 'that is');

  // Collapse excessive spaces
  processed = processed.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  return processed;
}

export function estimateSpeechDuration(text: string, speed: number = 1.0): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  // 150 words per minute base rate
  const baseSeconds = (words / 150) * 60;
  return Number((baseSeconds / (speed || 1.0)).toFixed(1));
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const dec = Math.floor((seconds % 1) * 10);

  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${dec}`;
}
