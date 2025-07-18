// sidebarStore.ts

import { writable } from 'svelte/store';

// Utility functions to get/set localStorage
function getLocalStorageSidebarState(): boolean {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('isSidebarOpen');
    return stored ? JSON.parse(stored) : false;
  }
  return false;
}

function setLocalStorageSidebarState(value: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('isSidebarOpen', JSON.stringify(value));
  }
}

// Create writable store with initial value
const isSidebarOpen = writable<boolean>(getLocalStorageSidebarState());

// Subscribe to store changes and sync to localStorage
isSidebarOpen.subscribe((value) => {
  setLocalStorageSidebarState(value);
});

// Optional: Other UI-related stores
const isSettingsPanelOpen = writable<boolean>(false);
const isSearchBoxOpen = writable<boolean>(false);
const loading = writable<boolean>(true);

// Export stores for use in components
export {
  isSidebarOpen,
  isSettingsPanelOpen,
  isSearchBoxOpen,
  loading
};
