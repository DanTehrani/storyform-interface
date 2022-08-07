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
        title: "率直な回答のみ！新型コロナウイルスと自粛についての調査",
        unixTime: getCurrentUnixTime(),
        questions: [
          {
            label:
              "緊急事態宣言、又は、まん延防止等重点措置発令中に、外出を自粛していますか？",
            type: "select",
            options: [
              "可能な限りしている",
              "何となくしている",
              "全くしていない",
              "わからない"
            ],
            customerAttributes: []
          },
          {
            label: "新型コロナウイルスに感染したことがありますか？",
            type: "select",
            options: ["はい", "いいえ", "わからない"],
            customerAttributes: []
          },
          {
            label: "濃厚接触者となったことがありますか？",
            type: "select",
            options: ["はい", "いいえ", "わからない"],
            customerAttributes: []
          },
          {
            label: "何度ワクチン接種されましたか？",
            type: "select",
            options: ["0回", "1回", "2回", "3回", "4回", "5回以上"],
            customerAttributes: []
          },
          {
            label: "該当する年齢層を教えてください",
            type: "select",
            options: ["0~20歳", "21~40歳", "41~60歳", "61歳~80歳", "81歳以上"],
            customerAttributes: []
          }
        ]
      };

      uploadForm(form);
    }
  };

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
