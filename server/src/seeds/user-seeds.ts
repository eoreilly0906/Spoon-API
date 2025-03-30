import { User } from '../models/index.js';

export const seedUsers = async () => {
  console.log('Starting user seeding...');
  try {
    const users = await User.bulkCreate([
      { username: 'Admin123', email: 'admin@gmail.com', password: 'password' },
      { username: 'eoreilly0906', email: 'eoreilly0906@gmail.com', password: 'password' },
    ], { individualHooks: true });
    
    console.log('Users seeded successfully:', users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      hasPassword: !!user.password
    })));
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};
