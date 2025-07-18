<script lang="ts">
  import { onMount } from 'svelte';
  import type { ApexOptions } from 'apexcharts';

  let chartElement: HTMLElement;
  let ApexCharts: any;

  interface ChartData {
    clicks: number;
    percentage: number;
    data: number[];
  }

  // Component props with default values
  export let chartData: ChartData = {
    clicks: 406,
    percentage: 12.96,
    data: [10, 20, 15, 30, 35, 30, 45, 59, 30, 35, 25, 29, 15]
  };

  let chart: any;

  onMount(async () => {
    // Dynamically import ApexCharts to avoid SSR issues
    const ApexChartsModule = await import('apexcharts');
    ApexCharts = ApexChartsModule.default;

    const options: ApexOptions = {
      series: [
        {
          data: chartData.data,
        },
      ],
      chart: {
        type: "area",
        height: 50,
        background: "transparent",
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          color: "#FF6838",
          opacity: 0.7,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        colors: ["#FFFFFF"],
      },
      stroke: {
        curve: "smooth",
        width: 1,
        colors: ["#FF6838"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          type: "vertical",
          colorStops: [
            {
              offset: 0,
              color: "#FF6838",
              opacity: 0.1,
            },
            {
              offset: 70,
              color: "#FF6838",
              opacity: 0.05,
            },
            {
              offset: 97,
              color: "#FF6838",
              opacity: 0.01,
            },
          ],
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#aaa",
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
      legend: {
        horizontalAlign: "left",
      },
      theme: {
        mode: "light", // Changed to light to match the design
      },
    };

    chart = new ApexCharts(chartElement, options);
    chart.render();
  });

  // Use onDestroy for cleanup
  import { onDestroy } from 'svelte';
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="w-[500px] relative p-4 bg-white rounded-lg shadow-sm border border-gray-200">
  <h6 class="text-sm font-normal text-gray-500 mb-1">
    Clicks
  </h6>
  <h5 class="text-xl font-semibold text-gray-900 leading-8 mb-4">
    {chartData.clicks.toLocaleString()}
  </h5>
  
  <span class="absolute right-2 top-2 items-center bg-orange-500 text-white text-xs font-medium mr-2 pl-2 pr-2.5 rounded-full py-1 mt-2 flex">
    <span class="flex mr-1">
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.62402 6.10095C4.69941 6.02556 4.74559 5.9208 4.74544 5.80575V5.75511C4.74544 5.52471 4.55892 5.33819 4.32882 5.33848L2.05236 5.33848L5.90324 1.48761C6.06587 1.32497 6.06587 1.06099 5.90324 0.898351C5.7406 0.735716 5.47662 0.735716 5.31398 0.898351L1.4631 4.74923V2.47277C1.4631 2.24237 1.27659 2.05585 1.04648 2.05615H0.995843C0.765444 2.05615 0.578927 2.24266 0.579221 2.47277V5.80575C0.579221 6.03614 0.765739 6.22266 0.995843 6.22237H4.32882C4.44402 6.22237 4.54864 6.17634 4.62402 6.10095Z"
          fill="white"
        />
      </svg>
    </span>
    {chartData.percentage}%
  </span>
  
  <div class="w-full block">
    <div class="w-full" bind:this={chartElement}></div>
  </div>
</div>

<!-- <style>
  /* Optional: Add custom styles if needed */
  :global(.apexcharts-canvas) {
    width: 100% !important;
  }
</style> -->