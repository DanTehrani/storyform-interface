import {
  Link,
  TableContainer,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Button
} from "@chakra-ui/react";
import { ExternalLinkIcon, CheckIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForms, usePagination, useConnectWallet } from "../hooks";
import { useAccount } from "wagmi";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import {
  eligibleToAnswer,
  getEtherscanUrl,
  getTxArweaveExplorerUrl
} from "../utils";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const Forms: NextPage = () => {
  const { t } = useTranslation("forms");
  const { address, isConnected } = useAccount();
  const { pagination } = usePagination({
    first: 20,
    after: ""
  });
  const forms = useForms(pagination);
  const router = useRouter();
  const connect = useConnectWallet();

  if (!forms) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const handleAnswerClick = (formId: string) => {
    router.push(`/forms/${formId}`);
  };

  return (
    <>
      <TableContainer mt={5}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th textAlign="left">{t("title")}</Th>
              <Th>{t("answer")}</Th>
              <Th>{t("answers")}</Th>
              <Th>{t("creator")}</Th>
              <Th>Arweave</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form, i) => (
              <Tr key={i}>
                <Td textAlign="center">
                  {address && eligibleToAnswer(address, form.id) ? (
                    <>
                      {t("can-answer")}
                      <CheckIcon color="purple" mx="1px" mt="-1px"></CheckIcon>
                    </>
                  ) : (
                    <></>
                  )}
                </Td>
                <Td textAlign="left">{form.title}</Td>
                <Td>
                  {isConnected ? (
                    <Button
                      onClick={() => {
                        handleAnswerClick(form.id);
                      }}
                      isDisabled={
                        !address || !eligibleToAnswer(address || "", form.id)
                      }
                    >
                      {!address || !eligibleToAnswer(address || "", form.id)
                        ? t("cannot-answer")
                        : t("answer")}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        connect();
                      }}
                    >
                      {t("login-and-answer")}
                    </Button>
                  )}
                </Td>
                <Td>
                  <Link
                    href={`forms/${form.id}/submissions`}
                    textDecoration="underline"
                  >
                    {t("view-answers")}
                  </Link>
                </Td>
                <Td>
                  <Link
                    href={getEtherscanUrl(form.owner)}
                    textDecoration="underline"
                    isExternal
                  >
                    {form.owner}
                  </Link>
                </Td>
                <Td>
                  <Link
                    href={getTxArweaveExplorerUrl(form.arweaveTxId)}
                    textDecoration="underline"
                    isExternal
                  >
                    Arweave
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

export default Forms;
