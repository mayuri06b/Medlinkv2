import * as React from "react";

const Button = React.forwardRef(
  ({ variant = "primary", size = "medium", asChild = false, className, ...props }, ref) => {
    const Component = asChild ? "span" : "button";

    const variantStyles = {
      primary: "bg-blue-500 text-white hover:bg-blue-800",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    };

    const sizeStyles = {
      small: "px-2 py-1 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    };

    return (
      <Component
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
