// src/stores/loader.ts
import { writable, derived } from 'svelte/store';
import { navigating } from '$app/stores';

// Manual loader for API or custom logic
export const manualLoading = writable(false);

// Combined global loader: true if navigating or manually loading
export const isGlobalLoading = derived(
  [navigating, manualLoading],
  ([$navigating, $manualLoading]) => !!$navigating || $manualLoading
);
