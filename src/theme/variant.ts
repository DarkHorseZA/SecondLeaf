export type Variant = 'v1' | 'v2';

/**
 * Read at bundle time by Metro (EXPO_PUBLIC_* vars are inlined).
 * Defaults to v1 so omitting the env var preserves existing behaviour.
 */
export const VARIANT: Variant =
  (process.env.EXPO_PUBLIC_VARIANT as Variant) === 'v2' ? 'v2' : 'v1';

export const isV2 = VARIANT === 'v2';
