import { z } from "zod";

//because single thing to check
export const usernamevalidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

//b'coz multiple things to check so object
export const signUpSchema = z.object ({
    username: usernamevalidation,
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(6, {message:'Password must be atleast 6 characters'})
})