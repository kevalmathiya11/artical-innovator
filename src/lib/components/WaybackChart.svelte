<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  
  interface GraphData {
    years: Record<string, number[]>;
    status: Record<string, string>;
    last_ts: string;
    first_ts: string;
  }
  
  interface ScreenshotData {
    screenshot_url: string;
    timestamp: string;
  }
  
  export let graphData: GraphData = {
    years: {},
    status: {},
    last_ts: '',
    first_ts: ''
  };
  
  let chartCanvas: HTMLCanvasElement;
  let overlayCanvas: HTMLCanvasElement;
  let chart: Chart;
  let startTime = '';
  let endTime = '';
  let screenshotData: ScreenshotData[] = [];
  let isLoadingScreenshots = false;
  
  // Chart variables
  let selectionRect = {
    w: 0,
    h: 0,
    startX: 0,
    startY: 0
  };
  let isDragging = false;
  let startIndex = 0;
  let labels: string[] = [];
  let monthYearLabels: string[] = [];
  let animationId: number | null = null;
  
  onMount(() => {
    if (Object.keys(graphData.years).length > 0) {
      renderChart();
    }
  });
  
  function renderChart() {
    const years = Object.keys(graphData.years);
    labels = [];
    monthYearLabels = [];
    
    // Create month/year labels for the x-axis
    for (const year of years) {
      for (let month = 1; month <= 12; month++) {
        if (month === 1) {
          labels.push(year);
        } else {
          labels.push('');
        }
        monthYearLabels.push(`${month.toString().padStart(2, '0')}/${year}`);
      }
    }
    
    // Merge data for all years
    const mergedData: number[] = years.reduce((acc: number[], year) => 
      acc.concat(graphData.years[year]), [] as number[]
    );
    
    let yearCount = 12;
    let opacity = 0.5;
    
    // Set background color with alternating opacity
    const backgroundColor = mergedData.map((value, index) => {
      if (index % yearCount === 0) {
        opacity = opacity === 0.5 ? 1 : 0.5;
      }
      return `rgba(104, 93, 216, ${opacity})`;
    });
    
    const options = {
      type: 'bar' as const,
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: mergedData,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: true },
            ticks: {
              stepSize: 12,
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            grid: { display: false },
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
    
    // Set canvas dimensions - increased height significantly
    chartCanvas.width = chartCanvas.offsetWidth || 800;
    chartCanvas.height = 400; // Fixed height for better visibility
    
    const ctx = chartCanvas.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, options);
      
      // Setup overlay canvas with matching dimensions
      overlayCanvas.width = chartCanvas.width;
      overlayCanvas.height = chartCanvas.height;
      overlayCanvas.style.width = chartCanvas.style.width;
      overlayCanvas.style.height = chartCanvas.style.height;
      
      // Set default selection to last 2 years
      const defaultStartIndex = mergedData.length - 24;
      const defaultEndIndex = mergedData.length - 1;
      
      if (defaultStartIndex >= 0) {
        startTime = monthYearLabels[defaultStartIndex];
        endTime = monthYearLabels[defaultEndIndex];
        drawSelection(defaultStartIndex, defaultEndIndex);
      }
      
      setupOverlayEvents();
    }
  }
  
  function drawSelection(startIdx: number, endIdx: number, animate: boolean = false) {
    const selectionContext = overlayCanvas.getContext('2d');
    if (!selectionContext || !chart) return;
    
    // Clear the entire canvas first
    selectionContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // Calculate selection rectangle covering full chart area height
    const chartArea = chart.chartArea;
    const startX = chart.scales.x.getPixelForValue(startIdx);
    const endX = chart.scales.x.getPixelForValue(endIdx);
    const width = endX - startX;
    
    // Use full chart area for vertical coverage
    selectionRect = {
      startX: startX,
      startY: chartArea.top,
      w: width,
      h: chartArea.bottom - chartArea.top
    };
    
    if (animate) {
      animateSelection(selectionContext);
    } else {
      drawSelectionRect(selectionContext, 1);
    }
  }
  
  function animateSelection(context: CanvasRenderingContext2D) {
    let progress = 0;
    const duration = 300; // Animation duration in ms
    const startTime = performance.now();
    
    function animate(currentTime: number) {
      progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      drawSelectionRect(context, easeProgress);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    }
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animationId = requestAnimationFrame(animate);
  }
  
  function drawSelectionRect(context: CanvasRenderingContext2D, opacity: number = 1) {
    // Draw main selection area with gradient
    const gradient = context.createLinearGradient(
      selectionRect.startX, 
      selectionRect.startY, 
      selectionRect.startX, 
      selectionRect.startY + selectionRect.h
    );
    gradient.addColorStop(0, `rgba(59, 130, 246, ${0.15 * opacity})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.25 * opacity})`);
    gradient.addColorStop(1, `rgba(59, 130, 246, ${0.15 * opacity})`);
    
    context.fillStyle = gradient;
    context.fillRect(
      selectionRect.startX,
      selectionRect.startY,
      selectionRect.w,
      selectionRect.h
    );
    
    // Draw left border
    context.fillStyle = `rgba(59, 130, 246, ${0.8 * opacity})`;
    context.fillRect(
      selectionRect.startX,
      selectionRect.startY,
      3,
      selectionRect.h
    );
    
    // Draw right border
    context.fillRect(
      selectionRect.startX + selectionRect.w - 3,
      selectionRect.startY,
      3,
      selectionRect.h
    );
    
    // Draw top border
    context.fillRect(
      selectionRect.startX,
      selectionRect.startY,
      selectionRect.w,
      2
    );
    
    // Draw bottom border
    context.fillRect(
      selectionRect.startX,
      selectionRect.startY + selectionRect.h - 2,
      selectionRect.w,
      2
    );
    
    // Add corner highlights
    const cornerSize = 8;
    context.fillStyle = `rgba(255, 255, 255, ${0.9 * opacity})`;
    
    // Top-left corner
    context.fillRect(selectionRect.startX, selectionRect.startY, cornerSize, 2);
    context.fillRect(selectionRect.startX, selectionRect.startY, 3, cornerSize);
    
    // Top-right corner
    context.fillRect(selectionRect.startX + selectionRect.w - cornerSize, selectionRect.startY, cornerSize, 2);
    context.fillRect(selectionRect.startX + selectionRect.w - 3, selectionRect.startY, 3, cornerSize);
    
    // Bottom-left corner
    context.fillRect(selectionRect.startX, selectionRect.startY + selectionRect.h - 2, cornerSize, 2);
    context.fillRect(selectionRect.startX, selectionRect.startY + selectionRect.h - cornerSize, 3, cornerSize);
    
    // Bottom-right corner
    context.fillRect(selectionRect.startX + selectionRect.w - cornerSize, selectionRect.startY + selectionRect.h - 2, cornerSize, 2);
    context.fillRect(selectionRect.startX + selectionRect.w - 3, selectionRect.startY + selectionRect.h - cornerSize, 3, cornerSize);
  }
  
  function setupOverlayEvents() {
    overlayCanvas.addEventListener('pointerdown', (evt) => {
      const rect = overlayCanvas.getBoundingClientRect();
      const points = chart.getElementsAtEventForMode(evt, 'index', { intersect: false }, false);
      
      if (points.length > 0) {
        startIndex = points[0].index;
        const chartArea = chart.chartArea;
        selectionRect.startX = evt.clientX - rect.left;
        selectionRect.startY = chartArea.top;
        selectionRect.h = chartArea.bottom - chartArea.top;
        isDragging = true;
        
        // Change cursor style
        overlayCanvas.style.cursor = 'grabbing';
      }
    });
    
    overlayCanvas.addEventListener('pointermove', (evt) => {
      if (isDragging && chart) {
        const rect = overlayCanvas.getBoundingClientRect();
        const currentX = evt.clientX - rect.left;
        selectionRect.w = currentX - selectionRect.startX;
        
        const selectionContext = overlayCanvas.getContext('2d');
        if (selectionContext) {
          // Clear and redraw selection with live preview
          selectionContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          drawSelectionRect(selectionContext, 0.7);
        }
      } else {
        // Change cursor when hovering over chart area
        const chartArea = chart?.chartArea;
        if (chartArea) {
          const rect = overlayCanvas.getBoundingClientRect();
          const x = evt.clientX - rect.left;
          const y = evt.clientY - rect.top;
          
          if (x >= chartArea.left && x <= chartArea.right && y >= chartArea.top && y <= chartArea.bottom) {
            overlayCanvas.style.cursor = 'crosshair';
          } else {
            overlayCanvas.style.cursor = 'default';
          }
        }
      }
    });
    
    overlayCanvas.addEventListener('pointerup', (evt) => {
      if (isDragging) {
        isDragging = false;
        overlayCanvas.style.cursor = 'crosshair';
        
        const points = chart.getElementsAtEventForMode(evt, 'index', { intersect: false }, false);
        
        if (points.length > 0) {
          const endIndex = points[0].index;
          
          if (startIndex < endIndex) {
            startTime = monthYearLabels[startIndex];
            endTime = monthYearLabels[endIndex];
            drawSelection(startIndex, endIndex, true);
          } else if (startIndex > endIndex) {
            startTime = monthYearLabels[endIndex];
            endTime = monthYearLabels[startIndex];
            drawSelection(endIndex, startIndex, true);
          } else {
            // Single point selection - select that month
            startTime = monthYearLabels[startIndex];
            endTime = monthYearLabels[startIndex];
            drawSelection(startIndex, startIndex, true);
          }
          
          console.log('Selected range:', startTime, 'to', endTime);
        }
      }
    });
    
    // Handle mouse leave to reset cursor
    overlayCanvas.addEventListener('pointerleave', () => {
      overlayCanvas.style.cursor = 'default';
      if (isDragging) {
        isDragging = false;
      }
    });
  }
  
  function formatTimestamp(timestamp: string): string {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    return `${month}/${year}`;
  }
  
  function formatDateToMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    
    // If it's already in MM/YYYY format, validate it
    if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    
    try {
      let date;
      if (dateStr.includes('-')) {
        const [year, month] = dateStr.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1);
      } else if (dateStr.includes('/')) {
        const [month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1);
      } else {
        return '';
      }
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('Error creating date:', error);
      return null;
    }
  }
  
  async function viewScreenshots() {
    isLoadingScreenshots = true;
    
    let formattedStartTime = formatDateToMMYYYY(startTime.trim());
    let formattedEndTime = formatDateToMMYYYY(endTime.trim());
    
    // Set default dates if empty or invalid
    if (!formattedStartTime || !formattedEndTime) {
      const currentDate = new Date();
      const lastYear = currentDate.getFullYear() - 1;
      
      if (!formattedStartTime && !formattedEndTime) {
        formattedStartTime = `01/${lastYear}`;
        formattedEndTime = `12/${lastYear}`;
      } else {
        const validDate = formattedStartTime || formattedEndTime;
        const [, year] = validDate.split('/');
        
        if (!formattedStartTime) {
          formattedStartTime = `01/${year}`;
        }
        if (!formattedEndTime) {
          formattedEndTime = `12/${year}`;
        }
      }
      
      startTime = formattedStartTime;
      endTime = formattedEndTime;
    }
    
    // Final validation
    const dateFormatRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateFormatRegex.test(formattedStartTime) || !dateFormatRegex.test(formattedEndTime)) {
      alert('Please enter dates in MM/YYYY format (e.g., 01/2023)');
      isLoadingScreenshots = false;
      return;
    }
    
    try {
      const startDate = convertToFirstDayOfMonth(formattedStartTime);
      const endDate = convertToFirstDayOfMonth(formattedEndTime);
      
      if (!startDate || !endDate) {
        isLoadingScreenshots = false;
        return;
      }
      
      if (startDate > endDate) {
        alert('Start date must be before end date');
        isLoadingScreenshots = false;
        return;
      }
      
      // Mock API call - replace with actual API
      console.log('Fetching screenshots for date range:', startDate, 'to', endDate);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock screenshot data - replace with actual API response
      screenshotData = [
        { screenshot_url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Screenshot+1', timestamp: startDate },
        { screenshot_url: 'https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Screenshot+2', timestamp: endDate },
        { screenshot_url: 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Screenshot+3', timestamp: startDate },
        { screenshot_url: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Screenshot+4', timestamp: endDate }
      ];
      
    } catch (error: unknown) {
      console.error('Error fetching screenshots:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert('Error processing dates: ' + errorMessage);
    } finally {
      isLoadingScreenshots = false;
    }
  }
  
  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Image+Not+Found';
  }
  
  // Mock data for demonstration
  onMount(() => {
    if (Object.keys(graphData.years).length === 0) {
      graphData = {
        years: {
          "2021": [0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 3, 0],
          "2022": [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
          "2023": [2, 0, 6, 0, 3, 1, 0, 2, 3, 0, 0, 1],
          "2024": [3, 3, 1, 1, 3, 3, 1, 4, 2, 3, 2, 6],
          "2025": [2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        status: {
          "2021": "444424442224",
          "2022": "222244422444", 
          "2023": "242422422442",
          "2024": "222222222222",
          "2025": "222444444444"
        },
        last_ts: "20250315112700",
        first_ts: "20210529015418"
      };
      renderChart();
    }
  });
</script>

<div class="w-full max-w-7xl mx-auto p-6 bg-white">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Wayback Domain</h1>
      <p class="text-sm text-gray-600 mt-1">
        Manually inspect screenshots for design or ownership changes and record the start and end dates.
      </p>
    </div>
    <div class="flex gap-3">
      <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        Back
      </button>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Next
      </button>
    </div>
  </div>

  <!-- Chart Container -->
  <div class="mb-8 bg-gray-50 rounded-xl p-6">
    <div class="relative w-full">
      <div class="relative w-full">
        <canvas 
          bind:this={chartCanvas}
          class="border border-gray-200 rounded-lg bg-white w-full"
        ></canvas>
        <canvas 
          bind:this={overlayCanvas}
          class="absolute top-0 left-0 w-full h-full rounded-lg"
          style="pointer-events: auto;"
        ></canvas>
      </div>
    </div>
  </div>

  <!-- Date Range Inputs -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div>
      <label for="start-time" class="block text-sm font-medium text-gray-700 mb-2">
        Start Time
      </label>
      <input
        id="start-time"
        type="text"
        bind:value={startTime}
        placeholder="MM/YYYY"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label for="end-time" class="block text-sm font-medium text-gray-700 mb-2">
        End Time
      </label>
      <input
        id="end-time"
        type="text"
        bind:value={endTime}
        placeholder="MM/YYYY"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div class="flex items-end">
      <button
        on:click={viewScreenshots}
        disabled={isLoadingScreenshots}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
      >
        {#if isLoadingScreenshots}
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        {:else}
          View Screenshots
        {/if}
      </button>
    </div>
  </div>

  <!-- Screenshots Display -->
  {#if screenshotData.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each screenshotData as screenshot}
        <div class="w-full">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="relative">
              <img
                src={screenshot.screenshot_url}
                alt="Website screenshot"
                class="w-full h-48 object-cover"
                on:error={handleImageError}
                loading="lazy"
              />
              <div class="absolute top-2 right-2">
                <button
                  class="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  title="Preview"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-3 border-t border-gray-100">
              <h5 class="text-sm font-semibold text-center text-gray-600">
                {formatTimestamp(screenshot.timestamp)}
              </h5>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if isLoadingScreenshots}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each Array(4) as _}
        <div class="w-full">
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <div class="relative h-48 bg-gray-100 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div class="p-3 border-t border-gray-100">
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Hide scrollbars but keep functionality */
  div::-webkit-scrollbar {
    display: none;
  }
  
  div {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>