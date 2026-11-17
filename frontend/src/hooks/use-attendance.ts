import { useQuery } from "@tanstack/react-query";
import {
  getAttendance,
  type AttendanceApiResponse,
  type AttendanceFilterParams,
} from "@/api/attendance";

export function useAttendance(params?: AttendanceFilterParams) {
  return useQuery<AttendanceApiResponse>({
    queryKey: ["attendance", params],
    queryFn: () => getAttendance(params),
  });
}
