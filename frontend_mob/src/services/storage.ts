import AsyncStorage from '@react-native-async-storage/async-storage';
import { Organizacion } from '../types';

const ORGS_STORAGE_KEY = '@give_and_go_organizaciones';

export const saveOrganizacion = async (nuevaOrg: Organizacion): Promise<Organizacion[]> => {
  try {
    const existing = await getOrganizaciones();
    const updated = [nuevaOrg, ...existing];
    await AsyncStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error guardando organización en AsyncStorage:', error);
    return [];
  }
};

export const getOrganizaciones = async (): Promise<Organizacion[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ORGS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error obteniendo organizaciones de AsyncStorage:', error);
    return [];
  }
};

export const clearOrganizaciones = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ORGS_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando AsyncStorage:', error);
  }
};
