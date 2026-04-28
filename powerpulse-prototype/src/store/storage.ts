import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveJSON(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadJSON<T>(key: string): Promise<T | undefined> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return undefined;
  return JSON.parse(raw) as T;
}

