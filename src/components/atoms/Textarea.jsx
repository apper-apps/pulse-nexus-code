import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "glass-input w-full px-3 py-2 text-sm text-white placeholder:text-slate-400 rounded-lg resize-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;