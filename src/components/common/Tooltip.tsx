import React from 'react';

interface TooltipProps {
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'right-tight' | 'hidden';
}

const Tooltip: React.FC<TooltipProps> = ({ label, position }) => {
  return (
    <div
      className={`opacity-0 group-hover:opacity-100 z-50 w-fit absolute ${
        position === 'right'
          ? 'left-11 -top-1.5'
          : position === 'bottom'
          ? 'left-1/2 top-full translate-y-3 -translate-x-1/2'
          : position === 'right-tight'
          ? 'left-6 -top-1.5'
          : position === 'hidden'
          ? 'hidden'
          : ''
      }`}
    >
      <div
        className={`whitespace-nowrap dark:bg-customBlack-lighter text-customWhite text-xs p-2 rounded relative`}
      >
        {label}
        <div
          className={`absolute w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] dark:border-b-customBlack-lighter ${
            position === 'bottom'
              ? '-top-1 left-1/2 -translate-x-1/2'
              : position === 'right' || position === 'right-tight'
              ? 'top-1/2 -translate-y-1/2 -left-[2px] -rotate-90'
              : position === 'hidden'
              ? 'hidden'
              : ''
          } -translate-x-1/2`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
