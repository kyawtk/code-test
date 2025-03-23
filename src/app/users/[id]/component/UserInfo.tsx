"use client";
import { User } from "@/app/components/UserList";
import { useQuery } from "@tanstack/react-query";

const UserInfo = ({ id }: { id: string }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User> => {
      const res = await fetch(`https://dummyjson.com/posts/user/${id}`);
      const data = await res.json();
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-1 min-w-lg">
      <h3 className="">
        {user?.firstName || 'User Name'} {user?.lastName}
      </h3>
    </div>
  );
};

export default UserInfo;
