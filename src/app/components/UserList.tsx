import Image from "next/image";
import Link from "next/link";
import { UserCard } from "./UserCard";

export type Response = {
  users: User[];
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};
export type User = {
  id: number;
  firstName: string;
  lastName: string;

  email: string;

  image: string;

  age: number;
  gender: string;
  birthdate: string; // Format: DD/MM/YYYY
  phone: string;
  eyeColor: string;
  hairType: string;
  company: string;
  address: Address;
};

async function getUsers(): Promise<Response> {
  const res = await fetch(`https://dummyjson.com/users`);
  console.log("🚀 ~ getUsers ~ res:", res);
  return res.json();
}

const UserList = async () => {
  const res = await getUsers();

  return (
    <div className="flex flex-wrap gap-2">
      {res?.users?.map((user) => {
        return (
          <UserCard
            key={user?.id}
            user={user}
          />
        );
      })}
    </div>
  );
};

export default UserList;
