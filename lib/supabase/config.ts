export class SupabaseConfig {
  public static get supabaseUrl(): string {
    if (!process.env.SUPA_URL) {
      throw new Error('Supa URL is not defined in environment variables');
    }

    return process.env.SUPA_URL;
  }

  public static get supabaseKey(): string {
    if (!process.env.SUPA_KEY) {
      throw new Error('Supa Key is not defined in environment variables');
    }
    return process.env.SUPA_KEY;
  }
}
