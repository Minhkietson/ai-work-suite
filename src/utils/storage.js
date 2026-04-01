// ============================================
// AI Work Suite — Storage Utilities
// ============================================

const STORAGE_PREFIX = 'aws_';

export function get(key, fallback = null) {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

export function remove(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}
