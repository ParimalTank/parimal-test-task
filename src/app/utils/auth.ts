import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./dbConnect";
import clientPromise from "./clientPromise";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // adapter: (async () => {
  //   const { MongoDBAdapter } = await import("@next-auth/mongodb-adapter");
  //   const clientPromise = (await import("../utils/clientPromise")).default;
  //   return MongoDBAdapter(clientPromise);
  // })(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await dbConnect();
        // Add logic here to look up the user from the credentials supplied
        if (credentials == null) return null;
        // login

        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (isMatch) {
              return user;
            }
            else {
              throw new Error("Email or password is incorrect");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/",
    error: "/login",
  },
  callbacks: {
    // We can pass in additional information from the user document MongoDB returns
    async jwt({ token, user }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Redirect to the home page after successful login
      if (url.startsWith(baseUrl)) {
        return Promise.resolve(baseUrl);
      }
      // Allow relative URLs
      if (url.startsWith("/")) {
        return Promise.resolve(`${baseUrl}${url}`);
      }
      return Promise.resolve(baseUrl);
    },
  },
};

export default NextAuth(authOptions);
