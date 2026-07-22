import { FacultyDistributionCard } from "./faculty-distribution-card";
import type { FacultyStat } from "../types";

export function UniversityDistributionCard({
  universityStats,
  totalParticipants,
}: {
  universityStats: FacultyStat[];
  totalParticipants: number;
}) {
  return (
    <FacultyDistributionCard
      facultyStats={universityStats}
      totalParticipants={totalParticipants}
    />
  );
}

