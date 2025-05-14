import * as yup from "yup";
export const registrationFormSchema = yup.object({
    fullname: yup
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(25, "Max 25 character are allowed")
    .required("Full name is required"),

    age: yup
    .number()
    .typeError("Age must be a number")
    .min(1, "Age must be at least 1")
    .max(120, "Age seems too high")
    .required("Age is required"),

    contact: yup
    .string()
    .matches(/^\d{10}$/, "Contact must be a 10-digit number")
    .required("Contact number is required"),

    disease: yup.string().trim().required("Disease is required"),

    gender: yup.string().oneOf(["male", "female", "other"], "Gender is required").required("Gender is required"),
});
