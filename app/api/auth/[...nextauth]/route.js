import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from "next-auth/react";

import { connectToDB } from "@utils/database";
import User from "@models/user";

// console.log({
//             clientId: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// })

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({ email: session.user.email });

            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                // Check if user already exists
                const userExists = await User.findOne({ email: profile.email });

                if (!userExists) {
                    // Generate a valid username
                    let username = profile.name
                        .replace(/\s+/g, "")  // Remove spaces
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "") // Keep only alphanumeric characters
                        .slice(0, 20); // Ensure max 20 chars

                    // Ensure username is at least 8 characters long
                    if (username.length < 8) {
                        username = `user${Math.floor(1000 + Math.random() * 9000)}`;
                    }

                    // Creates the user
                    await User.create({
                        email: profile.email,
                        username,
                        image: profile.picture
                    });
                }

                return true;
            } catch (error) {
                console.log("Sign-in error:", error);
                return false;
            }
        }
    }
});

export { handler as GET, handler as POST };
