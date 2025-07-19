<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{
    close: void;
    imageSelected: { src: string; type: 'search' | 'template' | 'generated' };
    generateImage: { selectedImages: string[]; templateId?: string; templateInput?: string };
    saveImages: { selectedImages: string[] };
  }>();

  interface SearchItem {
    id: string;
    keyword: string;
  }

  interface ImageItem {
    id: string;
    src: string;
    alt: string;
    selected: boolean;
    tags?: string[];
  }

  interface TemplateItem extends ImageItem {
    category: string;
    requiresMoreImages?: boolean;
    minRequired?: number;
  }

  // State
  let searchInput = '';
  let templateInput = '';
  let showSearchPopup = false;
  let selectedCategory = 'Category';
  let selectedTag = 'All Tags';
  
  let recentSearches: SearchItem[] = [
    { id: '1', keyword: 'Architecture' },
    { id: '2', keyword: 'Nature' },
    { id: '3', keyword: 'Technology' },
    { id: '4', keyword: 'Business' },
    { id: '5', keyword: 'Abstract' },
  ];

  // Available tags for filtering
  let availableTags = ['All Tags', 'Architecture', 'Nature', 'Technology', 'Business', 'Abstract', 'Outdoor', 'Indoor', 'Modern', 'Classic'];

  // All available images for search
let allSearchImages: ImageItem[] = [
  { id: '1', src: 'https://picsum.photos/seed/arch1/400/400', alt: 'Architecture Building', selected: false, tags: ['Architecture', 'Modern'] }, // Square
  { id: '2', src: 'https://picsum.photos/seed/arch2/400/600', alt: 'Modern Architecture', selected: false, tags: ['Architecture', 'Modern', 'Outdoor'] }, // Portrait
  { id: '3', src: 'https://picsum.photos/seed/arch3/600/400', alt: 'Classical Architecture', selected: false, tags: ['Architecture', 'Classic', 'Outdoor'] }, // Landscape
  { id: '4', src: 'https://picsum.photos/seed/arch4/500/500', alt: 'Urban Architecture', selected: false, tags: ['Architecture', 'Modern', 'Outdoor'] }, // Square
  { id: '5', src: 'https://picsum.photos/seed/arch5/350/500', alt: 'Historic Architecture', selected: false, tags: ['Architecture', 'Classic', 'Outdoor'] }, // Portrait
  { id: '6', src: 'https://picsum.photos/seed/arch6/600/350', alt: 'Contemporary Architecture', selected: false, tags: ['Architecture', 'Modern', 'Indoor'] }, // Landscape
  { id: '7', src: 'https://picsum.photos/seed/nature1/500/500', alt: 'Mountain Nature', selected: false, tags: ['Nature', 'Outdoor'] }, // Square
  { id: '8', src: 'https://picsum.photos/seed/nature2/400/600', alt: 'Forest Nature', selected: false, tags: ['Nature', 'Outdoor'] }, // Portrait
  { id: '9', src: 'https://picsum.photos/seed/nature3/600/400', alt: 'Ocean Nature', selected: false, tags: ['Nature', 'Outdoor'] }, // Landscape
  { id: '10', src: 'https://picsum.photos/seed/tech1/400/600', alt: 'Technology Computer', selected: false, tags: ['Technology', 'Indoor', 'Modern'] }, // Portrait
  { id: '11', src: 'https://picsum.photos/seed/tech2/600/400', alt: 'Technology Innovation', selected: false, tags: ['Technology', 'Indoor', 'Modern'] }, // Landscape
  { id: '12', src: 'https://picsum.photos/seed/tech3/500/500', alt: 'Technology Digital', selected: false, tags: ['Technology', 'Indoor', 'Modern'] }, // Square
  { id: '13', src: 'https://picsum.photos/seed/business1/400/550', alt: 'Business Meeting', selected: false, tags: ['Business', 'Indoor', 'Modern'] }, // Portrait
  { id: '14', src: 'https://picsum.photos/seed/business2/600/400', alt: 'Business Office', selected: false, tags: ['Business', 'Indoor', 'Modern'] }, // Landscape
  { id: '15', src: 'https://picsum.photos/seed/abstract1/400/400', alt: 'Abstract Art', selected: false, tags: ['Abstract', 'Modern'] }, // Square
  { id: '16', src: 'https://picsum.photos/seed/abstract2/500/350', alt: 'Abstract Design', selected: false, tags: ['Abstract', 'Modern'] }, // Landscape
];

  let searchImages: ImageItem[] = [...allSearchImages];
  let selectedSearchImages: ImageItem[] = [];

  let templateImages: TemplateItem[] = [
    { id: 't1', src: 'https://picsum.photos/seed/temp1/400/300', alt: 'Template 1', selected: false, category: 'Social Media' },
    { id: 't2', src: 'https://picsum.photos/seed/temp2/400/300', alt: 'Template 2', selected: false, category: 'Social Media' },
    { id: 't3', src: 'https://picsum.photos/seed/temp3/400/300', alt: 'Template 3', selected: false, category: 'Social Media', requiresMoreImages: true, minRequired: 3 },
    { id: 't4', src: 'https://picsum.photos/seed/temp4/400/300', alt: 'Template 4', selected: false, category: 'Social Media' },
  ];

  let generatedImages: ImageItem[] = [
    { id: 'g1', src: 'https://picsum.photos/seed/gen1/400/300', alt: 'Generated 1', selected: false },
    { id: 'g2', src: 'https://picsum.photos/seed/gen2/400/300', alt: 'Generated 2', selected: false },
    { id: 'g3', src: 'https://picsum.photos/seed/gen3/400/300', alt: 'Generated 3', selected: false },
    { id: 'g4', src: 'https://picsum.photos/seed/gen4/400/300', alt: 'Generated 4', selected: false },
    { id: 'g5', src: 'https://picsum.photos/seed/gen5/400/300', alt: 'Generated 5', selected: false },
  ];

  // Computed values
  $: selectedSearchCount = searchImages.filter(img => img.selected).length;
  $: selectedTemplateCount = templateImages.filter(img => img.selected).length;
  $: selectedGeneratedCount = generatedImages.filter(img => img.selected).length;

  // Update selected search images when search images change
  $: {
    selectedSearchImages = searchImages.filter(img => img.selected);
  }

  // Search functionality with tag filtering
  $: {
    let filteredImages = allSearchImages;
    
    // Apply search filter
    if (searchInput.trim() !== '') {
      const searchTerm = searchInput.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.alt.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply tag filter
    if (selectedTag !== 'All Tags') {
      filteredImages = filteredImages.filter(img => 
        img.tags && img.tags.includes(selectedTag)
      );
    }
    
    searchImages = filteredImages;
  }

  // Functions
  function closeModal() {
    isOpen = false;
    dispatch('close');
  }

  function handleSearchFocus() {
    showSearchPopup = true;
  }

  function handleSearchBlur(event: FocusEvent) {
    setTimeout(() => {
      if (!event.relatedTarget || 
          !(event.relatedTarget instanceof Element) ||
          !event.relatedTarget.closest('#searchPopup')) {
        showSearchPopup = false;
      }
    }, 150);
  }

  function selectRecentSearch(keyword: string) {
    searchInput = keyword;
    showSearchPopup = false;
  }

  function deleteRecentSearch(id: string, event: Event) {
    event.stopPropagation();
    recentSearches = recentSearches.filter(item => item.id !== id);
  }

  function performSearch() {
    showSearchPopup = false;
    // Add to recent searches if not already there
    if (searchInput.trim() && !recentSearches.some(item => item.keyword.toLowerCase() === searchInput.toLowerCase())) {
      recentSearches = [
        { id: Date.now().toString(), keyword: searchInput.trim() },
        ...recentSearches.slice(0, 4)
      ];
    }
  }

  function toggleImageSelection(images: ImageItem[], id: string) {
    const image = images.find(img => img.id === id);
    if (image) {
      image.selected = !image.selected;
      // Force reactivity
      if (images === searchImages) searchImages = [...searchImages];
      if (images === templateImages) templateImages = [...templateImages];
      if (images === generatedImages) generatedImages = [...generatedImages];
    }
  }

  function removeSelectedImage(id: string, event: Event) {
    event.stopPropagation();
    // Find and unselect from search images
    const searchImage = searchImages.find(img => img.id === id);
    if (searchImage) {
      searchImage.selected = false;
      searchImages = [...searchImages];
    }
  }

  function handleGenerateImage() {
    const selectedImages = searchImages.filter(img => img.selected).map(img => img.src);
    const selectedTemplate = templateImages.find(img => img.selected);
    dispatch('generateImage', { 
      selectedImages, 
      templateId: selectedTemplate?.id,
      templateInput: templateInput.trim() || undefined
    });
  }

  function handleSaveImages() {
    const selectedImages = generatedImages.filter(img => img.selected).map(img => img.src);
    dispatch('saveImages', { selectedImages });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'Enter' && event.target === document.querySelector('input[type="text"]')) {
      performSearch();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if isOpen}
  <!-- Modal Backdrop -->
  <div 
    class="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    on:click={closeModal}
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal Content -->
    <div 
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 class="text-xl font-semibold text-gray-900">Image Library</h2>
        <button 
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          on:click={closeModal}
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="flex h-[calc(90vh-180px)]">
        <!-- Left Section - Image Search -->
        <div class="w-1/2 border-r border-gray-100">
          <div class="p-6">
            <!-- Search Input -->
            <div class="relative mb-6">
              <div class="flex gap-3">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    bind:value={searchInput}
                    on:focus={handleSearchFocus}
                    on:blur={handleSearchBlur}
                    on:keydown={(e) => e.key === 'Enter' && performSearch()}
                    placeholder="Write Keyword here"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  
                  <!-- Search Popup -->
                  {#if showSearchPopup}
                    <div 
                      id="searchPopup"
                      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                    >
                      <div class="p-4">
                        <h3 class="text-sm font-medium text-gray-900 mb-3">Recent Searches</h3>
                        <div class="space-y-1">
                          {#each recentSearches as item}
                            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                              <button
                                class="flex items-center space-x-3 flex-1 text-left"
                                on:click={() => selectRecentSearch(item.keyword)}
                              >
                                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-sm text-gray-700">{item.keyword}</span>
                              </button>
                              <button
                                type="button"
                                class="text-red-500 hover:text-red-700 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                on:click={(e) => deleteRecentSearch(item.id, e)}
                              >
                                Delete
                              </button>
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
                
                <button
                  type="button"
                  class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                  on:click={performSearch}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search Image
                </button>
              </div>
            </div>

            <!-- Image Grid -->
            <div class="grid grid-cols-3 gap-4 h-80 overflow-y-auto custom-scrollbar pr-2">
              {#each searchImages as image}
                <div class="relative group cursor-pointer p-2" on:click={() => toggleImageSelection(searchImages, image.id)}>
                  <div class="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 {image.selected ? 'ring-3 ring-blue-500 shadow-blue-100' : 'ring-1 ring-gray-200'}">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      class="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    
                    <!-- Selection Arrow - Only show when selected -->
                    {#if image.selected}
                      <div class="absolute top-3 right-3">
                        <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Selected Images Preview -->
            {#if selectedSearchImages.length > 0}
              <div class="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 class="text-sm font-medium text-gray-900 mb-3">Selected Images ({selectedSearchImages.length})</h3>
                <div class="flex gap-2 overflow-x-auto pb-2">
                  {#each selectedSearchImages as image}
                    <div class="relative flex-shrink-0">
                      <img src={image.src} alt={image.alt} class="w-16 h-16 object-cover rounded-lg" />
                      <button
                        type="button"
                        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                        on:click={(e) => removeSelectedImage(image.id, e)}
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Middle Section - Templates -->
        <div class="w-1/4 border-r border-gray-100">
          <div class="p-6">
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-4">Templates</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="categoryFilter" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    id="categoryFilter"
                    bind:value={selectedCategory} 
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  >
                    <option value="Category">All</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label for="templateTagFilter" class="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                  <select 
                    id="templateTagFilter"
                    bind:value={selectedTag} 
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  >
                    {#each availableTags as tag}
                      <option value={tag}>{tag}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div class="space-y-4 h-64 overflow-y-auto custom-scrollbar pr-2">
              {#each templateImages as template}
                <div class="relative group cursor-pointer p-2" on:click={() => toggleImageSelection(templateImages, template.id)}>
                  <div class="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 {template.selected ? 'ring-3 ring-blue-500 shadow-blue-100' : 'ring-1 ring-gray-200'}">
                    <img 
                      src={template.src} 
                      alt={template.alt} 
                      class="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {#if !template.requiresMoreImages}
                      <!-- Selection Arrow - Only show when selected -->
                      {#if template.selected}
                        <div class="absolute top-3 right-3">
                          <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        </div>
                      {/if}
                    {:else}
                      <div class="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div class="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-2 rounded-full flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Requires {template.minRequired || 3} more images
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Template Input -->
            <div class="mt-6 mb-4">

              <input 
                id="templateInput"
                type="text" 
                bind:value={templateInput}
                placeholder="Enter template description or prompt..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <button
              type="button"
              class="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              on:click={handleGenerateImage}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
              </svg>
              Generate Image
            </button>
          </div>
        </div>

        <!-- Right Section - Generated Images -->
        <div class="w-1/4 bg-indigo-50">
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 mb-6">Generated Images</h3>

            <div class="space-y-4 h-80 overflow-y-auto custom-scrollbar pr-2">
              {#each generatedImages as image}
                <div class="relative group cursor-pointer p-2" on:click={() => toggleImageSelection(generatedImages, image.id)}>
                  <div class="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 {image.selected ? 'ring-3 ring-blue-500 shadow-blue-100' : 'ring-1 ring-gray-200'}">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      class="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    
                    <!-- Selection Arrow - Only show when selected -->
                    {#if image.selected}
                      <div class="absolute top-3 right-3">
                        <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <button
              type="button"
              class="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              on:click={handleSaveImages}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              Save Image
            </button>
          </div>
        </div>
      </div>

 <!-- Footer -->
<!-- Footer -->
<div class="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50/50">
  <!-- Action buttons -->
  <div class="flex items-center gap-3">
    <button
      type="button"
      class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
      on:click={closeModal}
    >
      Cancel
    </button>
    <button
      type="button"
      class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
      disabled={selectedSearchCount === 0 && selectedTemplateCount === 0 && selectedGeneratedCount === 0}
      class:opacity-50={selectedSearchCount === 0 && selectedTemplateCount === 0 && selectedGeneratedCount === 0}
      class:cursor-not-allowed={selectedSearchCount === 0 && selectedTemplateCount === 0 && selectedGeneratedCount === 0}
      on:click={() => {
        // Dispatch appropriate action based on what's selected
        if (selectedGeneratedCount > 0) {
          handleSaveImages();
        } else if (selectedSearchCount > 0 || selectedTemplateCount > 0) {
          handleGenerateImage();
        }
      }}
    >
      {#if selectedGeneratedCount > 0}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
        </svg>
        Save Selected
      {:else if selectedSearchCount > 0 || selectedTemplateCount > 0}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
        </svg>
        Generate
      {:else}
        Select Images
      {/if}
    </button>
  </div>
</div>
    </div>
  </div>
{/if}
<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
</style>