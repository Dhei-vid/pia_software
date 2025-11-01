import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FC, ReactNode } from "react";
import { Check, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IGeneralAlertDialog {
  children: ReactNode;
  btn: ReactNode;
  onAction: () => void;
  title?: string;
  dialogContentStyle?: string;
}

const GeneralAlertDialog: FC<IGeneralAlertDialog> = ({
  children,
  btn,
  title,
  onAction,
  dialogContentStyle,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer w-full">
        {btn}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn(dialogContentStyle)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <div>{children}</div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="flex flex-row items-center gap-2 bg-transparent hover:bg-green hover:text-white text-green border border-green"
            onClick={() => onAction()}
          >
            <Check />
            <p>Continue</p>
          </AlertDialogAction>
          <AlertDialogCancel className="flex flex-row items-center gap-2 bg-transparent text-white">
            <X />
            <p>Cancel</p>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface IModalTrigger {
  Icon?: LucideIcon;
  label: string;
}

const ModalTrigger: FC<IModalTrigger> = ({ Icon, label }) => {
  return (
    <div className="rounded-md h-9 px-4 py-2 cursor-pointer flex flex-row gap-3 items-center w-full justify-start text-foreground/70 hover:text-foreground hover:bg-lightgrey">
      {Icon && <Icon size={15} />}
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

const ModalComponents = { GeneralAlertDialog, ModalTrigger };

export default ModalComponents;
