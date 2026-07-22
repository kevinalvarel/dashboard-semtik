import { Building2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FacultyStat } from "../types";

interface FacultyDistributionCardProps {
  facultyStats: FacultyStat[];
  totalParticipants: number;
}

export function FacultyDistributionCard({
  facultyStats,
  totalParticipants,
}: FacultyDistributionCardProps) {
  const colors = [
    "bg-primary",
    "bg-primary/80",
    "bg-primary/60",
    "bg-primary/40",
    "bg-primary/20",
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Distribusi Fakultas
        </CardTitle>
        <CardDescription>
          Top asal fakultas peserta yang terdaftar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {facultyStats.length > 0 ? (
            facultyStats.map((item, idx) => {
              const percentage =
                totalParticipants > 0
                  ? Math.round((item.count / totalParticipants) * 100)
                  : 0;

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="truncate max-w-[190px] text-muted-foreground flex gap-1.5 items-center">
                      <Building2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                      {item.name || "Fakultas Tidak Diketahui"}
                    </span>
                    <span className="font-mono text-foreground">
                      {item.count} Peserta
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${colors[idx % colors.length]} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">
              Tidak ada data fakultas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
