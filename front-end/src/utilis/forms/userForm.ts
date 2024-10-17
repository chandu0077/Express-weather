import * as yup from "yup";

export const userForm = yup.object().shape({
  _id: yup.string().trim().notRequired(),
  name: yup.string().trim().min(3).max(10).required(),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email.")
    .required("This field can't be empty."),
  password: yup.string().trim().min(8, "Password is too short").required(),
});
