import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { REPL_MODE_SLOPPY } from "repl";

//to write API
//connect with database so async

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        } else {
            const existingUserByEmail = await UserModel.findOne({email})

            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

            if(existingUserByEmail) {
                if(existingUserByEmail.isVerified) {
                    return Response.json({
                        success: false, 
                        message: "User already exit with this email"
                   }, {status: 400})
                } else {
                    const hashedPassword = await bcrypt.hash(password,10)
                    //same password will be updated with new fed password by user
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) //360000 added 1 hour
                    await existingUserByEmail.save()
                }
            } else {
                //register new user, encrypt password and store in table
                const hashedPassword = await bcrypt.hash(password,10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)

                //save value in Db
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode, 
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
                })

                await newUser.save();
            }

            //send verification email
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            )

            if(!emailResponse.success) {
                return Response.json({
                     success: false, 
                     message: emailResponse.message
                }, {status: 500})
            }

            return Response.json({
                success: true, //coz email chala gaya
                message: "User registered successfully. Please verify your email"
            }, {status: 201})
        }
    } catch(error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false ,
            message: "Error registering user"
        },
        {status: 500}
      )
    }
}