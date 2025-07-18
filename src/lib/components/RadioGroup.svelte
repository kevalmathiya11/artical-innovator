<script lang="ts">
  export let name: string = "status";
  export let selected: string = "Radio 1";
  export let options: string[] = ["Radio 1", "Radio 2", "Radio 3"];
</script>

<div class="flex items-center space-x-2 mb-2 text-sm">
  {#each options as option}
    <label
      class="flex items-center rounded-lg border border-solid border-gray-200 p-[10px]"
    >
      <input
        type="radio"
        name={name}
        value={option}
        class="form-radio text-indigo-600 mr-2"
        bind:group={selected}
      />
      <span>{option}</span>
    </label>
  {/each}
</div>
