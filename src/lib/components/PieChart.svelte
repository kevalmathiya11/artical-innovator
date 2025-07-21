<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import type { ApexOptions } from 'apexcharts';

   interface ChartData {
    label: string;
    value: number;
    color: string;
  }

  export let data: ChartData[] = [
    { label: 'Social', value: 62, color: '#818cf8' },
    { label: 'Mail', value: 23, color: '#fbbf24' },
    { label: 'Referrals', value: 23, color: '#22d3ee' },
    { label: 'Search', value: 23, color: '#a78bfa' },
    { label: 'Direct', value: 23, color: '#4ade80' }
  ];
  
  export let chartType: 'pie' | 'donut' = 'pie';
  export let width: number = 380;
  export let height: number = 380;
  export let showLegend: boolean = true;
  export let showDataLabels: boolean = false;
  export let showTooltip: boolean = true;
  export let animationEnabled: boolean = true;
  export let showCustomLegend: boolean = true;

  let chartElement: HTMLElement;
  let chart: ApexCharts;

  $: labels = data.map(item => item.label);
  $: values = data.map(item => item.value);
  $: colors = data.map(item => item.color);

  $: chartOptions = {
    chart: {
      type: chartType,
      width: width,
      height: height,
      animations: {
        enabled: animationEnabled,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: false
      }
    },
    series: values,
    labels: labels,
    colors: colors,
    dataLabels: {
      enabled: showDataLabels,
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        fontWeight: 600,
        colors: ['#ffffff']
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45
      }
    },
    legend: {
      show: false // Always disable ApexCharts legend, we'll use custom
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10
        },
        donut: {
          size: chartType === 'donut' ? '70%' : '0%',
          background: 'transparent',
          labels: {
            show: false // Disable center labels for cleaner look
          }
        }
      }
    },
    tooltip: {
      enabled: showTooltip,
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, ui-sans-serif, system-ui'
      },
      y: {
        formatter: function (val: number) {
          return val + '%';
        }
      }
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: ['#ffffff'],
      width: 3,
      dashArray: 0
    },
    fill: {
      type: 'solid',
      opacity: 0.9
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
          height: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  } as ApexOptions;

  onMount(() => {
    if (chartElement) {
      chart = new ApexCharts(chartElement, chartOptions);
      chart.render();
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  // Update chart when data changes
  $: if (chart && data) {
    chart.updateOptions({
      series: values,
      labels: labels,
      colors: colors
    });
  }

  // Update chart when options change
  $: if (chart && chartOptions) {
    chart.updateOptions(chartOptions);
  }
</script>

<div class="flex flex-col items-center space-y-6">
  <div 
    bind:this={chartElement}
    class="apex-chart-container"
    style="min-height: {height}px;"
  ></div>
  
  {#if showCustomLegend}
    <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
      {#each data as item, index}
        <div class="flex items-center space-x-2">
          <div 
            class="w-3 h-3 rounded-full flex-shrink-0" 
            style="background-color: {item.color}"
          ></div>
          <span class="text-gray-700 dark:text-gray-300 font-medium">
            {item.label}: <strong>{item.value}%</strong>
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  :global(.apex-chart-container) {
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  }

  :global(.apexcharts-legend-text) {
    color: #374151 !important;
    font-weight: 500 !important;
  }

  :global(.dark .apexcharts-legend-text) {
    color: #d1d5db !important;
  }

  :global(.apexcharts-tooltip) {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    border-radius: 0.5rem !important;
  }
</style>