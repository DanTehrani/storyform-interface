import { Center, Image, Text } from "@chakra-ui/react";

const IMG_RATIO = 1.46007604563;
const IMG_HEIGHT = [200, 350];
const IMG_WIDTH = IMG_HEIGHT.map(h => h * IMG_RATIO);

const FormNotFoundOrUploading = () => (
  <Center height="80vh" alignItems="center" flexDirection="column">
    <Text fontSize="xl">
      The form is undergoing an update, or it does not exist
    </Text>
    <Image
      mt={5}
      alt="form-not-found-or-updating"
      height={IMG_HEIGHT}
      width={IMG_WIDTH}
      src="/eth-brand-asset-1.png"
    ></Image>
  </Center>
);

export default FormNotFoundOrUploading;
