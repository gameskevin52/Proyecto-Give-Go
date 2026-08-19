// Manejo de almacenamiento local compatible con React Native / Expo y navegador Web
export const LocalStorage = () => {
  const save = async (key: string, value: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.log('Error en Local Storage save: ' + error);
    }
  };

  const getItem = async (key: string): Promise<string | null> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.log('Error en Local Storage getItem: ' + error);
      return null;
    }
  };

  const remove = async (key: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.log('Error en Local Storage remove: ' + error);
    }
  };

  return {
    save,
    getItem,
    remove,
  };
};
