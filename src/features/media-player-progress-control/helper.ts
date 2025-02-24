export function formatDuration(durationSeconds: number | undefined) {
  if (durationSeconds === undefined) {
    return "0:00";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
