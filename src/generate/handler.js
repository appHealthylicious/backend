// src/generate/handler.js

const { spawn } = require('child_process');
const path = require('path');

const generateRecommendationsHandler = async (request, h) => {
  try {
    const { ingredients } = request.payload;
    console.log(`Received generate request with ingredients: ${ingredients}`);
    
    const pythonProcess = spawn('python', [path.join(__dirname, 'model.py'), ingredients]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data.toString()}`);
    });

    return new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          reject(h.response({ error: 'Failed to generate recommendations' }).code(500));
        }

        const recommendations = JSON.parse(dataString);
        resolve(h.response(recommendations).code(200));
      });
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { generateRecommendationsHandler };
