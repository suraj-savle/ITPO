import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🚀 Starting PMSSS Backend Server...');
console.log('📋 Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 5000);
console.log('- MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

// Import and start the server
import('./server.js').catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});