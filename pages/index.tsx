import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Index: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/forms`);
  }, [router]);

  return <></>;
};

export default Index;
