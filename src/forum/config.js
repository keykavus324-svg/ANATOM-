// Supabase bağlantısı — topluluk panosunun arka ucu.
//
// Buradaki anahtar "publishable" (istemci) türündedir: herkesin görebileceği bir
// istemci anahtarı olup erişim, veritabanındaki satır düzeyinde güvenlik (RLS)
// kurallarıyla sınırlıdır. Üretimde GitHub Actions gizli değişkenleriyle
// VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY eklenebilir; tanımlanmazsa
// bu sabitler kullanılır.
export const SUPABASE_URL = 'https://hwmzjbyezfzyppiwfmsz.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_IW3GEPdIfZLMSLw1dPw4uQ_A4NCsPxj';

export function supabaseApiUrl() {
  const fromEnv = import.meta.env?.VITE_SUPABASE_URL;
  return String(fromEnv || SUPABASE_URL).replace(/\/$/, '');
}

export function supabaseApiKey() {
  return import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY;
}

export function isRemoteConfigured() {
  // Testler VITE_FORUM_MODE=local ile cihaz içi panoyu, =remote ile sunucu panosunu seçer.
  const forced = import.meta.env?.VITE_FORUM_MODE;
  if (forced === 'local') return false;
  if (forced === 'remote') return true;
  return Boolean(supabaseApiUrl() && supabaseApiKey());
}
