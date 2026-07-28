export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/ral-connect',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'ral-connect-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
  },
});
