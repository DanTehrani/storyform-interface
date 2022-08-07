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
import { getEtherscanUrl, getTxArweaveExplorerUrl } from "../utils";
import { TEMPORARY_ADMIN_ADDRESS } from "../config";

const Forms: NextPage = () => {
  const { address } = useAccount();
  const { pagination } = usePagination({
    first: 20,
    after: ""
  });
  const forms = useForms(pagination);

  if (!forms) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const handleAnswerClick = (formId: string) => {
    window.open(`/forms/${formId}`);
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
                  {address === TEMPORARY_ADMIN_ADDRESS ? (
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
                  <Button
                    onClick={() => {
                      handleAnswerClick(form.id);
                    }}
                  >
                    回答する
                  </Button>
                </Td>
                <Td>
                  <Link
                    href={`forms/${form.id}/submissions`}
                    isExternal
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
