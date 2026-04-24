export const chunkText = (text) => {
  console.log(`[Chunker] Starting chunking process for text of length ${text.length}...`);
  const chunks = [];
  const paragraphs = text.split(/\n\s*\n/);

  let currentChunk = [];
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const trimmedPara = paragraph.trim();
    if (!trimmedPara) continue;

    const sentences = trimmedPara.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      const wordCount = trimmed.split(/\s+/).length;

      if (currentWordCount + wordCount > 250 && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentWordCount = 0;
      }

      currentChunk.push(trimmed);
      currentWordCount += wordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  console.log(`[Chunker] Created ${chunks.length} chunks.`);
  return chunks;
};

