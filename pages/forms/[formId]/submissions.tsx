import { useState } from "react";
import {
  Stack,
  Container,
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
  Icon,
  Box,
  AccordionPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  Center,
  AccordionIcon,
  Heading,
  ButtonGroup,
  IconButton
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon
} from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForm, useSubmissions } from "../../../hooks";
import FormsPageSkeleton from "../../../components/FormsPageSkeleton";
import { useRouter } from "next/router";
import {
  getEtherscanLogPageUrl,
  getTxArweaveExplorerUrl
} from "../../../utils";
import useTranslation from "next-translate/useTranslation";

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

  const onNextPageClick = () => {
    // TODO: Implement this
  };

  const onPreviousClick = () => {
    // TODO: Implement this
  };

  if (formNotFound) {
    return <Text>Form not found</Text>;
  }

  if (!form || !submissions) {
    return <FormsPageSkeleton></FormsPageSkeleton>;
  }

  const questions = form.questions;
  const settings = form.settings;

  return (
    <Box p={10}>
      <Center>
        <Heading mt={6}>{form.title}</Heading>
      </Center>
      <TableContainer mt={6}>
        <Table variant="simple">
          {!submissions.length ? (
            <TableCaption>{t("no-submissions")}</TableCaption>
          ) : (
            <></>
          )}
          <Thead>
            <Tr>
              {questions.map((question, i) => (
                <Th key={i}>{question.label}</Th>
              ))}
              <Th>Arweave</Th>
              {settings.respondentCriteria === "ERC721" ? (
                <Th>{t("zk-verification-log")}</Th>
              ) : (
                <></>
              )}
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

                {submission.verificationTx ? (
                  <Td textAlign="center">
                    <Icon as={CheckCircleIcon} color="green"></Icon>
                  </Td>
                ) : (
                  <></>
                )}
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
                {submission.verificationTx ? (
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
                ) : (
                  <></>
                )}
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
            ></IconButton>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="next-page"
              icon={<ChevronRightIcon></ChevronRightIcon>}
              onClick={onNextPageClick}
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
