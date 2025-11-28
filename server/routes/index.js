import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);

export default router;
