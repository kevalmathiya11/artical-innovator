<!-- Calendar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selectedDates: Date[] = [];
  export let rangeMode: boolean = true;
  export let inline: boolean = true;
  
  let currentMonth: number = new Date().getMonth();
  let currentYear: number = new Date().getFullYear();
  let today: Date = new Date();
  
  // Range selection state
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  let isSelectingRange: boolean = false;
  
  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  $: firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  $: lastDayOfMonth = new Date(currentYear, currentMonth, daysInMonth).getDay();
  
  // Fixed reactive statement for selectedDates synchronization
  $: {
    if (selectedDates && selectedDates.length > 0) {
      const validDates = selectedDates.filter(date => date instanceof Date && !isNaN(date.getTime()));
      if (validDates.length > 0) {
        startDate = validDates[0];
        endDate = validDates[1] || null;
        
        // Update calendar view to show the selected month
        if (startDate) {
          currentMonth = startDate.getMonth();
          currentYear = startDate.getFullYear();
        }
      }
    } else {
      // Clear dates if selectedDates is empty
      startDate = null;
      endDate = null;
      isSelectingRange = false;
    }
  }

  // Calculate days to show
  $: calendarDays = (() => {
    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isNextMonth: boolean;
      isPrevMonth: boolean;
      isSelected: boolean;
      isInRange: boolean;
      isStartRange: boolean;
      isEndRange: boolean;
    }> = [];
    
    // Previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(prevYear, prevMonth, day);
      
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isStartRange: false,
        isEndRange: false
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = currentYear === today.getFullYear() && 
                     currentMonth === today.getMonth() && 
                     day === today.getDate();
      
      // Range selection logic - Fixed to ensure boolean values
      const isSelected = Boolean(
        (startDate && isSameDay(date, startDate)) || 
        (endDate && isSameDay(date, endDate))
      );
      const isStartRange = Boolean(startDate && isSameDay(date, startDate));
      const isEndRange = Boolean(endDate && isSameDay(date, endDate));
      const isInRange = Boolean(
        startDate && endDate && 
        date > startDate && date < endDate
      );
      
      days.push({
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        isToday,
        isSelected,
        isInRange,
        isStartRange,
        isEndRange
      });
    }
    
    // Next month days to fill the calendar
    const totalDays = days.length;
    const remainingSlots = 42 - totalDays; // 6 weeks * 7 days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    for (let day = 1; day <= remainingSlots && days.length < 42; day++) {
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isStartRange: false,
        isEndRange: false
      });
    }
    
    return days;
  })();

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  function previousMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }
  
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }
  
  function handleMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    currentMonth = parseInt(target.value);
  }
  
  function handleYearChange(event: Event) {
    const target = event.target as HTMLInputElement;
    currentYear = parseInt(target.value);
  }
  
  // Enhanced day click handler with better event dispatching
  function handleDayClick(day: { day: number; month: number; year: number; isCurrentMonth: boolean; isPrevMonth: boolean; isNextMonth: boolean }) {
    const clickedDate = new Date(day.year, day.month, day.day);
    
    if (rangeMode) {
      if (!startDate || (startDate && endDate)) {
        // Start new range
        startDate = clickedDate;
        endDate = null;
        isSelectingRange = true;
        // Dispatch immediate change for start date
        dispatch('change', [startDate]);
      } else if (startDate && !endDate) {
        // Complete range
        if (clickedDate < startDate) {
          endDate = startDate;
          startDate = clickedDate;
        } else {
          endDate = clickedDate;
        }
        isSelectingRange = false;
        
        // Dispatch change event with both dates
        dispatch('change', [startDate, endDate]);
      }
    } else {
      // Single date selection
      startDate = clickedDate;
      endDate = null;
      dispatch('change', [startDate]);
    }
  }

  // Method to force update from parent component
  export function updateDates(dates: Date[]) {
    if (dates && dates.length > 0) {
      const validDates = dates.filter(date => date instanceof Date && !isNaN(date.getTime()));
      if (validDates.length > 0) {
        startDate = validDates[0];
        endDate = validDates[1] || null;
        
        // Update calendar view to show the selected month
        if (startDate) {
          currentMonth = startDate.getMonth();
          currentYear = startDate.getFullYear();
        }
      }
    }
  }

  // Function to set dates externally (for predefined ranges)
  export function setDates(dates: Date[]) {
    updateDates(dates);
  }

  // Function to clear dates
  export function clear() {
    startDate = null;
    endDate = null;
    isSelectingRange = false;
  }
</script>

<div class="flatpickr-calendar {rangeMode ? 'rangeMode' : ''} animate {inline ? 'inline' : ''}" 
     style="position: relative; border: 1px solid #e3e3e3; border-radius: 5px; background: white; box-shadow: 0 3px 13px rgba(0,0,0,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.4; max-width: 307px;"
     tabindex="-1">
  
  <!-- Header with month navigation -->
  <div class="flatpickr-months" style="position: relative; overflow: hidden; height: 40px; color: rgba(0,0,0,0.9); fill: rgba(0,0,0,0.9); text-align: center; line-height: 1; background: transparent;">
    
    <!-- Previous month button -->
    <button 
      aria-label="Previous Month" 
      tabindex="-1"
      class="flatpickr-prev-month" 
      style="position: absolute; top: 0; left: 0; height: 40px; width: 40px; text-align: center; color: rgba(0,0,0,0.3); background: transparent; border: none; cursor: pointer; z-index: 3;"
      on:click={previousMonth}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17" style="height: 16px; width: 16px;">
        <g></g>
        <path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path>
      </svg>
    </button>
    
    <!-- Month and year controls -->
    <div class="flatpickr-month" style="height: 40px; display: flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.9); fill: rgba(0,0,0,0.9); font-weight: 500; font-size: 14px; line-height: 1; position: relative; user-select: none;">
      <div class="flatpickr-current-month" style="display: flex; align-items: center; gap: 8px;">
        <select class="flatpickr-monthDropdown-months" 
                style="appearance: none; background: transparent; border: none; font-size: inherit; font-weight: inherit; color: inherit; cursor: pointer; padding: 0; margin: 0;"
                aria-label="Month" 
                tabindex="-1"
                bind:value={currentMonth}
                on:change={handleMonthChange}>
          {#each months as month, index}
            <option class="flatpickr-monthDropdown-month" value={index} tabindex="-1">{month}</option>
          {/each}
        </select>
        
        <div class="numInputWrapper" style="position: relative; display: inline-block;">
          <input class="numInput cur-year" 
                 type="number" 
                 style="background: transparent; border: none; font-size: inherit; font-weight: inherit; color: inherit; width: 60px; text-align: center; padding: 0; margin: 0;"
                 tabindex="-1"
                 aria-label="Year"
                 bind:value={currentYear}
                 on:input={handleYearChange}>
          <span class="arrowUp" style="position: absolute; top: -1px; right: 0; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 4px solid rgba(0,0,0,0.3); cursor: pointer;"></span>
          <span class="arrowDown" style="position: absolute; bottom: -1px; right: 0; width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid rgba(0,0,0,0.3); cursor: pointer;"></span>
        </div>
      </div>
    </div>
    
    <!-- Next month button -->
    <button 
      aria-label="Next Month" 
      tabindex="-1"
      class="flatpickr-next-month" 
      style="position: absolute; top: 0; right: 0; height: 40px; width: 40px; text-align: center; color: rgba(0,0,0,0.3); background: transparent; border: none; cursor: pointer; z-index: 3;"
      on:click={nextMonth}>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17" style="height: 16px; width: 16px;">
        <g></g>
        <path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path>
      </svg>
    </button>
  </div>
  
  <!-- Calendar body -->
  <div class="flatpickr-innerContainer" style="display: block; background: white;">
    <div class="flatpickr-rContainer" style="display: inline-block; background: white;">
      
      <!-- Weekday headers -->
      <div class="flatpickr-weekdays" style="overflow: hidden; height: 28px; background: transparent; text-align: center; color: rgba(0,0,0,0.54); line-height: 1; border-bottom: 1px solid #eceef1;">
        <div class="flatpickr-weekdaycontainer" style="display: flex;">
          {#each weekdays as weekday}
            <span class="flatpickr-weekday" style="background: transparent; color: rgba(0,0,0,0.54); cursor: default; font-size: 90%; font-weight: 400; width: 14.2857%; line-height: 24px; text-align: center;">
              {weekday}
            </span>
          {/each}
        </div>
      </div>
      
      <!-- Days grid -->
      <div class="flatpickr-days" tabindex="-1" style="width: 307px; padding: 0;">
        <div class="dayContainer" style="padding: 0; outline: 0; text-align: left; width: 307px; min-width: 307px; display: flex; flex-wrap: wrap; justify-content: space-around; transform: translate3d(0px, 0px, 0px); opacity: 1;">
          {#each calendarDays as day}
            <button class="flatpickr-day 
                         {day.isToday ? 'today' : ''} 
                         {day.isNextMonth || day.isPrevMonth ? 'nextMonthDay' : ''}
                         {day.isSelected ? 'selected' : ''}
                         {day.isStartRange ? 'startRange' : ''}
                         {day.isEndRange ? 'endRange' : ''}
                         {day.isInRange ? 'inRange' : ''}" 
                    style="background: none; border: 1px solid transparent; border-radius: 150px; box-sizing: border-box; 
                           color: {day.isNextMonth || day.isPrevMonth ? '#c2c2c2' : (day.isSelected ? '#fff' : (day.isToday ? '#569ff7' : '#393939'))}; 
                           cursor: pointer; font-weight: 400; width: 39px; height: 39px; line-height: 39px; margin: 0; text-align: center; 
                           text-decoration: none; position: relative; font-size: 14px; 
                           background-color: {day.isSelected ? '#4f46e5' : (day.isToday ? '#dbeafe' : (day.isInRange ? '#e0e7ff' : 'transparent'))}; 
                           transition: background-color 0.2s ease;"
                    aria-label="{months[day.month]} {day.day}, {day.year}"
                    tabindex="-1"
                    on:click={() => handleDayClick(day)}>
              {day.day}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .flatpickr-calendar {
    animation: fpFadeInDown 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  @keyframes fpFadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  .flatpickr-day:hover:not(.nextMonthDay):not(.today) {
    background-color: #e6e6e6;
    border-color: #e6e6e6;
  }
  
  .flatpickr-day:focus {
    outline: 0;
    background-color: #e6e6e6;
    border-color: #e6e6e6;
  }
  
  .flatpickr-prev-month:hover svg,
  .flatpickr-next-month:hover svg {
    fill: rgba(0,0,0,0.9);
  }
  
  .flatpickr-monthDropdown-months:hover {
    background: rgba(0,0,0,0.05);
  }
  
  .numInput:focus {
    outline: 0;
  }
  
  .numInputWrapper:hover .arrowUp,
  .numInputWrapper:hover .arrowDown {
    border-color: rgba(0,0,0,0.9);
  }
</style>