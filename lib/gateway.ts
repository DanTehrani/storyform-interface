import axios from "./axios";

export const ConstructSubmissionArweaveTransaction = async submission => {
  const res = await axios.post(`/answers`, submission);
};
