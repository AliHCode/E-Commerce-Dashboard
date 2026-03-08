import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export function Skeleton({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={cn(
                "animate-pulse rounded-md",
                isDark ? "bg-slate-800" : "bg-slate-200",
                className
            )}
            {...props}
        />
    );
}
