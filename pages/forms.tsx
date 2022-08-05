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
import { useForms, usePagination } from "../hooks";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
const getShortenId = (id: string) => `${id.slice(0, 3)}...${id.slice(6, 9)}`;

const Forms: NextPage = () => {
  const { pagination } = usePagination({
    first: 20,
    after: ""
  });
  const forms = useForms(pagination);

  if (!forms) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Forms</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Submissions</Th>
              <Th>Owner</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form, i) => (
              <Tr key={i}>
                <Td>{getShortenId(form.id)}</Td>
                <Td>{form.title}</Td>
                <Td>
                  <Link
                    href={`forms/${form.id}/submissions`}
                    isExternal
                    textDecoration="underline"
                  >
                    View submissions
                  </Link>
                </Td>
                <Td>{form.owner}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Forms;
