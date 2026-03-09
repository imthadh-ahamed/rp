import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import diagramRoutes from './diagramRoutes.js';
import milestoneRoutes from './milestoneRoutes.js';

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
router.use('/diagram', diagramRoutes);
router.use('/milestones', milestoneRoutes);

export default router;
