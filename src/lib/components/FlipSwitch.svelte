<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let checked: boolean = false;
  export let id: string = 'fs1';
  export let name: string = 'flipswitch';

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch('change', { checked: target.checked });
  }
</script>

<div class="flipswitch">
  <input
    id={id}
    class="flipswitch-cb"
    name={name}
    type="checkbox"
    bind:checked
    on:change={handleChange}
  />
  <label for={id} class="flipswitch-label">
    <div class="flipswitch-inner"></div>
    <div class="flipswitch-switch"></div>
  </label>
</div>
<style>
    .flipswitch {
  position: relative;
  width: 75px;
}

.flipswitch input[type="checkbox"] {
  display: none;
}

.flipswitch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50px;
}

.flipswitch-inner {
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in;
  font-size: 0px;
}

.flipswitch-inner:before,
.flipswitch-inner:after {
  float: left;
  width: 50%;
  height: 30px;
  line-height: 30px;
  font-size: 10px;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  box-sizing: border-box;
}

.flipswitch-inner:before {
  content: "Inactive";
  padding-left: 7px;
  background-color: #4f46e5;
  color: #ffffff;
}

.flipswitch-inner:after {
  content: "Active";
  padding-right: 12px;
  background-color: #eaecf0;
  color: #111827;
  text-align: right;
}

.flipswitch-switch {
  height: 25px;
  width: 25px;
  background: #ffffff;
  border-radius: 50px;
  position: absolute;
  top: 2px;
  right: 46px;
  transition: all 0.3s ease-in;
}

.flipswitch-cb:checked + .flipswitch-label .flipswitch-inner {
  margin-left: 0;
}

.flipswitch-cb:checked + .flipswitch-label .flipswitch-switch {
  right: 0;
}
</style>