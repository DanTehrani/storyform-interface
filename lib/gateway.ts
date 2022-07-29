import axios from "./axios";
import { FormSubmission } from "../types";

export const submitAnswer = async (submission: FormSubmission) => {
  const res = await axios.post(`/answers`, submission);
};
