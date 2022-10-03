import type { NextPage } from "next";
import {
  Text,
  Center,
  Container,
  VStack,
  Box,
  CircularProgress,
  Input,
  Heading,
  Link,
  Flex,
  Stack,
  Skeleton
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useForm, useSubmission } from "../../../../hooks";
import { ProofVerificationStatus } from "../../../../types";
import { getShortenId, getTxArweaveExplorerUrl } from "../../../../utils";

// Get user submissions from Arweave.
const UserSubmission: NextPage = () => {
  const { query } = useRouter();

  // Submission Arweave Tx id
  const submissionTxId = query.submissionId?.toString() as string;
  const formId = query.formId?.toString() as string;
  const { submission } = useSubmission(submissionTxId);
  const { form } = useForm(formId);

  return (
    <Center width="100%" display={"flex"} flexDirection="column" p={6}>
      <Container maxW="container.xl">
        <Box>
          <Heading size="lg" as="i">
            Submission &nbsp;
            <Link
              href={getTxArweaveExplorerUrl(submissionTxId)}
              textDecor="underline"
              isExternal
            >
              {getShortenId(submissionTxId || "")}
            </Link>
          </Heading>
          <br />
          <Text as="sub">
            of form &nbsp;
            <Link href={`/forms/${formId}`} textDecor="underline" isExternal>
              {getShortenId(formId || "")}
            </Link>
          </Text>
        </Box>
        <Box mt={4}>
          {!submission ||
          submission.proofsVerified === ProofVerificationStatus.Verifying ? (
            <CircularProgress
              size={4}
              color="purple.300"
              isIndeterminate
            ></CircularProgress>
          ) : submission.proofsVerified === ProofVerificationStatus.Verified ? (
            <>
              <Box>
                <CheckCircleIcon color="purple.300"></CheckCircleIcon>
                <Text>Respondent membership verified</Text>
              </Box>
              <Text>Member of group xxx</Text>
            </>
          ) : submission.proofsVerified ===
            ProofVerificationStatus.Nonexistent ? (
            <>
              <Flex alignItems="center">
                <Text>Respondent membership verified</Text>
                &nbsp;
                <CheckCircleIcon color="purple.300"></CheckCircleIcon>
              </Flex>
              <Text>Member of xxx</Text>
            </>
          ) : (
            <Text>Couldn&apos;t verify respondent membership 🙄</Text>
          )}
        </Box>

        <VStack spacing={4} align="stretch" mt={4}>
          {!form || !submission ? (
            <Stack>
              <Skeleton height="60px"></Skeleton>
              <Skeleton height="60px"></Skeleton>
              <Skeleton height="60px"></Skeleton>
            </Stack>
          ) : (
            form.questions.map((question, i) => (
              <Box key={i}>
                <Text as="b" fontSize="xl">
                  {question.label}
                </Text>
                <Input
                  readOnly
                  variant="flushed"
                  // eslint-disable-next-line security/detect-object-injection
                  value={submission.answers[i]}
                />
              </Box>
            ))
          )}
        </VStack>
      </Container>
    </Center>
  );
};

export default UserSubmission;
