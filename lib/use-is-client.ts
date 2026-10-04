import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true after. For UI built from localStorage. */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
