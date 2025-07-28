"use client";

import { useState } from "react";
import { ServiceRequestList } from "@/components/service-request";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function ViewServiceRequestsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const getCurrentUserId = (): number => {
    if (!isAuthenticated || !user) {
      return 0;
    }
    return user.id || 0;
  };

  const userId = getCurrentUserId();

  const handleCreateNewRequest = () => {
    router.push("/service-request/create");
  };

  return (
    <div className="container mx-auto py-8"> 
      <ServiceRequestList
        userId={userId}
        showUserRequests={true}
        onCreateRequest={handleCreateNewRequest}
      />
    </div>
  );
}
