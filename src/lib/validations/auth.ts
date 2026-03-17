import * as yup from "yup";

export const signUpSchema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Business email is required")
    .email("Please enter a valid email address"),
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;
