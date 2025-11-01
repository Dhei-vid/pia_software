import { Checkbox } from "./checkbox";
import { Label } from "./label";

interface ICheckboxField extends CheckboxProps {
  label: string;
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

type CheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox>;

export const CheckboxField: React.FC<ICheckboxField> = ({
  label,
  id,
  checked,
  onCheckedChange,
  ...props
}) => {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
      />
      <Label className="text-sm font-light text-foreground/70" htmlFor={id}>
        {label}
      </Label>
    </div>
  );
};
