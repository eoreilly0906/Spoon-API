import { User } from '../models/index.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'Admin123', email: 'admin@gmail.com', password: 'password' },
    { username: 'eoreilly0906', email: 'eoreilly0906@gmail.com', password: 'password' },
  ], { individualHooks: true });
};
