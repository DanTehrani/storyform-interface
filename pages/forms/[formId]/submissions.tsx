import {
  Stack,
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
  Box,
  Center,
  Heading,
  ButtonGroup,
  IconButton,
  CircularProgress,
  Spinner
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  MinusIcon
} from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForm, useSubmissions } from "../../../hooks";
import FormsPageSkeleton from "../../../components/FormsPageSkeleton";
import { useRouter } from "next/router";
import { getTxArweaveExplorerUrl } from "../../../utils";
import { ProofVerificationStatus } from "../../../types";

const StyledBox = props => {
  return (
    <Box
      padding="24px"
      borderWidth={1}
      borderRadius={10}
      mb={3}
      bgColor="white"
      borderColor="lightgrey"
      {...props}
    >
      {props.children}
    </Box>
  );
};

const Line = () => <hr style={{ paddingTop: "10px", width: "100%" }}></hr>;

const Submission: NextPage = () => {
  const { query } = useRouter();

  const formId = query?.formId?.toString();
  const { form, formNotFound } = useForm(formId);

  const { submissions, getNext, getPrevious, hasNextPage, hasPreviousPage } =
    useSubmissions(formId);

  const onNextPageClick = () => {
    getNext();
  };

  const onPreviousClick = () => {
    getPrevious();
  };

  if (formNotFound) {
    return <Text>Form not found</Text>;
  }

  if (!form || !submissions) {
    return <FormsPageSkeleton></FormsPageSkeleton>;
  }

  const questions = form.questions;

  // TODO: Only show verification status for forms with verification enabled
  return (
    <Box p={10}>
      <Center>
        <Heading mt={6}>{form.title}</Heading>
      </Center>
      <TableContainer mt={6}>
        <Table variant="simple">
          {!submissions.length ? (
            <TableCaption>No submissions</TableCaption>
          ) : (
            <></>
          )}
          <Thead>
            <Tr>
              {questions.map((question, i) => (
                <Th key={i}>{question.label}</Th>
              ))}
              <Th>Arweave</Th>
              <Th>Verified</Th>
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
                    Arweave
                    <ExternalLinkIcon mx="1px" mt="-1px" />
                  </Link>
                </Td>
                <Td>
                  {submission.proofsVerified ===
                  ProofVerificationStatus.Verified ? (
                    <CheckCircleIcon color="purple.300"></CheckCircleIcon>
                  ) : submission.proofsVerified ===
                    ProofVerificationStatus.Nonexistent ? (
                    <MinusIcon></MinusIcon>
                  ) : (
                    <CircularProgress
                      size={4}
                      color="purple.300"
                      isIndeterminate
                    ></CircularProgress>
                  )}
                </Td>
                <Td>
                  <Link
                    href={`/user/submissions/${submission.txId}`}
                    isExternal
                  >
                    Details
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box textAlign="right" pr={4}>
          <ButtonGroup mt={1}>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="previous-page"
              icon={<ChevronLeftIcon></ChevronLeftIcon>}
              onClick={onPreviousClick}
              isDisabled={!hasPreviousPage}
            ></IconButton>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="next-page"
              icon={<ChevronRightIcon></ChevronRightIcon>}
              onClick={onNextPageClick}
              isDisabled={!hasNextPage}
            ></IconButton>
          </ButtonGroup>
        </Box>
      </TableContainer>
      <StyledBox mt={8}>
        <Stack>
          <Text>Description</Text>
          <Text>{form.description}</Text>
          <Line></Line>
          <Text>Surveyor</Text>
          <Text>{form.owner}</Text>
          <Line></Line>
          <Text>Arweave</Text>
          <Text>
            <Link
              isExternal
              href={getTxArweaveExplorerUrl(form.arweaveTxId)}
              textDecor="underline"
            >
              {form.arweaveTxId}
            </Link>
          </Text>
          <Line></Line>
        </Stack>
      </StyledBox>
    </Box>
  );
};

export default Submission;
