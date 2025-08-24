module.exports = {
  PORT: process.env.PORT || 5001,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h',
  CORS_ORIGIN: ["http://localhost:5173"],
  SALT_ROUNDS: 10
};
