function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const OMDB_API_KEY = requireEnv('OMDB_API_KEY');

let _MONGODB_URI: string | null = null;
export function getMongoUri(): string {
  if (!_MONGODB_URI) {
    _MONGODB_URI = requireEnv('MONGODB_URI');
  }
  return _MONGODB_URI;
}

export const API_KEY = process.env.API_KEY || '';
