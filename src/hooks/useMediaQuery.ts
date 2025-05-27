import { useMediaQuery as useMantineMediaQuery } from '@mantine/hooks';

// Wrapper cho useMediaQuery của Mantine với breakpoints đã định nghĩa
export function useMediaQuery() {
  const isMobile = useMantineMediaQuery('(max-width: 576px)');
  const isTablet = useMantineMediaQuery('(min-width: 577px) and (max-width: 992px)');
  const isDesktop = useMantineMediaQuery('(min-width: 993px)');

  return {
    isMobile,
    isTablet,
    isDesktop
  };
}

export default useMediaQuery;
