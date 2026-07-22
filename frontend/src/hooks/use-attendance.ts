import { useQuery } from "@tanstack/react-query";
import { getAttendance, type AttendanceApiResponse } from "@/api/attendance";

export function useAttendance() {
  return useQuery<AttendanceApiResponse>({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
}

