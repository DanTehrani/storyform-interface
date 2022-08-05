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
import { CheckCircleIcon, MinusIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForm, useSubmissions } from "../../../hooks";
import IndexPageSkeleton from "../../../components/IndexPageSkeleton";
import { useRouter } from "next/router";
import {
  getEtherscanLogPageUrl,
  getTxArweaveExplorerUrl,
  getShortenId
} from "../../../utils";

const Submission: NextPage = () => {
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
      <TableContainer>
        <Table variant="simple">
          {!submissions.length ? (
            <TableCaption>回答はありません</TableCaption>
          ) : (
            <></>
          )}
          <TableCaption>{form.title}</TableCaption>

          <Thead>
            <Tr>
              {questions.map((question, i) => (
                <Th key={i}>{question.label}</Th>
              ))}
              <Th>ID</Th>
              <Th>Verified</Th>
              <Th>Verification Log</Th>
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
                <Td>
                  <Link
                    href={getTxArweaveExplorerUrl(submission.txId)}
                    isExternal
                    textDecoration="underline"
                  >
                    {getShortenId(submission.txId)}
                  </Link>
                  &nbsp; ({submission.arweaveTxStatus === 202 ? "Pending" : ""})
                </Td>
                <Td textAlign="center">
                  {submission.verificationTx ? (
                    <Icon as={CheckCircleIcon} color="green"></Icon>
                  ) : (
                    <Icon as={MinusIcon} color="green"></Icon>
                  )}
                </Td>
                <Td>
                  <Link
                    href={getEtherscanLogPageUrl(
                      submission.verificationTx,
                      "goerli"
                    )}
                    isExternal
                    textDecoration="underline"
                  >
                    {getShortenId(submission.verificationTx)}
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
