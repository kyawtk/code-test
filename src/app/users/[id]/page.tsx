"use client";
import Header from "@/app/components/Header";
import UserList from "@/app/components/UserList";
import React from "react";
import UserInfo from "./component/UserInfo";
import { useParams } from "next/navigation";
import UserInfoTabs from "./component/UserInfoTabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const UserDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  return (

      <div className="flex gap-5">
        <UserInfo id={id} />
        <UserInfoTabs />
      </div>
    
  );
};

export default UserDetailPage;
