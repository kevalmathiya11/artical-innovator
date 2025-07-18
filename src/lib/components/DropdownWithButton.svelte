<script lang="ts">
  import { onMount } from 'svelte';

  interface SocialPlatform {
    name: string;
    checked: boolean;
    icon: string;
    bgColor: string;
    hoverColor: string;
  }

  let open = false;
  let dropdownElement: HTMLDivElement;

  let platforms: SocialPlatform[] = [
    {
      name: 'Facebook',
      checked: true,
      icon: 'facebook',
      bgColor: 'bg-indigo-600/15',
      hoverColor: 'hover:bg-indigo-600/30'
    },
    {
      name: 'X (Twitter)',
      checked: false,
      icon: 'twitter',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-indigo-600/30'
    }
  ];

  function toggleDropdown() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      open = false;
    }
  }

  function clearAll() {
    platforms = platforms.map(platform => ({ ...platform, checked: false }));
  }

  function applyFilters() {
    // Handle apply logic here
    console.log('Applied filters:', platforms.filter(p => p.checked));
    open = false;
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="relative inline-block text-left" bind:this={dropdownElement}>
  <button
    on:click={toggleDropdown}
    class="filterButton flex gap-2 border border-gray-300 rounded-lg items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  >
    Shared on
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1101 5.99973L8.10994 9.9999L4.10742 5.99738"
        stroke="#111827"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <!-- Dropdown Panel -->
  {#if open}
    <div
      class="absolute font-poppins left-0 mt-1 z-50 w-64 rounded-2xl shadow-lg bg-white focus:outline-none"
    >
      <div class="p-4">
        {#each platforms as platform, index}
          <label
            class="flex items-center px-4 py-3 text-sm rounded-xl mb-1 text-gray-700 {platform.checked ? platform.bgColor : platform.hoverColor} cursor-pointer"
          >
            <input 
              type="checkbox" 
              class="mr-2" 
              bind:checked={platform.checked}
            />
            
            {#if platform.icon === 'facebook'}
              <svg
                class="mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="12" fill="#0866FF" />
                <path
                  d="M13.4329 17.5999H11.0887V13.8232H10.5938C10.2917 13.8232 10.0469 13.5783 10.0469 13.2762V12.2864C10.0469 11.9843 10.2917 11.7395 10.5938 11.7395H11.0887V10.4371C11.0887 9.35881 11.9639 8.48364 13.0422 8.48364H14.4487C14.7509 8.48364 14.9957 8.72847 14.9957 9.03061V10.2809C14.9957 10.583 14.7509 10.8278 14.4487 10.8278H13.4329V11.7395H14.4123C14.579 11.7395 14.73 11.8124 14.8342 11.9374C14.9384 12.0624 14.9801 12.2291 14.9488 12.3906L14.7509 13.3804C14.6988 13.6356 14.4748 13.818 14.2143 13.818H13.4329V17.5999ZM11.8701 16.8185H12.6515V13.0418H14.0268L14.131 12.5209H12.6567V10.5934C12.6567 10.2913 12.9016 10.0464 13.2037 10.0464H14.2195V9.26504H13.0422C12.3963 9.26504 11.8701 9.79118 11.8701 10.4371V12.5209H10.8283V13.0418H11.8701V16.8185Z"
                  fill="white"
                />
                <path
                  d="M13.5632 17.6H10.4376C7.60895 17.6 6.40039 16.3915 6.40039 13.5628V10.4372C6.40039 7.60858 7.60895 6.40002 10.4376 6.40002H13.5632C16.3918 6.40002 17.6004 7.60858 17.6004 10.4372V13.5628C17.6004 16.3915 16.3918 17.6 13.5632 17.6ZM10.4376 7.18142C8.03611 7.18142 7.18179 8.03575 7.18179 10.4372V13.5628C7.18179 15.9643 8.03611 16.8186 10.4376 16.8186H13.5632C15.9647 16.8186 16.819 15.9643 16.819 13.5628V10.4372C16.819 8.03575 15.9647 7.18142 13.5632 7.18142H10.4376Z"
                  fill="white"
                />
              </svg>
            {:else}
              <svg
                class="mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="12" fill="black" />
                <g clip-path="url(#clip0_177_14849)">
                  <path
                    d="M14.9881 6.69525H9.0119C7.73453 6.69525 6.69531 7.73447 6.69531 9.01184V14.988C6.69531 16.2654 7.73453 17.3046 9.0119 17.3046H14.9881C16.2655 17.3046 17.3047 16.2654 17.3047 14.988V9.01184C17.3047 7.73447 16.2655 6.69525 14.9881 6.69525ZM16.7578 14.988C16.7578 15.9639 15.9639 16.7578 14.9881 16.7578H9.0119C8.03607 16.7578 7.24219 15.9639 7.24219 14.988V9.01184C7.24219 8.03601 8.03607 7.24213 9.0119 7.24213H14.9881C15.9639 7.24213 16.7578 8.03601 16.7578 9.01184V14.988ZM12.7531 11.4983L14.817 8.92589C14.9115 8.80809 14.8926 8.636 14.7748 8.54148C14.657 8.447 14.4849 8.46584 14.3904 8.58365L12.4025 11.0613L10.4146 8.58365C10.389 8.55172 10.3565 8.52595 10.3196 8.50824C10.2827 8.49052 10.2422 8.48133 10.2013 8.48132H8.59128C8.53975 8.48132 8.48926 8.49589 8.44564 8.52334C8.40202 8.55079 8.36705 8.59001 8.34476 8.63648C8.32246 8.68295 8.31376 8.73477 8.31964 8.78597C8.32552 8.83717 8.34575 8.88567 8.378 8.92587L11.2469 12.5016L9.183 15.074C9.0885 15.1918 9.10738 15.3639 9.22516 15.4584C9.2736 15.4974 9.33393 15.5186 9.39611 15.5186C9.43709 15.5186 9.47755 15.5094 9.51451 15.4917C9.55146 15.474 9.58395 15.4482 9.60957 15.4162L11.5975 12.9386L13.5854 15.4162C13.611 15.4482 13.6435 15.4739 13.6804 15.4916C13.7173 15.5094 13.7577 15.5186 13.7987 15.5186H15.4091C15.5601 15.5186 15.6826 15.3961 15.6826 15.2451C15.6826 15.1754 15.6565 15.1118 15.6136 15.0635L12.7531 11.4983ZM13.9299 14.9717L9.16126 9.0282H10.0701L14.8387 14.9717H13.9299Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_177_14849">
                    <rect
                      width="11.2"
                      height="11.2"
                      fill="white"
                      transform="translate(6.40039 6.39996)"
                    />
                  </clipPath>
                </defs>
              </svg>
            {/if}
            
            {platform.name}
          </label>
        {/each}

        <div class="flex justify-between pt-2">
          <button
            on:click={clearAll}
            class="px-3 py-2 text-sm text-custom-dark-blue bg-custom-blue/10 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear all
          </button>
          <button 
            on:click={applyFilters}
            class="px-4 py-1 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
</style>