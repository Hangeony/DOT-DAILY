// 성능 최적화 유틸리티

/**
 * 디바운스 함수 - 연속된 호출을 제한
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 쓰로틀 함수 - 일정 시간 간격으로 호출 제한
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 메모이제이션 헬퍼 - 객체 키 기반
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 이미지 지연 로딩을 위한 Intersection Observer
 */
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: "50px",
      threshold: 0.1,
    }
  );
}

/**
 * 성능 측정 헬퍼
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name} 실행 시간: ${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * 비동기 성능 측정 헬퍼
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  console.log(`${name} 실행 시간: ${(end - start).toFixed(2)}ms`);
  return result;
}
