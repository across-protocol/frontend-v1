type SetTime = (time: number) => void;
export function Timer(setTime: SetTime, delay = 30000) {
  const interval = setInterval(() => {
    setTime(Date.now());
  }, delay);
  return () => clearInterval(interval);
}
