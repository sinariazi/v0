import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/lib/language-context";
import type { Gender, User, UserRole } from "@/types";
import { useContext, useMemo, useState } from "react";
import { UserManagementContext } from "./UserManagementContext";

export function UserTable() {
  const { state, dispatch, handleUpdateUser, handleRemoveUser } = useContext(
    UserManagementContext
  );
  const { t } = useLanguage();
  const [changedUsers, setChangedUsers] = useState<{ [key: number]: boolean }>(
    {}
  );

  const filteredUsers = useMemo(() => {
    return state.users.filter(
      (user) =>
        (user.firstName
          ?.toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
          user.lastName
            ?.toLowerCase()
            .includes(state.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.cognitoUsername
            ?.toLowerCase()
            .includes(state.searchTerm.toLowerCase())) ??
        false
    );
  }, [state.users, state.searchTerm]);

  const handleInputChange = (
    user: User,
    field: keyof User,
    value: string | UserRole | Gender
  ) => {
    const updatedUser = { ...user, [field]: value };
    dispatch({ type: "UPDATE_USER", payload: updatedUser as User });
    setChangedUsers((prev) => ({ ...prev, [user.id]: true }));
  };

  const handleSave = async (user: User) => {
    await handleUpdateUser(user);
    setChangedUsers((prev) => ({ ...prev, [user.id]: false }));
  };

  return (
    <>
      <Input
        placeholder={t("userManagement.searchPlaceholder")}
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
        }
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("userManagement.firstName")}</TableHead>
            <TableHead>{t("userManagement.lastName")}</TableHead>
            <TableHead>{t("userManagement.email")}</TableHead>
            <TableHead>{t("userManagement.role")}</TableHead>
            <TableHead>{t("userManagement.status")}</TableHead>
            <TableHead>{t("userManagement.gender")}</TableHead>
            <TableHead>{t("userManagement.team")}</TableHead>
            <TableHead>{t("userManagement.organizationId")}</TableHead>
            <TableHead>{t("userManagement.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Input
                  value={user.firstName}
                  onChange={(e) =>
                    handleInputChange(user, "firstName", e.target.value)
                  }
                  className="w-full"
                  placeholder="First Name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={user.lastName}
                  onChange={(e) =>
                    handleInputChange(user, "lastName", e.target.value)
                  }
                  className="w-full"
                  placeholder="Last Name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={user.email}
                  onChange={(e) =>
                    handleInputChange(user, "email", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) =>
                    handleInputChange(user, "role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("userManagement.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">
                      {t("userManagement.employee")}
                    </SelectItem>
                    <SelectItem value="MANAGER">
                      {t("userManagement.manager")}
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      {t("userManagement.admin")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Select
                  value={user.gender}
                  onValueChange={(value: Gender) =>
                    handleInputChange(user, "gender", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("userManagement.selectGender")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">
                      {t("userManagement.male")}
                    </SelectItem>
                    <SelectItem value="FEMALE">
                      {t("userManagement.female")}
                    </SelectItem>
                    <SelectItem value="OTHER">
                      {t("userManagement.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  value={user.team || ""}
                  onChange={(e) =>
                    handleInputChange(user, "team", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={user.organizationId}
                  onChange={(e) =>
                    handleInputChange(user, "organizationId", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSave(user)}
                    disabled={!changedUsers[user.id]}
                    className="flex-1"
                  >
                    {t("userManagement.save")}
                  </Button>
                  <Button
                    onClick={() => handleRemoveUser(user.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    {t("userManagement.remove")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
