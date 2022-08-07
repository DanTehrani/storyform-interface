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
import { useForms, usePagination } from "../hooks";
import { useAccount } from "wagmi";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import {
  eligibleToAnswer,
  getEtherscanUrl,
  getTxArweaveExplorerUrl
} from "../utils";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useRouter } from "next/router";

const Forms: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { pagination } = usePagination({
    first: 20,
    after: ""
  });
  const forms = useForms(pagination);
  const router = useRouter();

  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

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
              <Th textAlign="left">タイトル</Th>
              <Th>回答する</Th>
              <Th>回答一覧</Th>
              <Th>作成者</Th>
              <Th>Arweave</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form, i) => (
              <Tr key={i}>
                <Td textAlign="center">
                  {address && eligibleToAnswer(address, form.id) ? (
                    <>
                      回答できます
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
                        ? "回答できません"
                        : "回答する"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        connect();
                      }}
                    >
                      回答権を確認
                    </Button>
                  )}
                </Td>
                <Td>
                  <Link
                    href={`forms/${form.id}/submissions`}
                    textDecoration="underline"
                  >
                    回答一覧を見る
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
