const prototypeStoragePrefix = "brand-pilot";

type PrototypeStorage = Pick<Storage, "length" | "key" | "removeItem">;

export function clearPrototypeData(storage: PrototypeStorage): void {
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => Boolean(key?.startsWith(prototypeStoragePrefix)));

  keys.forEach((key) => storage.removeItem(key));
}
