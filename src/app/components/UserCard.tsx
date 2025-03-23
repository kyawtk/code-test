import Image from "next/image";
import Link from "next/link";
import { User } from "./UserList";

type Props = {
  user: User;
};
export const UserCard = ({ user }: Props) => {
  const { age, email, gender, id } = user;
  const fullName = user?.firstName + " " + user?.lastName;
  return (
    <Link href={`/users/${user?.id}`}>
      <div className="rounded-md border flex gap-2 p-2">
        <Image
          width={30}
          height={30}
          className="rounded-full aspect-square w-10 h-10"
          alt={fullName}
          src={user?.image}
        />
        <div className="">
          <h3>{fullName}</h3>
          <p>
            {age} - {gender}
          </p>
          <p>{email}</p>
        </div>
      </div>
    </Link>
  );
};
