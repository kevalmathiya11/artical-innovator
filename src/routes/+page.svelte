<script lang="ts">
  // Import your modal component
  import Modal from "$lib/components/Modal.svelte";
  
  // State to control modal visibility
  let isModalOpen = false;
  
  // State to store selected/generated images
  let selectedImages: string[] = [];
  let generatedImages: string[] = [];
  
  // Functions to handle modal events
  function openModal() {
    isModalOpen = true;
  }
  
  function closeModal() {
    isModalOpen = false;
    console.log('Modal closed');
  }
  
  function handleImageSelected(event: CustomEvent<{ src: string; type: 'search' | 'template' | 'generated' }>) {
    const { src, type } = event.detail;
    console.log('Image selected:', { src, type });
    
    // Add to your selected images array or handle as needed
    if (src && !selectedImages.includes(src)) {
      selectedImages = [...selectedImages, src];
    }
    
    // Close modal after selection
    isModalOpen = false;
  }
  
  function handleGenerateImage(event: CustomEvent<{ selectedImages: string[]; templateId?: string }>) {
    const { selectedImages: images, templateId } = event.detail;
    console.log('Generate image request:', { images, templateId });
    
    // Here you would typically call your image generation API
    // For demo purposes, we'll just simulate adding generated images
    setTimeout(() => {
      const newGeneratedImage = `https://picsum.photos/seed/${Date.now()}/300/200`;
      generatedImages = [...generatedImages, newGeneratedImage];
      console.log('New image generated:', newGeneratedImage);
    }, 1000);
  }
  
  function handleSaveImages(event: CustomEvent<{ selectedImages: string[] }>) {
    const { selectedImages: images } = event.detail;
    console.log('Save images:', images);
    
    // Here you would typically save the images to your backend
    // or download them, etc.
    alert(`Saving ${images.length} images!`);
  }
  
  // Optional: Handle individual image removal
  function removeImage(imageUrl: string) {
    selectedImages = selectedImages.filter(img => img !== imageUrl);
  }
</script>

<!-- Your page content -->
<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-8">My Image Gallery App</h1>
  
  <!-- Button to open modal -->
  <div class="mb-8">
    <button
      type="button"
      class="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium"
      on:click={openModal}
    >
      Open Image Search Modal
    </button>
  </div>
  
  <!-- Display selected images -->
  {#if selectedImages.length > 0}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Selected Images ({selectedImages.length})</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each selectedImages as imageUrl}
          <div class="relative">
            <img 
              src={imageUrl} 
              alt="Selected" 
              class="w-full h-32 object-cover rounded-lg shadow"
            />
            <button
              type="button"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              on:click={() => removeImage(imageUrl)}
              aria-label="Remove image"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Display generated images -->
  {#if generatedImages.length > 0}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Generated Images ({generatedImages.length})</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each generatedImages as imageUrl}
          <div class="relative">
            <img 
              src={imageUrl} 
              alt="Generated" 
              class="w-full h-32 object-cover rounded-lg shadow border-2 border-green-400"
            />
            <div class="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Generated
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Stats -->
  <div class="bg-gray-100 rounded-lg p-4">
    <h3 class="font-medium mb-2">Statistics:</h3>
    <p class="text-sm text-gray-600">Selected Images: {selectedImages.length}</p>
    <p class="text-sm text-gray-600">Generated Images: {generatedImages.length}</p>
    <p class="text-sm text-gray-600">Total Images: {selectedImages.length + generatedImages.length}</p>
  </div>
</div>

<!-- Include the modal component -->
<Modal 
  bind:isOpen={isModalOpen}
  on:close={closeModal}
  on:imageSelected={handleImageSelected}
  on:generateImage={handleGenerateImage}
  on:saveImages={handleSaveImages}
/>

<style>
  .container {
    max-width: 1200px;
  }
</style>