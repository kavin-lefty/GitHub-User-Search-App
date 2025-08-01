"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Searchusers from "./searchusers";

export default function GithubUsersListClient() {
  const [strSearch, SetStrSearch] = useState<string>("");
  const [isModalOpen, SetIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const fetchusers = async () => {
    const res = await axios.get("https://api.github.com/users");
    return res.data;
  };

  const { data, refetch, error, isPending } = useQuery({
    queryKey: ["users_list"],
    queryFn: fetchusers,
  });

  const columns = [
    {
      title: "Sl.No",
      dataIndex: "id",
    },
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      render: (url: string) => (
        <Image src={url} alt="image_url" width={100} height={100} />
      ),
    },
    {
      title: "Name",
      dataIndex: "login",
    },
    {
      title: "actions",
      render: (data) => (
        <Button
          onClick={() => {
            SetStrSearch(data?.login);
            SetIsModalOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <section>
        <div className="flex justify-center md:justify-end my-5">
          <Button
            type="primary"
            className="text-xl cursor-pointer"
            onClick={() => router.push("/singleusers")}
          >
            Go To Search
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={isPending}
        />
        {strSearch && (
          <Modal
            open={isModalOpen}
            footer={null}
            onCancel={() => SetIsModalOpen(false)}
          >
            <Searchusers search={strSearch} />
          </Modal>
        )}
      </section>
    </>
  );
}
