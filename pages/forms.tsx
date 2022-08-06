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
import { ExternalLinkIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { useForms, usePagination, useGetEtherscanUrl } from "../hooks";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import { getTxArweaveExplorerUrl } from "../utils";

const Forms: NextPage = () => {
  const getEtherscanUrl = useGetEtherscanUrl();
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
              <Th>タイトル</Th>
              <Th>回答する</Th>
              <Th>回答一覧</Th>
              <Th>作成者</Th>
              <Th>Arweave</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form, i) => (
              <Tr key={i}>
                <Td>{form.title}</Td>
                <Td textAlign={"left"}>
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
                    回答を見る
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
