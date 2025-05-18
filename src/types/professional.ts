
export interface ScheduleDay {
  active: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
  breakEnabled?: boolean;
}

export interface Schedule {
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;
}

export interface Professional {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  bio: string;
  services: string[];
  commissions: Record<string, number>;
  defaultCommission: number;
  schedule: Schedule;
}
