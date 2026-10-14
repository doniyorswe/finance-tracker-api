const toSnakeKey = (key: string) =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
}

/**
 * Obyekt kalitlarini chuqur (nested) snake_case ga o'giradi.
 * Date, Decimal kabi class instance'lar o'zgarishsiz qoladi.
 */
export function toSnakeCase<T>(value: T): unknown {
  if (Array.isArray(value)) return value.map((item) => toSnakeCase(item));
  if (!isPlainObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      toSnakeKey(key),
      toSnakeCase(val),
    ]),
  );
}
