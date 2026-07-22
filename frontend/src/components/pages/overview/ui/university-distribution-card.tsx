import { School } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UniversityStat } from "../types";

interface UniversityDistributionCardProps {
  universityStats: UniversityStat[];
  totalParticipants: number;
}

export function UniversityDistributionCard({
  universityStats,
  totalParticipants,
}: UniversityDistributionCardProps) {
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
          Distribusi Universitas
        </CardTitle>
        <CardDescription>
          Top 5 asal universitas peserta yang terdaftar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {universityStats.map((uni, idx) => {
            const percentage =
              totalParticipants > 0
                ? Math.round((uni.count / totalParticipants) * 100)
                : 0;

            return (
              <div key={uni.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="truncate max-w-[190px] text-muted-foreground flex gap-1.5 items-center">
                    <School className="h-3 w-3 shrink-0 text-muted-foreground" />
                    {uni.name}
                  </span>
                  <span className="font-mono text-foreground">
                    {uni.count} Peserta
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
          })}
        </div>
      </CardContent>
    </Card>
  );
}
