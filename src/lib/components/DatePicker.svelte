<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { PredefinedDateOption, DateRange } from '../../types/datePicker.ts';
  
  
  // Props using $props() rune
  interface Props {
    initialStartDate?: string;
    initialEndDate?: string;
    placeholder?: string;
  }

  const { 
    initialStartDate = '', 
    initialEndDate = '', 
    placeholder = 'Last 7 Days' 
  }: Props = $props();

  // State using $state() rune
  let startDate = $state(initialStartDate);
  let endDate = $state(initialEndDate);
  let calendarVisible = $state(false);
  let selectedOption = $state<PredefinedDateOption | null>(null);
  let calendarInstance: any = null;
  let calendarElement: HTMLElement;
  let containerElement: HTMLElement;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    dateChange: DateRange;
    apply: DateRange;
    clear: void;
  }>();

  // Derived values using $derived() rune
  const displayText = $derived(getDisplayText(startDate, endDate, placeholder));

  // Effect using $effect() rune
  $effect(() => {
    if (startDate || endDate) {
      dispatch('dateChange', { startDate, endDate });
    }
  });

  // Predefined date options
  const dateOptions = [
    { key: 'yesterday' as const, label: 'Yesterday' },
    { key: 'last7days' as const, label: 'Last 7 Days' },
    { key: 'last15days' as const, label: 'Last 15 Days' },
    { key: 'last30days' as const, label: 'Last 30 Days' },
    { key: 'last3months' as const, label: 'Last 3 Months' }
  ];

  // Click outside handler
  function handleClickOutside(event: MouseEvent) {
    if (calendarVisible && containerElement && !containerElement.contains(event.target as Node)) {
      calendarVisible = false;
    }
  }

  // Initialize flatpickr
  async function initializeFlatpickr() {
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }

    try {
      // Dynamically import flatpickr to avoid SSR issues
      const flatpickr = (await import('flatpickr')).default;
      
      // Ensure the element exists before initializing
      if (!calendarElement) {
        console.error('Calendar element not found');
        return;
      }
      
      // Initialize flatpickr with proper configuration
      calendarInstance = flatpickr(calendarElement, {
        inline: true,
        mode: 'range',
        dateFormat: 'Y-m-d',
        showMonths: 1,
        enableTime: false,
        static: true,
        allowInput: false,
        clickOpens: false,
        onChange: (selectedDates: Date[]) => {
          handleDateChange(selectedDates);
        },
        onReady: (selectedDates: Date[], dateStr: string, instance: any) => {
          console.log('Flatpickr is ready');
          // Ensure calendar is visible and properly positioned
          const calendarEl = instance.calendarContainer;
          if (calendarEl) {
            calendarEl.style.display = 'block';
            calendarEl.style.position = 'static';
            calendarEl.style.visibility = 'visible';
            calendarEl.style.opacity = '1';
          }
        }
      });
      
      // Set initial dates if provided
      if (initialStartDate && initialEndDate) {
        const start = new Date(initialStartDate);
        const end = new Date(initialEndDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          calendarInstance.setDate([start, end]);
        }
      }
      
      console.log('Flatpickr initialized successfully');
      
    } catch (error) {
      console.error('Error initializing flatpickr:', error);
    }
  }

  onMount(() => {
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (calendarInstance) {
        calendarInstance.destroy();
        calendarInstance = null;
      }
    };
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  });

  function handleDateChange(selectedDates: Date[]): void {
    if (selectedDates.length === 2) {
      startDate = formatDate(selectedDates[0]);
      endDate = formatDate(selectedDates[1]);
      selectedOption = null; // Clear predefined selection when manually selecting
    } else if (selectedDates.length === 1) {
      startDate = formatDate(selectedDates[0]);
      endDate = '';
      selectedOption = null;
    }
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function setPredefinedDates(option: PredefinedDateOption): void {
    const today = new Date();
    let start: Date;
    let end: Date = new Date(today);
    
    switch (option) {
      case 'yesterday':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(start);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case 'last15days':
        start = new Date(today);
        start.setDate(today.getDate() - 15);
        break;
      case 'last30days':
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'last3months':
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        break;
    }
    
    startDate = formatDate(start);
    endDate = formatDate(end);
    selectedOption = option;
    
    if (calendarInstance) {
      calendarInstance.setDate([start, end]);
      calendarInstance.jumpToDate(start);
    }
  }

  async function toggleCalendar(): Promise<void> {
    calendarVisible = !calendarVisible;
    
    // Initialize flatpickr when calendar becomes visible
    if (calendarVisible) {
      // Small delay to ensure DOM is updated
      await new Promise(resolve => setTimeout(resolve, 50));
      await initializeFlatpickr();
    }
  }

  function clearAll(): void {
    startDate = '';
    endDate = '';
    selectedOption = null;
    
    if (calendarInstance) {
      calendarInstance.clear();
    }
    
    dispatch('clear');
  }

  function applyDateRange(): void {
    dispatch('apply', { startDate, endDate });
    calendarVisible = false;
  }

  function getDisplayText(start: string, end: string, placeholder: string): string {
    if (start && end) {
      return `${start} - ${end}`;  
    }
    return placeholder;
  }
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" rel="stylesheet">
</svelte:head>

<div class="relative" bind:this={containerElement}>
  <!-- Date Picker Button -->
  <button
    onclick={toggleCalendar}
    class="filterButton flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    type="button"
  >
    <!-- Calendar Icon -->
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 1.5V3.75" stroke="#292D32" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.0078 1.5V3.75" stroke="#292D32" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2.625 6.81738H15.375" stroke="#292D32" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M15.7539 6.375V12.75C15.7539 15 14.6289 16.5 12.0039 16.5H6.00391C3.37891 16.5 2.25391 15 2.25391 12.75V6.375C2.25391 4.125 3.37891 2.625 6.00391 2.625H12.0039C14.6289 2.625 15.7539 4.125 15.7539 6.375Z" stroke="#292D32" stroke-width="1.125" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11.7771 10.2751H11.7839" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11.7771 12.5251H11.7839" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.00369 10.2751H9.01043" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.00369 12.5251H9.01043" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.2283 10.2751H6.23504" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.2283 12.5251H6.23504" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span>{displayText}</span>
  </button>

  <!-- Calendar Dialog -->
  {#if calendarVisible}
    <div class="absolute z-50 mt-2 bg-white rounded-lg shadow-lg w-[520px] max-w-screen-lg border border-gray-200">
      <div class="flex">
        <!-- Left Side - Predefined Options -->
        <div class="w-1/3 p-4 border-r border-gray-200">
          <p class="text-sm font-medium text-gray-500 pb-3">Custom Date</p>
          <hr class="border-gray-200">
          <ul class="mt-3 space-y-2 text-sm">
            {#each dateOptions as option}
              <li>
                <button
                  type="button"
                  onclick={() => setPredefinedDates(option.key)}
                  class="w-full text-left cursor-pointer px-4 py-3 rounded-xl transition-colors duration-200 focus:outline-none   {selectedOption === option.key 
                    ? ' text-indigo-700' 
                    : ' text-gray-700 hover:bg-indigo-600/20'}"
                >
                  {option.label}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Right Side - Calendar -->
        <div class="w-2/3 p-4">
          <!-- Date Input Fields -->
          <div class="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Start date"
              bind:value={startDate}
              class="w-1/2 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readonly
            />
            <input
              type="text"
              placeholder="End date"
              bind:value={endDate}
              class="w-1/2 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readonly
            />
          </div>

          <!-- Flatpickr Calendar -->
          <div bind:this={calendarElement} class="flatpickr-calendar-container"></div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onclick={clearAll}
              class="px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-gray-300 rounded-lg hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            >
              Clear all
            </button>
            <button
              type="button"
              onclick={applyDateRange}
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom styles to ensure flatpickr calendar displays properly */
  :global(.flatpickr-calendar-container .flatpickr-calendar) {
    display: block !important;
    position: static !important;
    visibility: visible !important;
    opacity: 1 !important;
    box-shadow: none !important;
    border: none !important;
  }
  
  /* :global(.flatpickr-calendar-container .flatpickr-calendar.inline) {
    display: block !important;
    position: static !important;
  }
  */
</style>