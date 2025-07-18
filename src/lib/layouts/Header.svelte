<script lang="ts">
  import {
    isSidebarOpen,
    isSettingsPanelOpen,
    isSearchBoxOpen,
    loading,
  } from "$lib/stores/sidebar";

  // State variables
  let profileOpen = false;
  let mobileDropdownOpen = false;
  let workspaceOpen = false;
  let notificationDropdownOpen = false;

  export let userName: string = "Ronald";
  export let userRole: string = "Project Manager";

  // Sample notifications data
  let notifications = [
    {
      id: 1,
      title: "New project assigned to you",
      time: "2 min ago",
      type: "update",
      isRead: false,
    },
    {
      id: 2,
      title: "Team meeting scheduled for tomorrow",
      time: "1 hour ago",
      type: "info",
      isRead: false,
    },
    {
      id: 3,
      title: "Code review completed",
      time: "3 hours ago",
      type: "success",
      isRead: true,
    },
    {
      id: 4,
      title: "System maintenance tonight",
      time: "1 day ago",
      type: "warning",
      isRead: true,
    },
    {
      id: 5,
      title: "Welcome to the team!",
      time: "2 days ago",
      type: "info",
      isRead: true,
    },
  ];

  // Function to close all dropdowns
  function closeAllDropdowns() {
    profileOpen = false;
    mobileDropdownOpen = false;
    workspaceOpen = false;
    notificationDropdownOpen = false;
  }

  // Toggle functions that close others when opening
  function toggleWorkspace(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    if (workspaceOpen) {
      workspaceOpen = false;
    } else {
      closeAllDropdowns();
      workspaceOpen = true;
    }
  }

  function toggleProfile(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    if (profileOpen) {
      profileOpen = false;
    } else {
      closeAllDropdowns();
      profileOpen = true;
    }
  }

  function toggleMobileDropdown(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    if (mobileDropdownOpen) {
      mobileDropdownOpen = false;
    } else {
      closeAllDropdowns();
      mobileDropdownOpen = true;
    }
  }

  function toggleNotificationDropdown(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    if (notificationDropdownOpen) {
      notificationDropdownOpen = false;
    } else {
      closeAllDropdowns();
      notificationDropdownOpen = true;
    }
  }

  // Mark all notifications as read
  function markAllAsRead() {
    notifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (!event.target) return;

    const target = event.target as HTMLElement;

    // Close workspace dropdown if clicking outside
    if (workspaceOpen && !target.closest(".workspace-container")) {
      workspaceOpen = false;
    }

    // Close profile dropdown if clicking outside
    if (profileOpen && !target.closest(".profile-container")) {
      profileOpen = false;
    }

    // Close notification dropdown if clicking outside
    if (
      notificationDropdownOpen &&
      !target.closest(".notification-container")
    ) {
      notificationDropdownOpen = false;
    }

    // Close mobile dropdown if clicking outside
    if (mobileDropdownOpen && !target.closest(".mobile-dropdown-container")) {
      mobileDropdownOpen = false;
    }
  };
</script>

<!-- Add global click listener -->
<svelte:window on:click={handleClickOutside} />

<header
  class="flex items-center justify-between gap-1 sm:gap-6 py-3.5 px-6 border-b border-solid border-gray-200 fixed bg-white z-20 top-0 max-lg:left-0 lg:fixed right-0 transition-all duration-300"
  class:ml-0={!$isSidebarOpen}
  class:ml-16={!$isSidebarOpen}
  class:lg:ml-[270px]={$isSidebarOpen}
  style="position: fixed; top: 0; left: 0; right: 0;"
>
  <!-- Left section -->
  <div class="relative flex items-center">
    <!-- Mobile menu button -->
    <button
      class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 lg:hidden"
      aria-label="Toggle sidebar menu"
      on:click={() => ($isSidebarOpen = !$isSidebarOpen)}
    >
      <img
        src="assets/images/menu-icon.svg"
        alt="Menu icon"
        class="rotate-180"
      />
    </button>

    <!-- Welcome section -->
    <div class="block">
      <h6
        class="text-sm sm:text-lg font-semibold text-gray-900 whitespace-nowrap mb-1.5"
      >
        Welcome back,
        <span class="text-indigo-600 text-base sm:text-lg font-semibold">
          {userName}!
        </span>
      </h6>
      <nav aria-label="Breadcrumb">
        <ol class="flex text-xs font-medium text-gray-900 space-x-3">
          <li>
            <a href="/home" class="text-blue-600 hover:text-blue-800">Home</a>
          </li>
          <li>
            <svg
              width="6"
              height="20"
              viewBox="0 0 6 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.25 1.13672L1.12433 18.8633"
                stroke="#E5E7EB"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </li>
          <li>
            <span class="text-gray-500">Team</span>
          </li>
        </ol>
      </nav>
    </div>
  </div>

  <!-- Right section - Desktop view -->
  <div class="max-sm:hidden flex flex-row items-center gap-1 sm:gap-6">
    <!-- Workspace dropdown -->
    <div class="relative inline-block text-left workspace-container">
      <div class="bg-blue-100 py-3 px-2.5 rounded-2xl">
        <button
          class="flex items-center gap-3 cursor-pointer w-full text-left"
          type="button"
          aria-expanded={workspaceOpen}
          aria-haspopup="true"
          aria-label="Toggle workspace dropdown"
          on:click={toggleWorkspace}
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100"
          >
            <img src="assets/images/fe.png" alt="user avatar icon" />
          </div>
          <div class="block">
            <p class="font-semibold text-sm font-poppins text-gray-500 mb-0.5">
              Workspace
            </p>
            <p class="font-medium text-sm font-poppins text-black">Frontend</p>
          </div>
          <div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3327 10C18.3327 14.6 14.5993 18.3334 9.99935 18.3334C5.39935 18.3334 2.59102 13.7 2.59102 13.7M2.59102 13.7H6.35768M2.59102 13.7V17.8667M1.66602 10C1.66602 5.40002 5.36602 1.66669 9.99935 1.66669C15.5577 1.66669 18.3327 6.30002 18.3327 6.30002M18.3327 6.30002V2.13335M18.3327 6.30002H14.6327"
                stroke="#292D32"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>

        {#if workspaceOpen}
          <div
            class="absolute right-0 mt-2 z-10 w-56 rounded-2xl font-poppins shadow-lg bg-white focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
            on:click={(e) => e.stopPropagation()}
            on:keydown={(e) => e.stopPropagation()}
          >
            <div class="p-4">
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl mb-1 text-gray-700 bg-indigo-600/15 text-left"
                role="menuitem"
                aria-label="Switch to Backend workspace"
              >
                <img
                  src="assets/images/be.png"
                  class="w-[26px] h-[26px] mr-2"
                  alt="Backend"
                />
                Backend
              </button>
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl mb-1 text-gray-700 hover:bg-indigo-600/30 text-left"
                role="menuitem"
                aria-label="Switch to Server workspace"
              >
                <img
                  src="assets/images/sv.png"
                  class="w-[26px] h-[26px] mr-2"
                  alt="Server"
                />
                Server
              </button>
              <button
                class="flex items-center w-full px-4 py-3 text-sm rounded-xl mb-1 text-gray-700 hover:bg-indigo-600/30 text-left"
                role="menuitem"
              >
                <img
                  src="assets/images/st.png"
                  class="w-[26px] h-[26px] mr-2"
                  alt="Support Team"
                />
                Support Team
              </button>
              <div class="flex pt-2">
                <button
                  class="flex items-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700"
                  role="menuitem"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 4.5V13.5M13.5 9H4.5"
                      stroke="white"
                      stroke-width="1.3"
                      stroke-linecap="round"
                    ></path>
                  </svg>
                  Add Workspace
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Notification -->
    <div class="relative inline-block text-left notification-container">
      <div class="bg-blue-100 hover:bg-indigo-50 rounded-full">
        <button
          class="flex items-center gap-3 cursor-pointer"
          aria-expanded={notificationDropdownOpen}
          aria-haspopup="true"
          aria-label="Toggle notifications"
          on:click={toggleNotificationDropdown}
        >
          <div class="p-3 relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99023 4.89062V7.35113"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
                stroke-linecap="round"
              />
              <path
                d="M9.01472 1.6123C6.29561 1.6123 4.09372 3.81419 4.09372 6.5333V8.08497C4.09372 8.58742 3.88683 9.34108 3.62822 9.76964L2.68983 11.3361C2.1135 12.304 2.5125 13.3828 3.5765 13.7375C7.10838 14.9123 10.9284 14.9123 14.4603 13.7375C15.4578 13.405 15.8864 12.2375 15.347 11.3361L14.4086 9.76964C14.15 9.34108 13.9431 8.58003 13.9431 8.08497V6.5333C13.9357 3.82897 11.7191 1.6123 9.01472 1.6123Z"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
                stroke-linecap="round"
              />
              <path
                d="M11.4522 14.0381C11.4522 15.3903 10.3439 16.4986 8.99175 16.4986C8.31936 16.4986 7.69869 16.2178 7.25536 15.7745C6.81203 15.3311 6.53125 14.7105 6.53125 14.0381"
                stroke="#4F46E5"
                stroke-width="1.10833"
                stroke-miterlimit="10"
              />
            </svg>
            <div
              class="absolute text-[10px] -top-1 -right-1 text-white bg-indigo-600 text-center w-4 h-4 rounded-full flex items-center justify-center"
            >
              {notifications.filter((n) => !n.isRead).length}
            </div>
          </div>
        </button>

        {#if notificationDropdownOpen}
          <div
            class="absolute right-0 mt-2 z-10 w-96 rounded-2xl font-poppins shadow-lg bg-white focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
            on:click={(e) => e.stopPropagation()}
            on:keydown={(e) => e.stopPropagation()}
          >
            <div class="p-4">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-sm font-semibold text-gray-800">
                  Notifications
                </h2>
                <button
                  class="text-xs flex hover:text-indigo-600"
                  on:click={markAllAsRead}
                >
                  <svg
                    class="mr-2 mt-0.5"
                    width="16"
                    height="11"
                    viewBox="0 0 16 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.10723 6.99725C7.15662 7.04061 7.21409 7.07377 7.27634 7.09484C7.3386 7.1159 7.4044 7.12445 7.46997 7.11999C7.53554 7.11553 7.59957 7.09815 7.6584 7.06884C7.71723 7.03954 7.76968 6.99889 7.81273 6.94924L12.1162 2.01724C12.2034 1.91732 12.2473 1.78686 12.2383 1.65455C12.2293 1.52225 12.1682 1.39893 12.0682 1.31174C11.9683 1.22455 11.8378 1.18063 11.7055 1.18963C11.5732 1.19863 11.4499 1.25982 11.3627 1.35974L7.05923 6.29174C7.01594 6.34116 6.98282 6.39864 6.96179 6.46089C6.94077 6.52313 6.93224 6.58891 6.9367 6.65446C6.94116 6.72001 6.95852 6.78404 6.98778 6.84286C7.01705 6.90168 7.05764 6.95415 7.10723 6.99725Z"
                      fill="#4F46E5"
                    />
                    <path
                      d="M14.6866 0.926738L7.65062 8.99024L4.24962 5.21474C4.16084 5.11615 4.03653 5.05686 3.90404 5.04992C3.77154 5.04298 3.64172 5.08896 3.54312 5.17774C3.44453 5.26652 3.38524 5.39083 3.3783 5.52333C3.37136 5.65582 3.41734 5.78565 3.50612 5.88424L5.49062 8.08724L4.70462 8.98974L1.30462 5.21524C1.21584 5.11664 1.09153 5.05736 0.959036 5.05042C0.826542 5.04348 0.696718 5.08946 0.598123 5.17824C0.499529 5.26702 0.440241 5.39133 0.433302 5.52383C0.426364 5.65632 0.472342 5.78615 0.561123 5.88474L4.33912 10.0782C4.43412 10.1832 4.56912 10.2437 4.71062 10.2437H4.71462C4.7854 10.2432 4.85525 10.2276 4.91956 10.1981C4.98386 10.1685 5.04115 10.1256 5.08762 10.0722L6.16462 8.83574L7.28462 10.0787C7.37962 10.1837 7.51462 10.2442 7.65612 10.2442H7.66012C7.7309 10.2437 7.80075 10.2281 7.86506 10.1986C7.92936 10.169 7.98665 10.1261 8.03312 10.0727L15.4401 1.58374C15.4852 1.53456 15.5199 1.47686 15.5423 1.41406C15.5647 1.35125 15.5743 1.2846 15.5706 1.21802C15.5668 1.15144 15.5498 1.08629 15.5205 1.02639C15.4912 0.966489 15.4502 0.913056 15.3999 0.869233C15.3497 0.82541 15.2912 0.792083 15.2278 0.771213C15.1645 0.750343 15.0976 0.742352 15.0312 0.747711C15.0647 0.753069 15.1 0.771668 15.1408 0.802413C15.1816 0.833159 15.2292 0.87543 15.2866 0.926738Z"
                      fill="#4F46E5"
                    />
                  </svg>
                  Mark all as Read
                </button>
              </div>
              <hr class="my-3 h-px bg-gray-200 border-0" />

              <ul class="space-y-3 text-sm mt-3">
                {#each notifications as notification}
                  <li
                    class="p-3 border-b border-gray-200 hover:bg-indigo-50"
                    class:bg-indigo-50={notification.type === "update"}
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.834 6.66699C17.2147 6.66699 18.334 5.5477 18.334 4.16699C18.334 2.78628 17.2147 1.66699 15.834 1.66699C14.4533 1.66699 13.334 2.78628 13.334 4.16699C13.334 5.5477 14.4533 6.66699 15.834 6.66699Z"
                            stroke="#6F767E"
                            stroke-width="1.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.666 1.66699H7.49935C3.33268 1.66699 1.66602 3.33366 1.66602 7.50033V12.5003C1.66602 16.667 3.33268 18.3337 7.49935 18.3337H12.4993C16.666 18.3337 18.3327 16.667 18.3327 12.5003V8.33366"
                            stroke="#6F767E"
                            stroke-width="1.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p
                          class="text-gray-700 ml-2"
                          class:text-indigo-600={notification.type === "update"}
                          class:font-medium={notification.type === "update"}
                        >
                          {notification.title}
                        </p>
                      </div>
                      <span class="text-gray-500 flex items-center">
                        {notification.time}
                        {#if !notification.isRead}
                          <svg
                            class="ml-1"
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="4" cy="4" r="4" fill="#4F46E5" />
                          </svg>
                        {/if}
                      </span>
                    </div>
                  </li>
                {/each}
              </ul>
              <button
                class="w-full mt-2 items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                See all notifications
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
    <!-- Profile -->
    <div class="relative inline-block text-left profile-container">
      <button
        class="flex gap-2 items-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        aria-expanded={profileOpen}
        aria-haspopup="true"
        aria-label="Toggle profile menu"
        on:click={toggleProfile}
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100"
        >
          <img src="assets/images/ronald.png" alt="user avatar icon" />
        </div>
      </button>

      {#if profileOpen}
        <div
          class="absolute font-poppins right-10 mt-2 z-10 w-80 rounded-2xl shadow-lg bg-white focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
          on:click={(e) => e.stopPropagation()}
          on:keydown={(e) => e.stopPropagation()}
        >
          <div class="flex items-center p-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100"
            >
              <img src="assets/images/ronald.png" alt="user avatar icon" />
            </div>
            <div class="block text-left ml-4">
              <p class="font-semibold text-sm text-black mb-0.5">
                {userName}
              </p>
              <p class="font-medium text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
          <div class="px-4 pb-3">
            <button
              class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700 bg-indigo-600/15 hover:bg-indigo-600/25 cursor-pointer"
              role="menuitem"
              aria-label="Go to My Account"
            >
              <div class="flex items-center">
                <svg
                  width="34"
                  height="35"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="0.5" width="34" height="34" rx="17" fill="#4F46E5" />
                  <path
                    d="M17.0842 18.5854C17.0317 18.5779 16.9642 18.5779 16.9042 18.5854C15.5842 18.5404 14.5342 17.4604 14.5342 16.1329C14.5342 14.7754 15.6292 13.6729 16.9942 13.6729C18.3517 13.6729 19.4542 14.7754 19.4542 16.1329C19.4467 17.4604 18.4042 18.5404 17.0842 18.5854Z"
                    stroke="white"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.0495 23.5359C20.7145 24.7584 18.9445 25.5009 16.9945 25.5009C15.0445 25.5009 13.2745 24.7584 11.9395 23.5359C12.0145 22.8309 12.4645 22.1409 13.267 21.6009C15.322 20.2359 18.682 20.2359 20.722 21.6009C21.5245 22.1409 21.9745 22.8309 22.0495 23.5359Z"
                    stroke="white"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.9941 25.5005C21.1363 25.5005 24.4941 22.1426 24.4941 18.0005C24.4941 13.8584 21.1363 10.5005 16.9941 10.5005C12.852 10.5005 9.49414 13.8584 9.49414 18.0005C9.49414 22.1426 12.852 25.5005 16.9941 25.5005Z"
                    stroke="white"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="block text-left ml-4">
                  <p class="font-semibold text-sm text-black mb-0.5">
                    My Account
                  </p>
                  <p class="font-medium text-xs text-gray-500">
                    Edit Account details
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </button>

            <button
              class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 cursor-pointer"
              role="menuitem"
              aria-label="Go to Settings"
            >
              <div class="flex items-center">
                <svg
                  width="34"
                  height="35"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="0.5" width="34" height="34" rx="17" fill="#F1F5F9" />
                  <path
                    d="M21.5015 14.3705C21.4565 14.363 21.404 14.363 21.359 14.3705C20.324 14.333 19.499 13.4855 19.499 12.4355C19.499 11.363 20.3615 10.5005 21.434 10.5005C22.5065 10.5005 23.369 11.3705 23.369 12.4355C23.3615 13.4855 22.5365 14.333 21.5015 14.3705Z"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.7286 19.8306C21.7561 20.0031 22.8886 19.8231 23.6836 19.2906C24.7411 18.5856 24.7411 17.4306 23.6836 16.7256C22.8811 16.1931 21.7336 16.0131 20.7061 16.1931"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.4779 14.37C12.5229 14.3625 12.5754 14.3625 12.6204 14.37C13.6554 14.3325 14.4804 13.485 14.4804 12.435C14.4804 11.3625 13.6179 10.5 12.5454 10.5C11.4729 10.5 10.6104 11.37 10.6104 12.435C10.6179 13.485 11.4429 14.3325 12.4779 14.37Z"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.2511 19.8301C12.2236 20.0026 11.0911 19.8226 10.2961 19.2901C9.23855 18.5851 9.23855 17.4301 10.2961 16.7251C11.0986 16.1926 12.2461 16.0126 13.2736 16.1926"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.0015 19.9725C16.9565 19.965 16.904 19.965 16.859 19.9725C15.824 19.935 14.999 19.0875 14.999 18.0375C14.999 16.965 15.8615 16.1025 16.934 16.1025C18.0065 16.1025 18.869 16.9725 18.869 18.0375C18.8615 19.0875 18.0365 19.9425 17.0015 19.9725Z"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.8195 22.335C13.762 23.04 13.762 24.195 14.8195 24.9C16.0195 25.7025 17.9845 25.7025 19.1845 24.9C20.242 24.195 20.242 23.04 19.1845 22.335C17.992 21.54 16.0195 21.54 14.8195 22.335Z"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="block text-left ml-4">
                  <p class="font-semibold text-sm text-black mb-0.5">
                    My Organization
                  </p>
                  <p class="font-medium text-xs text-gray-500">
                    Edit Organization
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </button>

            <button
              class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 cursor-pointer"
              role="menuitem"
              aria-label="Help & Support"
            >
              <div class="flex items-center">
                <svg
                  width="34"
                  height="35"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="0.5" width="34" height="34" rx="17" fill="#F1F5F9" />
                  <path
                    d="M24.501 18C24.501 22.14 21.141 25.5 17.001 25.5C12.861 25.5 9.50098 22.14 9.50098 18C9.50098 13.86 12.861 10.5 17.001 10.5C21.141 10.5 24.501 13.86 24.501 18Z"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.7836 20.3848L17.4586 18.9973C17.0536 18.7573 16.7236 18.1798 16.7236 17.7073V14.6323"
                    stroke="#292D32"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="block text-left ml-4">
                  <p class="font-semibold text-sm text-black mb-0.5">
                    Activity Log
                  </p>
                  <p class="font-medium text-xs text-gray-500">
                    See recent activity
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </button>
            <hr class="my-3 h-px bg-gray-200 border-0" />
            <button
              class="flex items-center justify-between w-full px-4 py-3 mt-1 mb-1 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 cursor-pointer"
              role="menuitem"
              aria-label="Log Out"
            >
              <div class="flex items-center">
                <svg
                  width="34"
                  height="35"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect y="0.5" width="34" height="34" rx="17" fill="#EF4444" />
                  <path
                    d="M22.6667 18.5H12.6667M22.6667 18.5L19.3333 15.1667M22.6667 18.5L19.3333 21.8333"
                    stroke="white"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.3333 12.5V10.8333C15.3333 9.72824 16.2282 8.83334 17.3333 8.83334H22.6667C23.7718 8.83334 24.6667 9.72824 24.6667 10.8333V24.1667C24.6667 25.2718 23.7718 26.1667 22.6667 26.1667H17.3333C16.2282 26.1667 15.3333 25.2718 15.3333 24.1667V22.5"
                    stroke="white"
                    stroke-width="1.125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="block text-left ml-4">
                  <p class="font-semibold text-sm text-black mb-0.5">Log Out</p>
                  <p class="font-medium text-xs text-gray-500">
                    Log out of your account
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile right section -->
  <div class="sm:hidden flex items-center gap-2 mobile-dropdown-container">
    <button
      class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100"
      aria-label="Toggle mobile menu"
      on:click={toggleMobileDropdown}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.25 5.25H15.75M2.25 9H15.75M2.25 12.75H15.75"
          stroke="#374151"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    {#if mobileDropdownOpen}
      <div
        class="absolute right-4 top-16 z-10 w-80 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        on:click={(e) => e.stopPropagation()}
        on:keydown={(e) => e.stopPropagation()}
      >
        <div class="p-4">
          <!-- Profile section in mobile -->
          <div class="flex items-center mb-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100"
            >
              <img src="assets/images/ronald.png" alt="user avatar icon" />
            </div>
            <div class="block text-left ml-4">
              <p class="font-semibold text-sm text-black mb-0.5">
                {userName}
              </p>
              <p class="font-medium text-xs text-gray-500">{userRole}</p>
            </div>
          </div>

          <!-- Mobile menu items -->
          <div class="space-y-2">
            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#4F46E5"
                />
              </svg>
              <span class="ml-3">Workspace</span>
            </button>

            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#4F46E5"
                />
              </svg>
              <span class="ml-3">Notifications</span>
              <span
                class="ml-auto bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {notifications.filter((n) => !n.isRead).length}
              </span>
            </button>

            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#4F46E5"
                />
              </svg>
              <span class="ml-3">My Account</span>
            </button>

            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#4F46E5"
                />
              </svg>
              <span class="ml-3">Settings</span>
            </button>

            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-gray-700 hover:bg-indigo-600/15 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#4F46E5"
                />
              </svg>
              <span class="ml-3">Help & Support</span>
            </button>

            <hr class="my-3 h-px bg-gray-200 border-0" />

            <button
              class="flex items-center w-full px-4 py-3 text-sm rounded-xl text-red-600 hover:bg-red-50 text-left"
              role="menuitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6.00002C18.1392 6.00002 18.2784 4.99999 18.4176 5.00002L20.4176 5.00005C20.7839 5.00007 21.0784 5.29459 21.0784 5.66088C21.0784 6.02717 20.7839 6.32169 20.4176 6.32172L18.4176 6.32175C18.2784 6.32178 18.1392 6.32172 18 6.32175V6.00002Z"
                  fill="#EF4444"
                />
              </svg>
              <span class="ml-3">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>
