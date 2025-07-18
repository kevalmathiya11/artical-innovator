<!-- Pagination.svelte -->
<script lang="ts">
  // Types
  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }

  // Props
  export let pagination: PaginationProps;
  export let handlePageChange: (page: number) => void;

  // Calculate visible pages with ellipsis logic
  $: visiblePages = (() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 10;
    
    if (pagination.totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to max visible
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages
      for (let i = 1; i <= Math.min(3, pagination.totalPages); i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (pagination.currentPage > 6 && pagination.totalPages > 7) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(4, pagination.currentPage - 1);
      const end = Math.min(pagination.totalPages - 3, pagination.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i > 3 && i < pagination.totalPages - 2) {
          pages.push(i);
        }
      }
      
      // Add ellipsis if needed
      if (pagination.currentPage < pagination.totalPages - 5 && pagination.totalPages > 7) {
        pages.push('ellipsis-end');
      }
      
      // Always show last 3 pages
      for (let i = Math.max(pagination.totalPages - 2, 4); i <= pagination.totalPages; i++) {
        if (i > 3) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  })();
</script>

<!-- Pagination -->
<div class="flex items-center justify-between bg-white py-4">
  <div class="flex flex-1 justify-between sm:hidden">
    <button 
      on:click={() => handlePageChange(pagination.currentPage - 1)}
      disabled={!pagination.hasPrevious}
      class="relative inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Previous
    </button>
    <button 
      on:click={() => handlePageChange(pagination.currentPage + 1)}
      disabled={!pagination.hasNext}
      class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      Next
    </button>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
    <div class="hidden">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">1</span>
        to
        <span class="font-medium">10</span>
        of
        <span class="font-medium">97</span>
        results
      </p>
    </div>
    <div>
      <nav class="isolate inline-flex space-x-1 rounded-md" aria-label="Pagination">
        <button
          on:click={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevious}
          class="relative inline-flex items-center rounded-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"></path>
          </svg>
        </button>
        
        {#each visiblePages as page, i}
          {#if typeof page === 'string' && page.includes('ellipsis')}
            <span class="relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
          {:else if typeof page === 'number'}
            {#if page === pagination.currentPage}
              <button
                aria-current="page"
                class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {page}
              </button>
            {:else}
              <button
                on:click={() => handlePageChange(page)}
                class="relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                {page}
              </button>
            {/if}
          {/if}
        {/each}
        
        <button
          on:click={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          class="relative inline-flex items-center rounded-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </nav>
    </div>
  </div>
</div>

<!-- Usage Example -->
<!-- 
<script lang="ts">
  import Pagination from './Pagination.svelte';
  
  let currentPage = 1;
  let totalPages = 50;
  
  $: pagination = {
    currentPage,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  };
  
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Add your page change logic here
      console.log('Page changed to:', page);
    }
  }
</script>


-->

