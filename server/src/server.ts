const forceDatabaseRefresh = true;

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { join } from 'path';
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import { seedUsers } from './seeds/user-seeds.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(routes);

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
