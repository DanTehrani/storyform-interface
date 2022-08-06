import { Button, Heading, Center } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm } from "../hooks";
import { getCurrentUnixTime } from "../utils";

const underConstruction = false;
const Create: NextPage = () => {
  const { address } = useAccount();
  const uploadForm = useUploadForm();

  const handleCreateClick = () => {
    if (address) {
      const form = {
        owner: address,
        title: "「匿名回答アンケート」についての調査",
        unixTime: getCurrentUnixTime(),
        questions: [
          {
            label:
              "匿名回答の社内・プロジェクト内アンケートに回答したことはありますか？",
            type: "select",
            options: ["はい", "いいえ"],
            customerAttributes: []
          },
          {
            label:
              "上記で「はい」と回答された方：それは、何に関するアンケートでしたか？",
            type: "text",
            customerAttributes: []
          },
          {
            label:
              "「匿名で回答ができる」という要素は、どのような場面で重要だと思いますか？",
            type: "text",
            customerAttributes: []
          }
        ]
      };

      uploadForm(form);
    }
  };

  // TODO: Check if wallet is connected or not
  return underConstruction ? (
    <Center>
      <Heading>under construction...</Heading>
    </Center>
  ) : (
    <>
      <Button onClick={handleCreateClick}></Button>
    </>
  );
};

export default Create;
