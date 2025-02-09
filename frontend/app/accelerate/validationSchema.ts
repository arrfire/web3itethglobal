import { 
  emailRegex,
  usernameRegex,
} from '@/common/constants';
import * as Yup from 'yup';

export const twitterAuthSchema = Yup.object().shape({
  username: Yup.string().required("Please provide a valid username").matches(usernameRegex, "Please provide a valid username").trim(),
  password: Yup.string().required("Please provide a valid password").min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters"),
  email: Yup.string()
    .required("Please provide a valid email")
    .matches(emailRegex, "Please provide a valid email")
    .email("Please provide a valid email")
    .max(100, "Email cannot exceed 100 characters"),
});


export const characterSchema = Yup.object().shape({
  systemFrontend: Yup.string().required("Please provide instruction for the agent"),
  twitterQuery: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide query for the scraper"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a valid list")
    .required(),
  bio: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide bio"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a valid list")
    .required(),
  adjectives: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide adjectives"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide an adjective")
    .required(),
  lore: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide your lore"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a lore")
    .required(),
  postExamples: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide a post example"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide an example")
    .required(),
  topics: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide a topic"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a topic")
    .required(),
  styleAll: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide a style"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a style")
    .required(),
  styleChat: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide a style"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a style")
    .required(),
  stylePost: Yup.array().required()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Please provide a style"),
        id: Yup.string().required("Please provide a valid id"),
      }),
    )
    .min(1, "Please provide a style")
    .required(),
  messageExampleOneUser: Yup.string().required("Please provide a message example"),
  messageExampleOneAgent: Yup.string().required("Please provide a message example"),
  messageExampleTwoUser: Yup.string().required("Please provide a message example"),
  messageExampleTwoAgent: Yup.string().required("Please provide a message example"),
});