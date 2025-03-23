"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Posts from "./Posts";

const UserInfoTabs = () => {
  return (
    <div>
      <Tabs
        defaultValue="account"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="products">Products in Card</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="password">Receipts</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="posts">
          <Posts />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default UserInfoTabs;
