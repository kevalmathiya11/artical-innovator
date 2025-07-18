<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';

  let fileInput: HTMLInputElement;
  let imageElement: HTMLImageElement;
  let previewContainer: HTMLDivElement;
  
  let cropper: any = null;
  let uploadProgress = 0;
  let isUploaded = false;
  let fileName = '';
  let showPreview = false;
  let CropperClass: any = null;
  let imageLoaded = false;
  let isCropped = false;
  let cropperReady = false;

  onMount(async () => {
    if (browser) {
      try {
        // Load Cropper.js CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.1/dist/cropper.min.css';
        document.head.appendChild(link);
        
        // Wait for CSS to load
        await new Promise(resolve => {
          link.onload = resolve;
          setTimeout(resolve, 1000); // fallback timeout
        });
        
        // Import Cropper.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.1/dist/cropper.min.js';
        document.head.appendChild(script);
        
        await new Promise(resolve => {
          script.onload = resolve;
          setTimeout(resolve, 2000); // fallback timeout
        });
        
        // Access Cropper from global scope
        CropperClass = (window as any).Cropper;
        
      
      } catch (error) {
        console.error('Failed to load Cropper.js:', error);
      }
    }
  });

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Reset states
    resetStates();

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    fileName = file.name;
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Show preview and set image
      showPreview = true;
      imageLoaded = false;
      
      // Wait for DOM update
      await tick();
      
      if (imageElement) {
        imageElement.src = result;
        imageElement.onload = async () => {
          imageLoaded = true;
          // Wait a bit more for image to be fully rendered
          await tick();
          setTimeout(() => {
            initializeCropper();
          }, 200);
        };
        imageElement.onerror = () => {
          console.error('Failed to load image');
          alert('Failed to load the selected image');
          handleReset();
        };
      }
      
      // Simulate upload progress
      simulateUpload();
    };
    
    reader.onerror = () => {
      console.error('Failed to read file');
      alert('Failed to read the selected file');
    };
    
    reader.readAsDataURL(file);
  }

  function resetStates() {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    showPreview = false;
    imageLoaded = false;
    isCropped = false;
    cropperReady = false;
    uploadProgress = 0;
    isUploaded = false;
  }

  async function initializeCropper() {
    if (!CropperClass || !imageElement || !imageLoaded) {
      console.error('Cropper not ready:', { 
        CropperClass: !!CropperClass, 
        imageElement: !!imageElement, 
        imageLoaded,
        imageWidth: imageElement?.naturalWidth,
        imageHeight: imageElement?.naturalHeight
      });
      return;
    }

    try {
      // Destroy existing cropper
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }

      // Make sure image is visible and has dimensions
      if (imageElement.naturalWidth === 0 || imageElement.naturalHeight === 0) {
        console.error('Image has no dimensions');
        return;
      }

      // Initialize new cropper
      cropper = new CropperClass(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 0.8,
        movable: true,
        scalable: true,
        zoomable: true,
        rotatable: false,
        checkOrientation: false,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        dragMode: 'move',
        background: true,
        ready() {
         
          cropperReady = true;
        },
       
      
       
      });
      
     
    } catch (error) {
      console.error('Failed to initialize cropper:', error);
      alert('Failed to initialize image cropper. Please try again.');
    }
  }

  function simulateUpload() {
    uploadProgress = 0;
    const interval = setInterval(() => {
      uploadProgress += 10;
      if (uploadProgress >= 100) {
        clearInterval(interval);
        isUploaded = true;
      }
    }, 100);
  }

  function handleCrop() {
    if (!cropper || !cropperReady) {
      console.error('Cropper not ready');
      alert('Cropper not ready. Please wait a moment and try again.');
      return;
    }
    
    try {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 1000,
        maxHeight: 1000,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      if (croppedCanvas) {
        const croppedDataURL = croppedCanvas.toDataURL('image/png', 0.9);
        
        // Replace the image source with cropped version
        imageElement.src = croppedDataURL;
        
        // Destroy cropper and mark as cropped
        cropper.destroy();
        cropper = null;
        isCropped = true;
        cropperReady = false;
        
       
      } else {
        console.error('Failed to get cropped canvas');
        alert('Failed to crop image. Please try again.');
      }
    } catch (error) {
      console.error('Failed to crop image:', error);
      alert('Failed to crop image. Please try again.');
    }
  }

  function handleReset() {
    resetStates();
    fileName = '';
    
    // Reset file input
    if (fileInput) {
      fileInput.value = '';
    }
    
   
  }

  function handleSave() {
    if (!imageElement?.src) {
      alert('No image to save');
      return;
    }
    
    try {
      // Create download link
      const link = document.createElement('a');
      link.download = `${isCropped ? 'cropped-' : ''}${fileName || 'image.png'}`;
      link.href = imageElement.src;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image');
    }
  }

  function handleRecrop() {
    if (!imageElement || !imageLoaded) return;
    
    isCropped = false;
    cropperReady = false;
    
    setTimeout(() => {
      initializeCropper();
    }, 100);
  }
</script>

<div class="block w-full">
  <label class="mb-2 text-sm font-medium text-gray-600 w-full flex items-center">
    AI Workspace Logo
  </label>
  
  <div class="w-full py-9 bg-gray-50 rounded-2xl border-2 border-gray-300 gap-3 grid border-dashed">
    <!-- Upload and Preview Section -->
    <div class="grid gap-1">
      <!-- Icon and Info (shown when no image) -->
      {#if !showPreview}
        <div class="text-center">
          <svg class="mx-auto" width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.4974 28.333V18.333L12.1641 21.6663" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.5 18.333L18.8333 21.6663" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M37.1693 16.6663V24.9997C37.1693 33.333 33.8359 36.6663 25.5026 36.6663H15.5026C7.16927 36.6663 3.83594 33.333 3.83594 24.9997V14.9997C3.83594 6.66634 7.16927 3.33301 15.5026 3.33301H23.8359" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M37.1693 16.6663H30.5026C25.5026 16.6663 23.8359 14.9997 23.8359 9.99967V3.33301L37.1693 16.6663Z" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <h2 class="text-gray-600 text-sm leading-4 pt-2 pb-2">Drag logo here</h2>
          <span class="text-gray-400 font-normal text-sm">OR</span>
        </div>
      {/if}

      <!-- Image Preview & Crop Section -->
      <div class="flex flex-col items-center justify-center mt-0">
        {#if showPreview}
          <div bind:this={previewContainer} class="relative w-full max-w-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md border">
            <div class="relative w-full" style="min-height: 300px; max-height: 400px;">
              <img 
                bind:this={imageElement} 
                class="block w-full h-full object-contain" 
                alt="Preview"
                style="display: block; max-width: 100%; max-height: 100%;"
              />
            </div>
          </div>
        {/if}

        <!-- File Input -->
        <div class="mt-4">
          <input 
            bind:this={fileInput}
            type="file" 
            accept="image/*" 
            class="hidden"
            on:change={handleFileChange}
          />
          <button 
            on:click={() => fileInput?.click()}
            class="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-lg shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Choose File
          </button>
        </div>
      </div>
    </div>

    <!-- Crop Controls (visible after upload) -->
    {#if showPreview && imageLoaded}
      <div class="flex items-center justify-center gap-2 mt-2">
        {#if cropperReady && !isCropped}
          <button 
            on:click={handleCrop}
            class="px-4 py-2 bg-indigo-600 text-xs text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Crop Image
          </button>
        {:else if isCropped}
          <button 
            on:click={handleRecrop}
            class="px-4 py-2 bg-green-600 text-xs text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Crop Again
          </button>
        {:else}
          <button 
            disabled
            class="px-4 py-2 bg-gray-400 text-xs text-white rounded-md cursor-not-allowed"
          >
            Loading Cropper...
          </button>
        {/if}
        <button 
          on:click={handleReset}
          class="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
        >
          Reset
        </button>
      </div>
    {/if}
  </div>

  <!-- File Upload Progress Section -->
  {#if fileName}
    <div class="w-full grid gap-1 pt-5">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M31.6492 10.6056L32.2472 10.0741L32.2472 10.0741L31.6492 10.6056ZM28.6555 7.23757L28.0575 7.76907L28.0575 7.76907L28.6555 7.23757ZM26.5351 5.29253L26.2074 6.02233L26.2074 6.02233L26.5351 5.29253ZM33.1156 12.5827L32.3678 12.867L32.3678 12.867L33.1156 12.5827ZM31.8687 33.5355L32.4344 34.1012L32.4344 34.1012L31.8687 33.5355ZM24.2306 11.4836L25.0152 11.3276L25.0152 11.3276L24.2306 11.4836ZM26.8495 14.1026L26.6935 14.8872L26.6935 14.8872L26.8495 14.1026ZM20.7998 15.8333C20.7998 15.3915 20.4417 15.0333 19.9998 15.0333C19.558 15.0333 19.1998 15.3915 19.1998 15.8333L20.7998 15.8333ZM19.1998 25C19.1998 25.4418 19.558 25.8 19.9998 25.8C20.4417 25.8 20.7998 25.4418 20.7998 25L19.1998 25ZM17.2322 22.7676C16.9198 22.4552 16.4132 22.4552 16.1008 22.7676C15.7884 23.0801 15.7884 23.5866 16.1008 23.899L17.2322 22.7676ZM19.9998 26.6667L19.4342 27.2324L19.9998 27.798L20.5655 27.2324L19.9998 26.6667ZM23.8989 23.899C24.2113 23.5866 24.2113 23.0801 23.8989 22.7676C23.5864 22.4552 23.0799 22.4552 22.7675 22.7676L23.8989 23.899ZM23.3332 34.2H16.6665V35.8H23.3332V34.2ZM7.4665 25V15H5.8665V25H7.4665ZM32.5332 15.0347V25H34.1332V15.0347H32.5332ZM16.6665 5.8H23.6727V4.2H16.6665V5.8ZM23.6727 5.8C25.218 5.8 25.7488 5.81639 26.2074 6.02233L26.8629 4.56274C26.0186 4.18361 25.0754 4.2 23.6727 4.2V5.8ZM29.2534 6.70608C28.3215 5.65771 27.7071 4.94187 26.8629 4.56274L26.2074 6.02233C26.666 6.22826 27.0309 6.6141 28.0575 7.76907L29.2534 6.70608ZM34.1332 15.0347C34.1332 13.8411 34.1453 13.0399 33.8634 12.2984L32.3678 12.867C32.5211 13.2702 32.5332 13.7221 32.5332 15.0347H34.1332ZM31.0513 11.1371C31.9233 12.1181 32.2145 12.4639 32.3678 12.867L33.8634 12.2984C33.5814 11.5569 33.0401 10.9662 32.2472 10.0741L31.0513 11.1371ZM16.6665 34.2C14.2869 34.2 12.5826 34.1983 11.2867 34.0241C10.0139 33.8529 9.25547 33.5287 8.69666 32.9698L7.56528 34.1012C8.47093 35.0069 9.62327 35.4148 11.0735 35.6098C12.5008 35.8017 14.3321 35.8 16.6665 35.8V34.2ZM5.8665 25C5.8665 27.3344 5.8648 29.1657 6.0567 30.593C6.25168 32.0432 6.65964 33.1956 7.56528 34.1012L8.69666 32.9698C8.13784 32.411 7.81356 31.6526 7.64243 30.3798C7.4682 29.0839 7.4665 27.3796 7.4665 25H5.8665ZM23.3332 35.8C25.6676 35.8 27.4989 35.8017 28.9261 35.6098C30.3764 35.4148 31.5287 35.0069 32.4344 34.1012L31.303 32.9698C30.7442 33.5287 29.9858 33.8529 28.7129 34.0241C27.4171 34.1983 25.7128 34.2 23.3332 34.2V35.8ZM32.5332 25C32.5332 27.3796 32.5315 29.0839 32.3572 30.3798C32.1861 31.6526 31.8618 32.411 31.303 32.9698L32.4344 34.1012C33.34 33.1956 33.748 32.0432 33.943 30.593C34.1349 29.1657 34.1332 27.3344 34.1332 25H32.5332ZM7.4665 15C7.4665 12.6204 7.4682 10.9161 7.64243 9.62024C7.81356 8.34738 8.13784 7.58897 8.69666 7.03015L7.56528 5.89878C6.65964 6.80443 6.25168 7.95676 6.0567 9.40704C5.8648 10.8343 5.8665 12.6656 5.8665 15H7.4665ZM16.6665 4.2C14.3321 4.2 12.5008 4.1983 11.0735 4.39019C9.62327 4.58518 8.47093 4.99313 7.56528 5.89878L8.69666 7.03015C9.25547 6.47133 10.0139 6.14706 11.2867 5.97592C12.5826 5.8017 14.2869 5.8 16.6665 5.8V4.2ZM23.3665 5V10H24.9665V5H23.3665ZM28.3332 14.9667H33.3332V13.3667H28.3332V14.9667ZM23.3665 10C23.3665 10.7361 23.3626 11.221 23.4459 11.6397L25.0152 11.3276C24.9704 11.1023 24.9665 10.8128 24.9665 10H23.3665ZM28.3332 13.3667C27.5204 13.3667 27.2308 13.3628 27.0056 13.318L26.6935 14.8872C27.1122 14.9705 27.5971 14.9667 28.3332 14.9667V13.3667ZM23.4459 11.6397C23.7721 13.2794 25.0538 14.5611 26.6935 14.8872L27.0056 13.318C26.0007 13.1181 25.2151 12.3325 25.0152 11.3276L23.4459 11.6397ZM19.1998 15.8333L19.1998 25L20.7998 25L20.7998 15.8333L19.1998 15.8333ZM16.1008 23.899L19.4342 27.2324L20.5655 26.101L17.2322 22.7676L16.1008 23.899ZM22.7675 22.7676L19.4342 26.101L20.5655 27.2324L23.8989 23.899L22.7675 22.7676ZM32.2472 10.0741L29.2534 6.70608L28.0575 7.76907L31.0513 11.1371L32.2472 10.0741Z" fill="#4F46E5"></path>
          </svg>
          <div class="grid gap-1">
            <h4 class="text-gray-900 text-sm font-normal font-['Inter'] leading-snug">
              {fileName}
            </h4>
            <h5 class="text-gray-400 text-xs font-normal font-['Inter'] leading-[18px]">
              {isUploaded ? 'Upload complete' : 'Uploading...'}
            </h5>
          </div>
        </div>
        <button on:click={handleReset} class="p-1 hover:bg-gray-100 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="relative flex items-center gap-2.5 py-1.5">
        <div class="relative w-full h-2.5 overflow-hidden rounded-3xl bg-gray-100">
          <div 
            role="progressbar" 
            aria-valuenow={uploadProgress} 
            aria-valuemin="0" 
            aria-valuemax="100" 
            style="width: {uploadProgress}%" 
            class="flex h-full items-center justify-center bg-indigo-600 text-white rounded-3xl transition-all duration-300"
          ></div>
        </div>
        <span class="ml-2 bg-white rounded-full text-gray-800 text-xs font-medium flex justify-center items-center">
          {uploadProgress}%
        </span>
      </div>
    </div>
  {/if}

  <!-- Save Button -->
  <div class="flex flex-col md:flex-row items-start gap-3 mt-4">
    <button 
      on:click={handleSave}
      class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      disabled={!fileName}
    >
      Save Image
    </button>
  </div>
</div>

<style>
  /* Ensure cropper container has proper dimensions */
  :global(.cropper-container) {
    max-width: 100% !important;
    max-height: 400px !important;
  }
  
  /* Style the crop box */
  :global(.cropper-view-box) {
    border: 2px solid #4F46E5 !important;
    outline: 1px solid rgba(79, 70, 229, 0.5) !important;
  }
  
  /* Style the cropped area */
  :global(.cropper-face) {
    background-color: rgba(79, 70, 229, 0.1) !important;
  }
  
  /* Ensure proper modal backdrop */
  :global(.cropper-modal) {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
  
  /* Style crop box lines */
  :global(.cropper-line) {
    background-color: #4F46E5 !important;
  }
  
  /* Style crop box points */
  :global(.cropper-point) {
    background-color: #4F46E5 !important;
  }

  /* Ensure proper image display */
  :global(.cropper-canvas img) {
    max-width: none !important;
  }
</style>