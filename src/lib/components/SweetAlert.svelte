<script lang="ts">
  import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/sweetAlert';

  const handleClick = async () => {
    const result = await showConfirmAlert('Are you sure?', 'This action is irreversible!');
    if (result.isConfirmed) {
      showSuccessAlert('Deleted!', 'Your item has been deleted.');
    } else {
      showErrorAlert('Cancelled', 'Nothing was deleted.');
    }
  };
</script>

<button on:click={handleClick} class="p-2 bg-red-500 text-white rounded">
  Show Alert
</button>
