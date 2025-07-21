<script lang="ts">
  import { showSuccessAlert, showErrorAlert, showConfirmAlert ,showToast} from '../../utils/sweetAlert';
   import PieChart from '$lib/components/PieChart.svelte';
  import WaybackChart from '$lib/components/WaybackChart.svelte';
  // import type { ChartData } from '$lib/components/PieChart.svelte';


    const graphData = {"years": {"2002": [0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 3, 0], "2003": [0, 3, 0, 2, 1, 3, 1, 1, 0, 1, 0, 4], "2004": [1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0], "2005": [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], "2013": [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], "2014": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2], "2015": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], "2016": [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0], "2017": [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0], "2018": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], "2019": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], "2020": [0, 0, 0, 0, 0, 0, 2, 1, 4, 3, 1, 1], "2021": [1, 1, 1, 1, 2, 0, 0, 4, 0, 2, 2, 3], "2022": [5, 1, 7, 2, 3, 3, 1, 4, 2, 3, 2, 6], "2023": [2, 0, 6, 0, 3, 1, 0, 2, 3, 0, 0, 1], "2024": [2, 2, 1, 4, 5, 4, 2, 3, 2, 3, 3, 1], "2025": [2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, "status": {"2002": "444424442224", "2003": "424222224242", "2004": "222244422444", "2005": "422444444444", "2013": "444444424442", "2014": "444444444443", "2015": "444444444444", "2016": "443444444344", "2017": "444444444444", "2018": "444444434444", "2019": "444444434444", "2020": "444444322222", "2021": "222224424222", "2022": "222222222222", "2023": "242422422442", "2024": "222222222222", "2025": "222444444444"}, "last_ts": "20250315112700", "first_ts": "20020529015418"}

  const handleClick = async () => {
    const result = await showConfirmAlert('Are you sure?', 'This action is irreversible!');
    if (result.isConfirmed) {
      showSuccessAlert('Deleted!', 'Your item has been deleted.');
    } else {
      showErrorAlert('Cancelled', 'Nothing was deleted.');
    }

  };
  const success = () => {
    // Simulate successful login
    showToast('Login successful', 'success');
  };

    const error = () => {
    // Simulate successful login
    showToast('something went wrong', 'error');
  };

     const warn = () => {
    // Simulate successful login
    showToast('you warned for this', 'warning');
  };
     const info = () => {
    // Simulate successful login
    showToast('this is info', 'info');
  };
  

  // const trafficData: ChartData[] = [
  //   { label: 'Social', value: 62, color: '#818cf8' },
  //   { label: 'Mail', value: 23, color: '#fbbf24' },
  //   { label: 'Referrals', value: 23, color: '#22d3ee' },
  //   { label: 'Search', value: 23, color: '#a78bfa' },
  //   { label: 'Direct', value: 23, color: '#4ade80' }
  // ];

</script>

<div>
  <button on:click={handleClick} class="p-2 bg-red-500 text-white rounded">
  Show Alert
</button>


<button on:click={success} class="bg-green-500 text-white px-4 py-2 rounded">
  success
</button>

<button on:click={error} class="bg-red-500 text-white px-4 py-2 rounded">
  error
</button>

<button on:click={warn} class="bg-yellow-500 text-white px-4 py-2 rounded">
  warn
</button>
<button on:click={info} class="bg-blue-500 text-white px-4 py-2 rounded">
  Info
</button>

  <PieChart 
          
          chartType="donut"
          width={320}
          height={320}
          showCustomLegend={true}
        />

  <WaybackChart
/>


</div>