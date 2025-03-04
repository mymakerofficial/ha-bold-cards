export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function firstOf<T>(list: T[] | undefined): T | undefined {
  if (!list) {
    return undefined;
  }
  return list[0];
}

export function lastOf<T>(list: T[] | undefined): T | undefined {
  if (!list) {
    return undefined;
  }
  return list[list.length - 1];
}
