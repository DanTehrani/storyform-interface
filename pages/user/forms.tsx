import {
  Container,
  Link,
  Box,
  Heading,
  Center,
  Grid,
  GridItem
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useUserForms, usePagination } from "../../hooks";
import { useAccount } from "wagmi";
import FormsPageSkeleton from "../../components/FormsPageSkeleton";
import ConnectWalletButton from "../../components/ConnectWalletButton";

const UserFormsHeading = () => <Heading m={4}>Your forms</Heading>;

const UserForms: NextPage = () => {
  const { address } = useAccount();
  const { pagination } = usePagination({
    first: 20,
    after: ""
  });
  const forms = useUserForms(pagination);

  if (!address) {
    return (
      <Container maxW={[700]}>
        <Center mt={4} flexDirection="column">
          <UserFormsHeading></UserFormsHeading>
          <Box mt={4}>
            <ConnectWalletButton></ConnectWalletButton>
          </Box>
        </Center>
      </Container>
    );
  }

  if (!forms) {
    return <FormsPageSkeleton></FormsPageSkeleton>;
  }

  return (
    <Container maxW={[700]}>
      <UserFormsHeading></UserFormsHeading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {forms.map((form, i) => (
          <GridItem key={i}>
            <Link
              href={`/user/forms/${form.id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                p={5}
                height={[170]}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
              >
                <Heading fontSize="xl">{form.title}</Heading>
              </Box>
            </Link>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default UserForms;
