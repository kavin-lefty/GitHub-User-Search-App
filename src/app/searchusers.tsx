"use client";

import { useQuery } from "@tanstack/react-query";
import { Image, Input, Spin, Alert, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Searchusers({ search = "" }) {
  const [strSearch, SetStrSearch] = useState<string>(search);
  const [strDebounced, SetStrDebounced] = useState<string>("");
  const router = useRouter();

  const { data, refetch, error, isPending, isError } = useQuery({
    queryKey: ["singleUsers", { strDebounced }],
    queryFn: async ({ queryKey }) => {
      const [, { strDebounced }] = queryKey;
      const res = await axios.get(
        `https://api.github.com/users/${strDebounced}`
      );
      return res.data;
    },
    enabled: !!strDebounced,
    retry: false,
    staleTime: 60 * 5,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      SetStrDebounced(strSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [strSearch]);

  return (
    <section className="p-4 max-w-xl mx-auto">
      {!search && (
        <>
          <Button className="my-4" type="primary" onClick={() => router.back()}>
            Back to lists
          </Button>
          <Input
            placeholder="Search GitHub user by username"
            value={strSearch}
            onChange={(e) => SetStrSearch(e.target.value.trimStart())}
          />
        </>
      )}
      {isPending && (
        <>
          <div className="flex item-center justify-center my-10">
            <Spin tip="Loading..." size="large" className="mt-4" />
          </div>
        </>
      )}

      {isError && (
        <Alert
          message="User not found"
          description="Please check the username and try again."
          type="error"
          showIcon
          className="mt-4"
        />
      )}

      {data && !isPending && (
        <div className="mt-4 space-y-2 flex items-center justify-center">
          <div>
            <p className="flex justify-center">
              <Image src={data?.avatar_url} height={100} width={100} />
            </p>
            <p className="my-3">
              <strong>Name:</strong> {data?.login ?? "users"}
            </p>
            <p className="my-3">
              <strong>Bio:</strong> {data?.bio || "N/A"}
            </p>
            <p className="my-3">
              <strong>Location:</strong> {data?.location || "N/A"}
            </p>
            <p className="my-3">
              <strong>Followers:</strong> {data?.followers}
            </p>
            <p className="my-3">
              <strong>Public Repos:</strong> {data?.public_repos}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
