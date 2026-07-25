import axios from 'axios';
import apiClient from './client';
import type { ApiResponse, ShiftResponse } from '../types/shift.types';

function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.error?.message) return data.error.message;
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Verifique su conexión.';
    }
  }
  return 'Ocurrió un error inesperado';
}

export async function startShift(workerCode: string): Promise<ShiftResponse> {
  try {
    const { data } = await apiClient.post<ApiResponse<ShiftResponse>>('/shifts/start', { workerCode });
    return data.data!;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

export async function endShift(shiftId: string): Promise<ShiftResponse> {
  try {
    const { data } = await apiClient.patch<ApiResponse<ShiftResponse>>(`/shifts/${shiftId}/end`);
    return data.data!;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

export async function getActiveShift(workerCode: string): Promise<ShiftResponse | null> {
  try {
    const { data } = await apiClient.get<ApiResponse<ShiftResponse | null>>(`/shifts/active/${workerCode}`);
    return data.data ?? null;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

export async function getShiftHistory(workerCode: string): Promise<ShiftResponse[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ShiftResponse[]>>(`/shifts/history/${workerCode}`);
    return data.data ?? [];
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

export async function getAllShifts(): Promise<ShiftResponse[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ShiftResponse[]>>('/shifts/report');
    return data.data ?? [];
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}
