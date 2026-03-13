import * as yup from "yup";

export const emailSchema = yup.string().email("Invalid email address");

export const paginationSchema = yup.object({
  cursor: yup.string().optional(),
  limit: yup.number().integer().min(1).max(100).default(25),
});
