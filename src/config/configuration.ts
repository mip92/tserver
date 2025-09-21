export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
  },
  sms: {
    clientId: process.env.KYIVSTAR_CLIENT_ID,
    clientSecret: process.env.KYIVSTAR_CLIENT_SECRET,
    apiUrl: process.env.KYIVSTAR_API_URL,
    sender: process.env.SMS_SENDER,
  },
});
