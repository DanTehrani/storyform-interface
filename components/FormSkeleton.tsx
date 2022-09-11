import { Stack, Skeleton, SkeletonText, Spacer } from "@chakra-ui/react";

const StyledSkeleton = () => (
  <Skeleton width={[300, 640]} height="70px"></Skeleton>
);
const StyledSkeletonText = () => (
  <SkeletonText width={[300, 640]}></SkeletonText>
);

const FormSkeleton = () => {
  return (
    <Stack width="100%" textAlign="center" mt={4} alignItems="center">
      <StyledSkeletonText></StyledSkeletonText>
      <StyledSkeletonText></StyledSkeletonText>
      <Spacer></Spacer>
      <StyledSkeleton />
      <StyledSkeleton />
      <StyledSkeleton />
      <StyledSkeleton />
    </Stack>
  );
};

export default FormSkeleton;
