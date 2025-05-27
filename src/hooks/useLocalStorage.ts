import { useState, useEffect } from 'react';

// Hook để lưu trữ dữ liệu trong localStorage với type safety
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Khởi tạo state với giá trị từ localStorage hoặc giá trị mặc định
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Cập nhật localStorage khi state thay đổi
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
