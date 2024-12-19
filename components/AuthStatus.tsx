"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthStatus() {
  const { user, loading, checkAuthStatus } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkAuthStatus();
      setIsAuthenticated(status);
    };
    checkStatus();
  }, [checkAuthStatus]);

  const handleRefresh = async () => {
    const status = await checkAuthStatus();
    setIsAuthenticated(status);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>User:</strong>{" "}
            {user ? user.attributes.email : "Not logged in"}
          </p>
          <p>
            <strong>Session Active:</strong>{" "}
            {isAuthenticated === null
              ? "Checking..."
              : isAuthenticated
              ? "Yes"
              : "No"}
          </p>
          <Button onClick={handleRefresh} className="mt-4">
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
