const https = require('https');

const apiKey = 'AIzaSyApYihhmbY8qf8ohrXjMm3oxSBR1NTRUZI';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log('Available Models:');
        json.models.forEach(model => {
          console.log(`- ${model.name}: ${model.displayName}`);
          console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
        });
      } else {
        console.log('No models found or error:', data);
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching models:', err.message);
});
