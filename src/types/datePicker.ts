export type PredefinedDateOption = 'yesterday' | 'last7days' | 'last15days' | 'last30days' | 'last3months';

export interface DateRange {

  startDate: string;

  endDate: string;

}

export interface DatePickerState {

  startDate: string;

  endDate: string;

  calendarVisible: boolean;

  selectedOption: PredefinedDateOption | null;

}