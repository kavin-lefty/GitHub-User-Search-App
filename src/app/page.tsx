"use client";
import Searchusers from "./searchusers";
import GithubUsersListClient from "./usersClient";

export default function Home() {
  return (
    <>
      <GithubUsersListClient />
      {/* <Searchusers /> */}
    </>
  );
}
