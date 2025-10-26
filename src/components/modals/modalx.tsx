import { FC, ReactNode } from "react";
import ModalComponents from "@/components/general/alert-modal";

interface IModalX {
  trigger: ReactNode;
  content: ReactNode;
  onAction?: () => void | Promise<void>;
  modalStyle?: string;
}

const ModalX: FC<IModalX> = ({
  trigger,
  content,
  onAction = () => {},
  modalStyle,
}) => {
  return (
    <ModalComponents.GeneralAlertDialog
      onAction={onAction}
      btn={trigger}
      dialogContentStyle={modalStyle}
    >
      {content}
    </ModalComponents.GeneralAlertDialog>
  );
};

export default ModalX;
