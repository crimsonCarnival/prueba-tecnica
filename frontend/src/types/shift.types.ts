export interface ShiftResponse {
  id: string;
  workerCode: string;
  workerName: string;
  date: string;
  startTime: string;
  endTime: string | null;
  totalSeconds: number | null;
  status: 'active' | 'completed';
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface AppError {
  code: string;
  message: string;
}
