<script lang="ts">
	import { onMount } from 'svelte';

	interface TeamMember {
		id: number;
		name: string;
		role: string;
		image: string;
	}

	export let selectedMembers: TeamMember[] = [];
	export let placeholder: string = '';

	const teamMembers: TeamMember[] = [
		{ id: 1, name: 'John Doe', role: 'Developer', image: '/assets/images/announce-avatar-1.png' },
		{ id: 2, name: 'Jane Smith', role: 'Designer', image: '/assets/images/announce-avatar-2.png' },
		{ id: 3, name: 'Mike Johnson', role: 'Manager', image: '/assets/images/announce-avatar-3.png' },
		{ id: 4, name: 'Emily Brown', role: 'QA Engineer', image: '/assets/images/announce-avatar-4.png' }
	];

	let isActive = false;
	let searchTerm = '';
	let inputElement: HTMLInputElement;

	$: filteredMembers = teamMembers.filter(member =>
		member.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	function toggleMember(member: TeamMember) {
		const index = selectedMembers.findIndex(m => m.id === member.id);
		if (index > -1) {
			selectedMembers = selectedMembers.filter(m => m.id !== member.id);
		} else {
			selectedMembers = [...selectedMembers, member];
		}
		searchTerm = '';
		inputElement?.focus();
	}

	function removeMember(id: number) {
		selectedMembers = selectedMembers.filter(m => m.id !== id);
		inputElement?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Backspace' && searchTerm === '' && selectedMembers.length > 0) {
			removeMember(selectedMembers[selectedMembers.length - 1].id);
		}
	}

	function handleClickOutside(e: Event) {
		if (!(e.target as Element).closest('.custom-select')) {
			isActive = false;
		}
	}

	function isMemberSelected(id: number): boolean {
		return selectedMembers.some(m => m.id === id);
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="flex flex-col text-sm">
	<span class="text-gray-600 pb-1">Author</span>
	<div class="custom-select bg-white rounded-lg border border-gray-300" class:active={isActive}>
		<div class="flex flex-wrap items-center p-2 min-h-[42px]">
			<div class="selected-items flex flex-wrap gap-2">
				{#each selectedMembers as member (member.id)}
					<div class="bg-blue-100 rounded-full relative px-3 py-2 flex items-center text-sm">
						<img src={member.image} alt={member.name} class="w-4 h-4 rounded-full mr-1" />
						<span class="mr-1">{member.name}</span>
						<button
							class="absolute top-1 -right-0 hover:opacity-90"
							on:click={() => removeMember(member.id)}
							type="button"
						>
							<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5 0C2.245 0 0 2.245 0 5C0 7.755 2.245 10 5 10C7.755 10 10 7.755 10 5C10 2.245 7.755 0 5 0ZM6.68 6.15C6.825 6.295 6.825 6.535 6.68 6.68C6.605 6.755 6.51 6.79 6.415 6.79C6.32 6.79 6.225 6.755 6.15 6.68L5 5.53L3.85 6.68C3.775 6.755 3.68 6.79 3.585 6.79C3.49 6.79 3.395 6.755 3.32 6.68C3.175 6.535 3.175 6.295 3.32 6.15L4.47 5L3.32 3.85C3.175 3.705 3.175 3.465 3.32 3.32C3.465 3.175 3.705 3.175 3.85 3.32L5 4.47L6.15 3.32C6.295 3.175 6.535 3.175 6.68 3.32C6.825 3.465 6.825 3.705 6.68 3.85L5.53 5L6.68 6.15Z" fill="#DF6137"/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
			<input
				type="text"
				class="flex-grow text-sm outline-none px-2 py-1"
				{placeholder}
				bind:value={searchTerm}
				bind:this={inputElement}
				on:focus={() => (isActive = true)}
				on:keydown={handleKeydown}
			/>
		</div>
		{#if isActive}
			<div class="custom-select-dropdown text-sm mt-1 py-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
				{#each filteredMembers as member (member.id)}
					<div class="px-4 cursor-pointer flex items-center">
						<label 
							class="flex w-full items-center p-2 text-sm rounded-xl mb-1 text-gray-600 {isMemberSelected(member.id) ? 'bg-indigo-600/15' : 'bg-white hover:bg-indigo-600/15'}"
							on:click={() => toggleMember(member)}
						>
							<input
								type="checkbox"
								class="mr-2"
								checked={isMemberSelected(member.id)}
								on:change|stopPropagation={() => toggleMember(member)}
							/>
							<img src={member.image} alt={member.name} class="w-6 h-6 mr-1 rounded-full" />
							{member.name}
						</label>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.custom-select.active .custom-select-dropdown {
		display: block;
	}
</style>