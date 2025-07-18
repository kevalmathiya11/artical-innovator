<script lang="ts">
  interface QueryData {
    query: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: number;
  }

  interface TabData {
    id: string;
    name: string;
    count?: number;
  }

  // Sample data - you can replace this with your actual data
  const allQueryData: QueryData[] = [
    {
      query: "Kooku web series actress name",
      clicks: 299,
      impressions: 3163,
      ctr: "9.5%",
      position: 14
    },
    {
      query: "Kooku web series download",
      clicks: 245,
      impressions: 2890,
      ctr: "8.5%",
      position: 12
    },
    {
      query: "Kooku app free download",
      clicks: 189,
      impressions: 2456,
      ctr: "7.7%",
      position: 18
    },
    {
      query: "Kooku web series watch online",
      clicks: 167,
      impressions: 2234,
      ctr: "7.5%",
      position: 15
    },
    {
      query: "Kooku subscription price",
      clicks: 134,
      impressions: 1987,
      ctr: "6.7%",
      position: 22
    },
    {
      query: "Kooku latest episodes",
      clicks: 112,
      impressions: 1756,
      ctr: "6.4%",
      position: 19
    },
    {
      query: "Kooku web series list",
      clicks: 98,
      impressions: 1532,
      ctr: "6.4%",
      position: 16
    },
    {
      query: "Kooku premium account",
      clicks: 87,
      impressions: 1398,
      ctr: "6.2%",
      position: 24
    },
    {
      query: "Kooku series reviews",
      clicks: 76,
      impressions: 1245,
      ctr: "6.1%",
      position: 20
    },
    {
      query: "Kooku free trial",
      clicks: 65,
      impressions: 1098,
      ctr: "5.9%",
      position: 26
    },
    {
      query: "Kooku web series cast",
      clicks: 54,
      impressions: 967,
      ctr: "5.6%",
      position: 23
    },
    {
      query: "Kooku app install",
      clicks: 43,
      impressions: 834,
      ctr: "5.2%",
      position: 28
    },
    {
      query: "Kooku streaming platform",
      clicks: 32,
      impressions: 712,
      ctr: "4.5%",
      position: 31
    },
    {
      query: "Kooku original series",
      clicks: 21,
      impressions: 589,
      ctr: "3.6%",
      position: 35
    },
    {
      query: "Kooku web series trailer",
      clicks: 18,
      impressions: 456,
      ctr: "3.9%",
      position: 33
    }
  ];

  const tabs: TabData[] = [
    { id: "queries", name: "Queries" },
    { id: "pages", name: "Pages" },
    { id: "countries", name: "Countries" },
    { id: "devices", name: "Devices" },
    { id: "search-appearance", name: "Search Appearance" },
    { id: "dates", name: "Dates" },
    { id: "404-monitor", name: "404 Monitor" },
    { id: "categories", name: "Categories", count: 50 }
  ];

  let activeTab = "queries";
  let searchQuery = "";
  let currentPage = 1;
  const itemsPerPage = 7;

  // Reactive statements for filtering and pagination
  $: filteredData = allQueryData.filter(item => 
    item.query.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  $: totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  $: paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: totalResults = filteredData.length;

  // Reset to first page when search changes
  $: if (searchQuery) {
    currentPage = 1;
  }

  function setActiveTab(tabId: string) {
    activeTab = tabId;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  function clearSearch() {
    searchQuery = "";
    currentPage = 1;
  }
</script>

<div class="w-full max-w-7xl mx-auto p-6 bg-white">
  <!-- Tabs -->
  <div class="border-b border-gray-200 mb-6">
    <nav class="flex space-x-8" aria-label="Tabs">
      {#each tabs as tab}
        <button
          class="py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap {activeTab === tab.id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab(tab.id)}
        >
          {tab.name}
          {#if tab.count}
            <span class="ml-1 text-xs text-gray-400">({tab.count})</span>
          {/if}
        </button>
      {/each}
    </nav>
  </div>

  <!-- Content Area -->
  {#if activeTab === "queries"}
    <div class="space-y-4">
      <!-- Header with Search and Pagination -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Queries</h2>
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search keywords..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <!-- Pagination -->
          <div class="flex items-center space-x-2">
            <button
              on:click={prevPage}
              disabled={currentPage === 1}
              class="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <span class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md">
              {currentPage}
            </span>
            
            <button
              on:click={() => goToPage(2)}
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 {currentPage === 2 ? 'bg-indigo-50 text-indigo-600' : ''}"
            >
              2
            </button>
            
            <button
              on:click={nextPage}
              disabled={currentPage === totalPages}
              class="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="py-3.5 pl-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Top Queries
              </th>
              <th class="py-3.5 pl-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Clicks
              </th>
              <th class="py-3.5 pl-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Impressions
              </th>
              <th class="py-3.5 pl-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                CTR
              </th>
              <th class="py-3.5 pl-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider w-20">
                Position
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each paginatedData as item, index}
              <tr class="bg-white transition-all duration-200 hover:bg-gray-50">
                <td class="py-3.5 pl-4 text-xs font-normal text-gray-800">
                  {item.query}
                </td>
                <td class="py-3.5 pl-4 text-xs font-normal text-blue-600">
                  {item.clicks}
                </td>
                <td class="py-3.5 pl-4 text-xs font-normal text-purple-600">
                  {item.impressions}
                </td>
                <td class="py-3.5 pl-4 text-xs font-normal text-green-600">
                  {item.ctr}
                </td>
                <td class="py-3.5 pl-4 text-xs font-normal text-orange-600">
                  {item.position}
                </td>
              </tr>
            {/each}
            {#if paginatedData.length === 0}
              <tr>
                <td colspan="5" class="py-8 px-4 text-center text-gray-500">
                  <div class="flex flex-col items-center space-y-2">
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm">No queries found matching "{searchQuery}"</span>
                    <button
                      on:click={clearSearch}
                      class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {tabs.find(tab => tab.id === activeTab)?.name} Content
        </h3>
        <p class="text-sm">
          This tab's content would be displayed here. Add your specific data and components for the {tabs.find(tab => tab.id === activeTab)?.name} tab.
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom colors matching your design */
  .text-custom-blue {
    color: #3b82f6;
  }
  
  .text-custom-violate {
    color: #8b5cf6;
  }
  
  .text-custom-green {
    color: #10b981;
  }
  
  .text-custom-orange {
    color: #f59e0b;
  }
</style>