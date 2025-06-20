import { useState, useEffect, useRef } from 'react';

// Hook để debounce state, hữu ích cho search input hoặc form validation
export function useDebouncedState<T>(initialValue: T, delay = 500) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Xóa timer cũ nếu có
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Đặt timer mới
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cleanup khi component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue] as const;
}

export default useDebouncedState;
