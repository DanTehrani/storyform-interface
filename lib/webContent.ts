import axios from "./axios";

export const getWebsiteTitle = async (url: string): Promise<string> => {
  const res = await axios
    .get("/cross-origin", {
      params: {
        url: encodeURIComponent(url)
      }
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  const result = res?.data?.match(/<title[^>]*>(.*?)<\/title>/g);

  if (!result?.length) {
    return "";
  }

  const title = result[0]
    .replace(new RegExp(/<title[^>]*>/g), "")
    .replace(new RegExp(/<\/title>/g), "");

  return title;
};
