<script lang="ts">
  import { onMount } from 'svelte';
  import { expoOut } from 'svelte/easing';

  interface Category {
    id: number;
    name: string;
    count: number;
  }

  const categories: Category[] = [
    { id: 1, name: 'Category 1', count: 15 },
    { id: 2, name: 'Category 2', count: 10 },
    { id: 3, name: 'Category 3', count: 8 },
    { id: 4, name: 'Category 4', count: 12 },
    { id: 5, name: 'Category 5', count: 20 },
  ];

  let searchTerm = '';
  let isDropdownOpen = false;
  export let className: string = '';
 export let selectedCategories: Category[] = [];
 export let placeholder: string = 'Search Categories';
  let filteredCategories: Category[] = categories;

  $: {
    filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  function toggleCategory(categoryId: number, selected: boolean) {
    if (selected) {
      const category = categories.find(c => c.id === categoryId);
      if (category && !selectedCategories.find(c => c.id === categoryId)) {
        selectedCategories = [...selectedCategories, category];
      }
    } else {
      selectedCategories = selectedCategories.filter(c => c.id !== categoryId);
    }
  }

  function removeCategory(categoryId: number) {
    toggleCategory(categoryId, false);
  }

  function handleInputFocus() {
    isDropdownOpen = true;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-search')) {
      isDropdownOpen = false;
    }
  }

  function isCategorySelected(categoryId: number): boolean {
    return selectedCategories.some(c => c.id === categoryId);
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="bg-white rounded-lg text-sm">
  <span class="text-gray-600 pb-1">Categories</span>
  <div class="category-search relative">
    <div class="flex flex-wrap gap-2 mb-2 pt-2" id="selected-categories">
      {#each selectedCategories as category (category.id)}
        <span 
          class="relative rounded-lg border border-solid border-gray-200 mr-2 pl-2 pr-4 py-1 flex items-center"
          data-id={category.id}
        >
          {category.name}
          <button 
            class="ml-1.5 text-blue-800 hover:text-blue-900 absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 p-1 hover:opacity-90"
            data-id={category.id}
            on:click={() => removeCategory(category.id)}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0C2.245 0 0 2.245 0 5C0 7.755 2.245 10 5 10C7.755 10 10 7.755 10 5C10 2.245 7.755 0 5 0ZM6.68 6.15C6.825 6.295 6.825 6.535 6.68 6.68C6.605 6.755 6.51 6.79 6.415 6.79C6.32 6.79 6.225 6.755 6.15 6.68L5 5.53L3.85 6.68C3.775 6.755 3.68 6.79 3.585 6.79C3.49 6.79 3.395 6.755 3.32 6.68C3.175 6.535 3.175 6.295 3.32 6.15L4.47 5L3.32 3.85C3.175 3.705 3.175 3.465 3.32 3.32C3.465 3.175 3.705 3.175 3.85 3.32L5 4.47L6.15 3.32C6.295 3.175 6.535 3.175 6.68 3.32C6.825 3.465 6.825 3.705 6.68 3.85L5.53 5L6.68 6.15Z" fill="#DF6137"></path>
            </svg>
          </button>
        </span>
      {/each}
    </div>
    <input 
      type="text" 
      id="category-input" 
      placeholder={placeholder}
      class={`${className} px-4 py-2 border border-solid border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
      bind:value={searchTerm}
      on:focus={handleInputFocus}
    >
    <div 
      id="category-dropdown"
      class={`${className}absolute z-10 mt-1  bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto`}
      class:hidden={!isDropdownOpen}
    >
      {#each filteredCategories as category (category.id)}
        <div class="p-2 hover:bg-gray-100 cursor-pointer">
          <label class="flex items-center justify-between">
            <span class="flex items-center">
              <input 
                type="checkbox" 
                class="mr-2" 
                data-id={category.id}
                checked={isCategorySelected(category.id)}
                on:change={(e) => toggleCategory(category.id, e.currentTarget.checked)}
              >
              {category.name}
            </span>
            <span class="hidden bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {category.count}
            </span>
          </label>
        </div>
      {/each}
    </div>
  </div>
</div>