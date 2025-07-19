<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ApexOptions } from 'apexcharts';

	let chartContainer: HTMLDivElement;
	let ApexCharts: any;
	let chart: any;

	onMount(async () => {
		// Dynamically import ApexCharts to avoid SSR issues
		const apexchartsModule = await import('apexcharts');
		ApexCharts = apexchartsModule.default;

		// Initialize the chart with the exact same options as your original
		const uniqueChartOptions: ApexOptions = {
			series: [{
				name: 'Clicks',
				data: [25, 50, 60, 90, 28, 75, 30],
				color: '#FF6384'
			}, {
				name: 'Impressions',
				data: [20, 40, 50, 80, 45, 32, 20],
				color: '#36A2EB'
			}],
			chart: {
				height: 400,
				type: 'line',
				zoom: { enabled: false },
				toolbar: { show: false }
			},
			dataLabels: { enabled: false },
			stroke: {
				curve: 'smooth',
				width: 3
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: ['25/8/24', '26/8/24', '27/8/24', '28/8/24', '29/8/24', '30/8/24', '31/8/24'],
			},
			yaxis: {
				min: 0,
				max: 100,
				tickAmount: 5
			},
			legend: {
				position: 'top',
				horizontalAlign: 'left',
				offsetY: 0,
				itemMargin: {
					horizontal: 10
				}
			}
		};

		// Create and render the chart
		chart = new ApexCharts(chartContainer, uniqueChartOptions);
		chart.render();
	});

	onDestroy(() => {
		// Clean up the chart when component is destroyed
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="">
	<h3 class="text-lg px-4 py-4 font-semibold text-black">Stats</h3>
	<div bind:this={chartContainer}></div>
</div>