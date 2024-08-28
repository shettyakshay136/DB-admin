import { date, number, string } from "yup";

const stringValidation = string().trim();

const numberValidation = number();

const dateValidation = date();

const emailValidation = stringValidation
    .required("Please enter email")
    .email("Invalid email")
    .matches(/@[^.]*\./, "Invalid email");

const integerValidation = numberValidation.integer("Number should be valid integer").typeError("Please enter valid number");

export { stringValidation, numberValidation, dateValidation, emailValidation, integerValidation };
