import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Configure Multer for memory storage (we don't need to save files to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Remove Background API Proxy
app.post('/api/remove-bg', upload.single('image_file'), async (req, res) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      console.error('REMOVE_BG_API_KEY is missing on server');
      return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Prepare FormData for Remove.bg
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('size', 'auto');

    console.log('Forwarding request to Remove.bg...');

    // Call external API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': apiKey,
      },
      responseType: 'arraybuffer', // Important to get binary image data
    });

    console.log('Received response from Remove.bg:', response.status);

    // Forward the image back to client
    res.set('Content-Type', 'image/png');
    res.send(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    if (error.response) {
      console.error('External API Error:', error.response.data.toString());
      // Try to parse JSON error from Remove.bg if possible
      try {
        const errorJson = JSON.parse(error.response.data.toString());
        return res.status(error.response.status).json(errorJson);
      } catch (e) {
        return res.status(error.response.status).send(error.response.data);
      }
    }
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
