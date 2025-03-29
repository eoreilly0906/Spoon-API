const forceDatabaseRefresh = true;

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import cors from 'cors';
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import { seedUsers } from './seeds/user-seeds.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

// Catch-all route to handle client-side routing
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../../client/dist/index.html'));
});

sequelize.sync({force: forceDatabaseRefresh}).then(async () => {
  if (forceDatabaseRefresh) {
    await seedUsers();
    console.log('\n----- DATABASE SEEDED -----\n');
  }
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
