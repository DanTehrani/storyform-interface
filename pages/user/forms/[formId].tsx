import { useState } from "react";
import type { NextPage } from "next";
import {
  Link,
  AlertIcon,
  Alert,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text,
  Select,
  Center,
  Container,
  ButtonGroup,
  useToast
} from "@chakra-ui/react";
import {
  useGroup,
  useForm,
  useSubmitForm,
  useGenerateProof
} from "../../../hooks";
import FormNotFound from "../../../components/FormNotFound";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import useTranslation from "next-translate/useTranslation";
import FormSkeleton from "../../../components/FormSkeleton";
import FormEditor from "../../../components/FormEditor";
import { Form } from "../../../types";

const ManageForm: NextPage = () => {
  const { query } = useRouter();
  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);

  const handleSaveClick = (updatedForm: Form) => {
    // TBD
    // Need to come up with a form update scheme
  };

  if (formNotFound) {
    return <FormNotFound></FormNotFound>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  return (
    <FormEditor
      form={form}
      onSave={handleSaveClick}
      saveButtonLabel="保存"
    ></FormEditor>
  );
};

export default ManageForm;
