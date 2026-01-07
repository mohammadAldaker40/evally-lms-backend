-- Add hashed refresh token storage for rotating refresh tokens
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hashedRefreshToken" TEXT;

