<!-- WaybackVisualization.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  // Register Chart.js components
  Chart.register(...registerables);

  // Types
  interface GraphData {
    years: Record<string, number[]>;
    status: Record<string, string>;
    last_ts: string;
    first_ts: string;
  }

  interface ScreenshotItem {
    screenshot_url: string;
    timestamp: string;
  }

  // Props
  export let graphData: GraphData = {
    years: {},
    status: {},
    last_ts: '',
    first_ts: ''
  };
  export let domainId: string = '';
  export let domainName: string = '';
  export let currentStep: number = 2;

  // Component state
  let chartCanvas: HTMLCanvasElement;
  let overlayCanvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let startTime = '';
  let endTime = '';
  let screenshots: ScreenshotItem[] = [];
  let loading = false;
  let imageContainer: HTMLElement;

  // Chart interaction state
  let selectionRect = { w: 0, startX: 0, startY: 0 };
  let drag = false;
  let startIndex = 0;

  onMount(() => {
    // Initialize with mock data if no data provided
    if (Object.keys(graphData.years).length === 0) {
      initializeMockData();
    }
    
    if (currentStep === 2 && graphData) {
      renderChart();
    }
  });

  function initializeMockData(): void {
    graphData = {
      years: {
        "2010": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "2011": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "2012": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "2013": [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        "2014": [1, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0],
        "2015": [2, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
        "2016": [1, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0, 1],
        "2017": [1, 1, 2, 1, 2, 0, 1, 2, 2, 1, 1, 0],
        "2018": [2, 2, 1, 3, 1, 2, 3, 2, 1, 2, 2, 2],
        "2019": [3, 3, 2, 1, 2, 3, 3, 3, 2, 2, 3, 3],
        "2020": [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
        "2021": [0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 3, 0],
        "2022": [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
        "2023": [2, 0, 6, 0, 3, 1, 0, 2, 3, 0, 0, 1],
        "2024": [3, 3, 1, 1, 3, 3, 1, 4, 2, 3, 2, 6],
        "2025": [2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      status: {
        "2010": "000000000000",
        "2011": "000000000000",
        "2012": "000000000000",
        "2013": "002000200000",
        "2014": "221220022210",
        "2015": "242422222222",
        "2016": "222422224422",
        "2017": "224244444244",
        "2018": "244244244442",
        "2019": "444444444444",
        "2020": "222222222222",
        "2021": "444424442224",
        "2022": "222244422444",
        "2023": "242422422442",
        "2024": "222222222222",
        "2025": "222444444444"
      },
      last_ts: "20250315112700",
      first_ts: "20100101000000"
    };
  }

  function renderChart() {
    if (!chartCanvas || !overlayCanvas) return;

    const data = graphData;
    const years = Object.keys(data.years);
    const labels: string[] = [];
    const monthYear: string[] = [];

    // Create month/year labels for the x-axis
    for (const year in data.years) {
      for (let month = 1; month <= 12; month++) {
        if (month === 1) {
          labels.push(year);
        } else {
          labels.push("");
        }
        monthYear.push(`${month.toString().padStart(2, '0')}/${year}`);
      }
    }

    // Merge data for all years
    const mergedData = years.reduce((acc : number[], year) => acc.concat(data.years[year]), []);
    let yearCycle = 12;
    let opacity = 0.5;

    // Set background color with alternating opacity
    const backgroundColor = mergedData.map((value, index) => {
      if (index % yearCycle === 0) {
        opacity = opacity === 0.5 ? 1 : 0.5;
      }
      return `rgba(104, 93, 216, ${opacity})`;
    });

    const chartConfig = {
      type: 'bar' as const,
      data: {
        labels: labels,
        datasets: [{
          label: "",
          data: mergedData,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          x: {
            grid: { display: true },
            ticks: {
              stepSize: 12,
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              align: 'start' as const
            }
          },
          y: {
            grid: { display: false },
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    };

    // Set canvas dimensions
    chartCanvas.width = Math.max(Object.keys(data.years).length * 70, 400) - 70;
    chartCanvas.height = Math.max(Object.keys(data.years).length * 10, 80);
    
    overlayCanvas.width = chartCanvas.width;
    overlayCanvas.height = chartCanvas.height;

    const ctx = chartCanvas.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, chartConfig);
      setupChartInteraction(monthYear, mergedData);
    }
  }

  function setupChartInteraction(monthYear: string[], mergedData: number[]) {
    if (!chart || !overlayCanvas) return;

    const selectionContext = overlayCanvas.getContext('2d');
    if (!selectionContext) return;

    // Predefine last 2 years graph on overlay
    startIndex = Math.max(0, mergedData.length - 24);
    const endIndex = mergedData.length - 1;
    
    if (chart.scales && chart.scales.x && chart.chartArea) {
      selectionRect.startX = chart.scales.x.getPixelForValue(startIndex);
      selectionRect.startY = chart.chartArea.top;
      selectionRect.w = chart.scales.x.getPixelForValue(endIndex) - selectionRect.startX;
      
      selectionContext.globalAlpha = 0.5;
      selectionContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      selectionContext.fillStyle = 'rgba(104, 93, 216, 0.3)';
      selectionContext.fillRect(
        selectionRect.startX,
        selectionRect.startY,
        selectionRect.w,
        chart.chartArea.bottom - chart.chartArea.top
      );
    }

    // Set default start and end values
    startTime = monthYear[startIndex] || '';
    endTime = monthYear[endIndex] || '';

    // Mouse events for selection
    overlayCanvas.addEventListener('pointerdown', (evt) => {
      if (!chart) return;
      const rect = overlayCanvas.getBoundingClientRect();
      const points = chart.getElementsAtEventForMode(evt, 'index', { intersect: false },false);
      if (points.length > 0) {
        startIndex = points[0].index;
        selectionRect.startX = evt.clientX - rect.left;
        selectionRect.startY = chart.chartArea?.top || 0;
        drag = true;
      }
    });

    overlayCanvas.addEventListener('pointermove', (evt) => {
      if (drag && chart && selectionContext) {
        const rect = overlayCanvas.getBoundingClientRect();
        selectionRect.w = (evt.clientX - rect.left) - selectionRect.startX;
        selectionContext.globalAlpha = 0.5;
        selectionContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        selectionContext.fillStyle = 'rgba(104, 93, 216, 0.3)';
        selectionContext.fillRect(
          selectionRect.startX,
          selectionRect.startY,
          selectionRect.w,
          (chart.chartArea?.bottom || 0) - (chart.chartArea?.top || 0)
        );
      }
    });

    overlayCanvas.addEventListener('pointerup', (evt) => {
      if (!chart) return;
      drag = false;
      const points = chart.getElementsAtEventForMode(evt, 'index', { intersect: false },false);
      if (points.length > 0) {
        const endIdx = points[0].index;
        if (startIndex < endIdx) {
          startTime = monthYear[startIndex];
          endTime = monthYear[endIdx];
        } else {
          startTime = monthYear[endIdx];
          endTime = monthYear[startIndex];
        }
        console.log('Selected range:', startTime, 'to', endTime);
      }
    });
  }

  function formatDateToMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    
    if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }

    try {
      let date: Date;
      if (dateStr.includes('-')) {
        const [year, month] = dateStr.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1);
      } else if (dateStr.includes('/')) {
        const [month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1);
      } else {
        return '';
      }

      if (isNaN(date.getTime())) return '';

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  function convertToFirstDayOfMonth(dateString: string): string | null {
    const [month, year] = dateString.split('/');
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (yearNum < 1990 || yearNum > new Date().getFullYear()) {
      throw new Error(`Year ${yearNum} is out of valid range`);
    }

    try {
      const date = new Date(yearNum, monthNum - 1, 1);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return `${yearNum}${month}01`;
    } catch (error) {
      console.error('Error creating date:', error);
      return null;
    }
  }

  function formatTimestamp(timestamp: string): string {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    return `${month}/${year}`;
  }

  async function fetchScreenshots() {
    if (!startTime || !endTime || !domainName || !domainId) {
      alert('Please ensure all required data is available');
      return;
    }

    loading = true;
    screenshots = [];

    try {
      let formattedStartTime = formatDateToMMYYYY(startTime.trim());
      let formattedEndTime = formatDateToMMYYYY(endTime.trim());

      if (!formattedStartTime || !formattedEndTime) {
        const currentDate = new Date();
        const lastYear = currentDate.getFullYear() - 1;
        
        if (!formattedStartTime && !formattedEndTime) {
          formattedStartTime = `01/${lastYear}`;
          formattedEndTime = `12/${lastYear}`;
        } else {
          const validDate = formattedStartTime || formattedEndTime;
          const [, year] = validDate.split('/');
          
          if (!formattedStartTime) formattedStartTime = `01/${year}`;
          if (!formattedEndTime) formattedEndTime = `12/${year}`;
        }

        startTime = formattedStartTime;
        endTime = formattedEndTime;
      }

      const startDate = convertToFirstDayOfMonth(formattedStartTime);
      const endDate = convertToFirstDayOfMonth(formattedEndTime);

      if (!startDate || !endDate) {
        throw new Error('Invalid date conversion');
      }

      if (startDate > endDate) {
        alert('Start date must be before end date');
        return;
      }

      // Simulate API call - replace with actual API endpoint
      const mockData: ScreenshotItem[] = [
        { screenshot_url: 'https://via.placeholder.com/400x300?text=Screenshot+1', timestamp: '20240101120000' },
        { screenshot_url: 'https://via.placeholder.com/400x300?text=Screenshot+2', timestamp: '20240201120000' },
        { screenshot_url: 'https://via.placeholder.com/400x300?text=Screenshot+3', timestamp: '20240301120000' },
        { screenshot_url: 'https://via.placeholder.com/400x300?text=Screenshot+4', timestamp: '20240401120000' },
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      screenshots = mockData;

    } catch (error) {
      console.error('Error fetching screenshots:', error);
      alert('Error fetching screenshots: ' + (error as Error).message);
    } finally {
      loading = false;
    }
  }

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  }
</script>

<div class="w-full max-w-6xl mx-auto p-6 space-y-8">
  <!-- Chart Section -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Wayback Machine Data Visualization</h2>
    
    <div class="relative overflow-x-auto">
      <div class="relative inline-block min-w-full">
        <canvas 
          bind:this={chartCanvas}
          id="chartJSContainer"
          class="border border-gray-200 rounded"
        ></canvas>
        <canvas 
          bind:this={overlayCanvas}
          id="overlay"
          class="absolute top-0 left-0 cursor-crosshair"
          style="z-index: 10;"
        ></canvas>
      </div>
    </div>
  </div>

  <!-- Date Selection Section -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Select Date Range</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <label for="start_time" class="block text-sm font-medium text-gray-700 mb-1">
          Start Date (MM/YYYY)
        </label>
        <input
          id="start_time"
          bind:value={startTime}
          type="text"
          placeholder="MM/YYYY"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label for="end_time" class="block text-sm font-medium text-gray-700 mb-1">
          End Date (MM/YYYY)
        </label>
        <input
          id="end_time"
          bind:value={endTime}
          type="text"
          placeholder="MM/YYYY"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <button
          on:click={fetchScreenshots}
          disabled={loading}
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          {:else}
            Fetch Screenshots
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Screenshots Section -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Website Screenshots</h3>
    
    <div 
      bind:this={imageContainer}
      id="imageContainer"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-96 overflow-y-auto"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      {#if loading}
        {#each Array(6) as _, i}
          <div class="flex flex-col space-y-4">
            <div class="card p-2 shadow-lg border rounded-xl overflow-hidden">
              <div class="relative flex justify-center items-center h-48 bg-gray-100">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
            <div class="border-b pb-2">
              <div class="text-center">
                <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        {/each}
      {:else if screenshots.length > 0}
        {#each screenshots as item}
          <div class="flex flex-col space-y-4">
            <div class="card p-2 shadow-lg border rounded-xl overflow-hidden group">
              <div class="relative">
                <img
                  src={item.screenshot_url}
                  alt="Website screenshot"
                  class="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  on:error={handleImageError}
                />
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300"
                    on:click={() => window.open(item.screenshot_url, '_blank')}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="border-b pb-2">
              <div class="text-center">
                <h5 class="text-sm font-semibold text-gray-600">
                  {formatTimestamp(item.timestamp)}
                </h5>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="col-span-full text-center p-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>No screenshots available. Select a date range and click "Fetch Screenshots" to load data.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Hide scrollbar for webkit browsers */
  #imageContainer::-webkit-scrollbar {
    display: none;
  }
  
  /* Ensure the overlay canvas is properly positioned */
  #overlay {
    pointer-events: all;
  }
  
  .card {
    transition: transform 0.2s ease-in-out, shadow 0.2s ease-in-out;
  }
  
  .card:hover {
    transform: translateY(-2px);
    shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  /* Loading animation */
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>