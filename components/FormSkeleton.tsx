import { Stack, Skeleton, SkeletonText, Spacer } from "@chakra-ui/react";

const FormSkeleton = () => {
  return (
    <Stack width="100%" textAlign="center" mt={4} alignItems="center">
      <SkeletonText width={640}></SkeletonText>
      <SkeletonText width={640}></SkeletonText>
      <Spacer></Spacer>
      <Skeleton width={640} height="70px" />
      <Skeleton width={640} height="70px" />
      <Skeleton width={640} height="70px" />
      <Skeleton width={640} height="70px" />
      <Skeleton width={640} height="70px" />
    </Stack>
  );
};

export default FormSkeleton;
