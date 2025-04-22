"use client";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
});
const Page = () => {
  const { data, error } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await axios.get("/api/test");
      return res.data;
    },
  });
  return (
    <p>
      {data?.name} {error && JSON.stringify(error)}
    </p>
  );
};

export default Page;
