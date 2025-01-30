import AddUserDialogClient from "./AddUserDialogClient";

export function AddUserDialog({
  debouncedFetchUsers,
}: {
  debouncedFetchUsers: () => void;
}) {
  return <AddUserDialogClient debouncedFetchUsers={debouncedFetchUsers} />;
}
