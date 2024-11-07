// components/ui/popover.js
import React from 'react';

const Popover = ({ children }) => {
  return <div className="relative">{children}</div>;
};

const PopoverTrigger = ({ children, asChild }) => {
  return <div>{children}</div>;
};

const PopoverContent = ({ children, className }) => {
  return (
    <div className={`absolute bg-white border rounded shadow-lg p-2 ${className}`}>
      {children}
    </div>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

export default Popover;
