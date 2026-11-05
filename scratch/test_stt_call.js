const { transcribeAudio } = require('../../../../../../OneDrive/Desktop/my_Folder/Jyothi Work/Project 1/lib/adapters/stt-service');

async function testSTT() {
  // Create 1-second WAV
  const sampleRate = 8000;
  const numSamples = 8000;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  const base64 = buffer.toString('base64');

  const res = await transcribeAudio({
    audioBase64: base64,
    mimeType: 'audio/wav',
    providerOverride: 'groq',
    apiKeyOverride: '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'
  });

  console.log('PROVIDER USED:', res.providerUsed);
  console.log('TRANSCRIPT:', res.transcript);
}

testSTT().catch(console.error);
