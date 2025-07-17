import { cva } from 'class-variance-authority';
export const radioVariants = cva(
  'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all',
  {
    variants: {
      variant: {
        must: '',
        should: '',
        remind: '',
      },
      checked: {
        true: '',
        false: 'bg-transparent border-border-default',
      },
    },
    compoundVariants: [
      { checked: true, variant: 'must', className: 'bg-priority-must border-priority-must' },
      { checked: true, variant: 'should', className: 'bg-priority-should border-priority-should' },
      { checked: true, variant: 'remind', className: 'bg-priority-remind border-priority-remind' },
    ],
    defaultVariants: {
      variant: 'must',
      checked: false,
    },
  }
); 