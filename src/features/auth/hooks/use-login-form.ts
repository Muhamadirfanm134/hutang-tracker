"use client";

import { useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { FormLoginType } from "../schema";

export default function useLoginForm() {
  const { login, register, isLoading } = useAuth();

  const form = useForm<FormLoginType>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data: FormLoginType) => {
    login({ email: data.email, password: data.password });
  });

  const onRegister = handleSubmit(async (data: FormLoginType) => {
    console.log(data);
    register({
      fullname: data.fullname ?? "",
      email: data.email,
      password: data.password,
    });
  });

  return {
    onSubmit,
    onRegister,
    form,
    loading: isLoading,
  };
}
