import { ShiftWithWorker } from '../models/shift.model';

export interface StartShiftRequestDto {
  workerCode: string;
}

export interface EndShiftRequestDto {
  shiftId: string;
}

export interface ShiftResponseDto {
  id: string;
  workerCode: string;
  workerName: string;
  date: string;
  startTime: string;
  endTime: string | null;
  totalSeconds: number | null;
  status: string;
}

export function toShiftResponseDto(shift: ShiftWithWorker): ShiftResponseDto {
  return {
    id: shift.id,
    workerCode: shift.worker_code,
    workerName: shift.worker_name,
    date: shift.date,
    startTime: shift.start_time,
    endTime: shift.end_time,
    totalSeconds: shift.total_seconds,
    status: shift.status,
  };
}
