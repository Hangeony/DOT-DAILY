import { radioVariants } from '@/lib/styles';
import type { VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface RadioButtonProps extends Omit<VariantProps<typeof radioVariants>, 'checked'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  variant: 'must' | 'should' | 'remind';
  label?: ReactNode;
  name: string;
  value: string;
  className?: string;
}

export default function RadioButton({
  checked = false,
  onChange,
  variant,
  label,
  name,
  value,
  className,
}: RadioButtonProps) {
  return (
    <label className={clsx('flex items-center gap-2 cursor-pointer select-none', className)}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(true)}
        className="sr-only"
      />
      <span className={radioVariants({ variant, checked })}>
        {checked && <span className="block w-3 h-3 rounded-full bg-white" />}
      </span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
} 