export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export function splitTranscriptIntoSegments(
  transcript: string,
  videoDuration: number
): TranscriptSegment[] {
  if (!transcript || videoDuration <= 0) return [];

  const sentences = splitIntoSentences(transcript);
  if (sentences.length === 0) return [];

  const wordCounts = sentences.map(s => s.split(/\s+/).length);
  const totalWords = wordCounts.reduce((sum, c) => sum + c, 0);
  if (totalWords === 0) return [];

  const segments: TranscriptSegment[] = [];
  let currentStart = 0;

  for (let i = 0; i < sentences.length; i++) {
    const proportion = wordCounts[i] / totalWords;
    const segmentDuration = proportion * videoDuration;
    const end = i === sentences.length - 1
      ? videoDuration
      : currentStart + segmentDuration;

    segments.push({
      start: currentStart,
      end,
      text: sentences[i],
    });

    currentStart = end;
  }

  return segments;
}

function splitIntoSentences(text: string): string[] {
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

  const raw: string[] = [];
  let current = '';

  for (let i = 0; i < cleaned.length; i++) {
    current += cleaned[i];
    if (
      (cleaned[i] === '.' || cleaned[i] === '?' || cleaned[i] === '!') &&
      i + 1 < cleaned.length &&
      cleaned[i + 1] === ' ' &&
      !isAbbreviation(cleaned, i)
    ) {
      const trimmed = current.trim();
      if (trimmed) raw.push(trimmed);
      current = '';
    }
  }
  if (current.trim()) raw.push(current.trim());

  const merged: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const words = raw[i].split(/\s+/).length;
    if (words < 5 && merged.length > 0) {
      merged[merged.length - 1] += ' ' + raw[i];
    } else if (words < 5 && i + 1 < raw.length) {
      merged.push(raw[i] + ' ' + raw[i + 1]);
      i++;
    } else {
      merged.push(raw[i]);
    }
  }

  return merged;
}

function isAbbreviation(text: string, dotIndex: number): boolean {
  const abbrevPatterns = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Sr.', 'Jr.', 'vs.', 'etc.', 'i.e.', 'e.g.', 'v.'];
  const before = text.substring(Math.max(0, dotIndex - 5), dotIndex + 1);
  return abbrevPatterns.some(a => before.endsWith(a));
}

export function findCurrentSegment(
  segments: TranscriptSegment[],
  currentTime: number
): TranscriptSegment | null {
  if (segments.length === 0) return null;
  for (const seg of segments) {
    if (currentTime >= seg.start && currentTime < seg.end) {
      return seg;
    }
  }
  return segments[segments.length - 1];
}
