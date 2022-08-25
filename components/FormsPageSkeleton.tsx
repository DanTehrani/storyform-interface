import { Stack, Skeleton } from "@chakra-ui/react";

const FormsPageSkeleton = () => (
  <Stack mt={6}>
    <Skeleton height="40px" />
    <Skeleton height="40px" />
    <Skeleton height="40px" />
  </Stack>
);

export default FormsPageSkeleton;
