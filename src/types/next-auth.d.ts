import 'next-auth'

/*
    // Package to aware of new datatype
    // here we need to import package
    // making aware to full package that changing datatype
    //cannot directly make chnage to interfate
*/

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}

//other way to declare interface with new custom fields

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}