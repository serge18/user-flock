import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Filter, Users, Shield } from "lucide-react";
import { apiService } from "@/services/api";
import { User, Role } from "@/types/user";
import { MultiSelect } from "@/components/ui/multi-select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function UserRoleManager() {
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users and roles
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
  });

  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: apiService.getRoles,
  });

  // Update user roles mutation
  const updateUserRolesMutation = useMutation({
    mutationFn: apiService.updateUserRoles,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[]) =>
        oldUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      toast({
        title: "Success",
        description: "User roles updated successfully",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter users by role
  const filteredUsers = React.useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => user.roles.includes(roleFilter));
  }, [users, roleFilter]);

  // Handle role change for a user
  const handleRoleChange = (userId: string, newRoles: string[]) => {
    updateUserRolesMutation.mutate({ userId, roles: newRoles });
  };

  // Get role options for MultiSelect
  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.name,
  }));

  const isLoading = isLoadingUsers || isLoadingRoles;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">User Role Management</h1>
            </div>
            <p className="text-muted-foreground">
              Manage user permissions and access levels across your system
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{filteredUsers.length} users</span>
          </div>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter users by their assigned roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter by role:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {roleFilter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoleFilter("all")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View and manage user roles. Click on roles to modify assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="w-[300px]">Manage Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map((role) => (
                              <Badge key={role} variant="outline">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <MultiSelect
                            options={roleOptions}
                            selected={user.roles}
                            onChange={(newRoles) => handleRoleChange(user.id, newRoles)}
                            placeholder="Select roles..."
                            disabled={updateUserRolesMutation.isPending}
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Available Roles</CardTitle>
            <CardDescription>
              Overview of system roles and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <div key={role.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{role.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}