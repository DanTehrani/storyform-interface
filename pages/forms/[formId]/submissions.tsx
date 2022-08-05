import { useState } from "react";
import {
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
import { CheckCircleIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForm, useSubmissions } from "../../../hooks";
import IndexPageSkeleton from "../../../components/IndexPageSkeleton";
import { useRouter } from "next/router";

const getShortenId = (id: string) => `${id.slice(0, 3)}...${id.slice(6, 9)}`;

const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

const etherscanLogPageUrl = (txId: string) =>
  `https://etherscan.io/tx/${txId}#eventlog`;

const Submission: NextPage = () => {
  const { query } = useRouter();
  const [first, setFirst] = useState<number>(10);
  const [after, setAfter] = useState<string | undefined>();

  const formId = query?.formId?.toString();
  const form = useForm(formId);

  const submissions = useSubmissions(formId, {
    first,
    after
  });

  if (!form || !submissions) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const questions = form.questions;

  return (
    <>
      <TableContainer>
        <Table variant="simple">
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
                  <Icon as={CheckCircleIcon} color="green"></Icon>
                </Td>
                <Td>{submission.verificationTx}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Submission;
