export type ShiftStatus = 'active' | 'completed';

export interface Shift {
  id: string;
  worker_id: string;
  worker_code: string;
  date: string;
  start_time: string;
  end_time: string | null;
  total_seconds: number | null;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
}

export interface ShiftWithWorker extends Shift {
  worker_name: string;
}
