import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "glass-button text-white font-medium",
    secondary: "glass-card text-slate-200 hover:bg-white/10 font-medium",
    ghost: "hover:bg-white/10 text-slate-200 font-medium",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 font-medium",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;