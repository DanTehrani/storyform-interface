import {
  Link,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Td
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { getSubmissions } from "../../../state/formAnswersSlice";
import { getForm } from "../../../state/formSlice";
import { useEffect } from "react";
import IndexPageSkeleton from "../../../components/IndexPageSkeleton";
import { useRouter } from "next/router";

const getShortenId = (id: string) => `${id.slice(0, 3)}...${id.slice(6, 9)}`;

const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

const Submission: NextPage = () => {
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const gettingSubmissions = useAppSelector(
    state => state.formAnswers.gettingSubmissions
  );
  const submissions = useAppSelector(
    state => state.formAnswers.fetchedSubmission
  );
  const form = useAppSelector(state => state.form.form);
  const questions = form.questions;

  useEffect(() => {
    if (getSubmissions) {
      dispatch(
        getSubmissions({
          first: 10
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (getForm && query.formId) {
      dispatch(
        getForm({
          formId: query.formId.toString()
        })
      );
    }
  }, [dispatch, query.formId]);

  if (gettingSubmissions) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

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
