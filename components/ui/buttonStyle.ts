export const baseButtonClass = 'inline-flex items-center ml-2 cursor-pointer py-1 px-2 text-white font-semibold rounded transition-colors';

export const btnColor = {
  gray: 'bg-gray-900 hover:bg-amber-400',
  orange: 'bg-orange-500 hover:bg-amber-400',
  red: 'bg-red-500 hover:bg-amber-400',
} as const;

export const btnSize = {
  sm: 'text-sm py-0.5 px-2',
  md: 'text-base py-1 px-4',
  lg: 'text-lg py-2 px-6',
} as const;

export const btnDisabled = 'opacity-50 cursor-not-allowed';