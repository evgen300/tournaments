'use server'

/*import { connectDB } from "@/lib/mongodb";
import UserSchema from "@/models/schemas/UserSchema";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions  = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await UserSchema.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("Wrong Email");

        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!passwordMatch) throw new Error("Wrong Password");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  }
};*/
import dbConnect from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import NextAuth from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse} from "next-auth/jwt";

import UserSchema from "@/models/schemas/UserSchema";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
    strategy: 'jwt',
    // Session maxAge in seconds. Defaults to 30 days.
    maxAge: 60 * 60 * 24 * 30, // 12 hours
    
    // How often the session should be updated in seconds.
    // If a user is active, their session expiry will be extended by this amount.
    // Set to 0 to disable session rolling.
    updateAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      //id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials === null) return null;
        
        try {
          const user = await UserSchema.findOne({
            email: credentials?.email
          });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              throw new Error("email_or_password");
            }
          } else {
            throw new Error("user_not_found");
          }
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      }
    })
  ],
  callbacks: {
    async jwt(params) {
      const { token, user, account, isNewUser, trigger, session } = params;
      if (user) {
        token.uid = user.id;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
      }
      if (token.uid) {
        const userDb = await UserSchema.findOne({ _id: token.uid });
        token.lang = userDb.lang;
      }
      return Promise.resolve(token);
    },
    async session({ session, token, trigger }) {
      session.user.id = token.sub;
      if (token.lang) {
        session.user.lang = token.lang;
      }
      //console.log("SET ID", session.user.id);
      //console.log(session);
      return Promise.resolve(session);
    },
    /*async redirect({ url, baseUrl }) {
      console.log("REDIRECT", url, baseUrl);
      return baseUrl;
    }*/
  },

  events: {
    async updateUser(message) {
      console.log("UPDATE event", message);
    }
  },

  pages1: {
    signIn: "/tournaments"
  }
}

export const getSession = async function (req, res) {
  try {
    const options = authOptions;
    let session = await getServerSession(req, res, options);
    if (session && session.user && session.user.id) {
      let user = await UserSchema.findOne({ _id: session.user.id });
      session.user.role = user.role;
    }
    return session;
  } catch(e) {
    console.log(e);
    console.log(e.message, e.stack);
    return {};
  }
  // return await getServerSession(...[
  //   [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
  //   | [NextApiRequest, NextApiResponse]
  //   | []], authOptions);
}