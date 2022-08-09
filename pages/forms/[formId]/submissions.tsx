import { useState } from "react";
import {
  Text,
  Link,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Icon
} from "@chakra-ui/react";
import { CheckCircleIcon, MinusIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForm, useSubmissions } from "../../../hooks";
import IndexPageSkeleton from "../../../components/IndexPageSkeleton";
import { useRouter } from "next/router";
import {
  getEtherscanLogPageUrl,
  getTxArweaveExplorerUrl
} from "../../../utils";
import useTranslation from "next-translate/useTranslation";

const Submission: NextPage = () => {
  const { t } = useTranslation("form-submissions");
  const { query } = useRouter();
  const [first, setFirst] = useState<number>(10);
  const [after, setAfter] = useState<string | undefined>();

  const formId = query?.formId?.toString();
  const { form, formNotFound } = useForm(formId);

  const submissions = useSubmissions(formId, {
    first,
    after
  });

  if (formNotFound) {
    return <Text>Form not found</Text>;
  }

  if (!form || !submissions) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const questions = form.questions;

  return (
    <>
      <TableContainer mt={5}>
        <Table variant="simple">
          {!submissions.length ? (
            <TableCaption>{t("no-submissions")}</TableCaption>
          ) : (
            <></>
          )}
          <TableCaption>{form.title}</TableCaption>

          <Thead>
            <Tr>
              {questions.map((question, i) => (
                <Th key={i}>{question.label}</Th>
              ))}
              <Th>{t("credibility")}</Th>
              <Th>Arweave</Th>
              <Th>{t("zk-verification-log")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {submissions.map((submission, i) => (
              <Tr key={i}>
                {Array(questions.length)
                  .fill(0)
                  .map((_, i) => (
                    // eslint-disable-next-line security/detect-object-injection
                    <Td key={i}>{submission.answers[i] || ""}</Td>
                  ))}
                <Td textAlign="center">
                  {submission.verificationTx ? (
                    <Icon as={CheckCircleIcon} color="green"></Icon>
                  ) : (
                    <Icon as={MinusIcon} color="green"></Icon>
                  )}
                </Td>
                <Td>
                  <Link
                    href={getTxArweaveExplorerUrl(submission.txId)}
                    isExternal
                    textDecoration="underline"
                  >
                    Arweave
                    <ExternalLinkIcon mx="1px" mt="-1px" />
                  </Link>
                  &nbsp; {submission.arweaveTxStatus === 202 ? "(Pending)" : ""}
                </Td>

                <Td>
                  <Link
                    href={getEtherscanLogPageUrl(submission.verificationTx)}
                    isExternal
                    textDecoration="underline"
                  >
                    {t("zk-verification-log")}
                    <ExternalLinkIcon mx="1px" mt="-1px" />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Submission;
