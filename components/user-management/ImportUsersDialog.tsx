import ImportUsersDialogClient from "./ImportUsersDialogClient";

interface ImportUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportUsersDialog({ isOpen, onClose }: ImportUsersDialogProps) {
  return <ImportUsersDialogClient isOpen={isOpen} onClose={onClose} />;
}
