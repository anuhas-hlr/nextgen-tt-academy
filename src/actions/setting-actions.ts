'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateAcademySetting(key: string, value: any) {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('academy_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
