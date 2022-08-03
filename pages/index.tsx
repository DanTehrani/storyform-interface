import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
const ALPHA_FORM_ID =
  "bc7d1b4356f163b717582de5c3e309f880ab97c8132ef38c1630ea11a595513d";

const Index: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/forms/${ALPHA_FORM_ID}`);
  }, [router]);

  return <></>;
};

export default Index;
