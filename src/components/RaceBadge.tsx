import React from "react";
import type { Race } from "@/types";
import { getRaceColor, getRaceInKorean } from "@/utils/helpers";

interface RaceBadgeProps {
  race: Race;
  size?: "sm" | "md" | "lg";
}

const RaceBadge: React.FC<RaceBadgeProps> = ({ race, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const raceColor = getRaceColor(race);

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${sizeClasses[size]}
        ${raceColor}
      `}
    >
      {getRaceInKorean(race)}
    </span>
  );
};

export default RaceBadge;
