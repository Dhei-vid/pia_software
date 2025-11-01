import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Spinner
      className={cn(
        `${sizeClasses[size]} text-gray-400`,
        className
      )}
    />
  );
};

export default LoadingSpinner;
