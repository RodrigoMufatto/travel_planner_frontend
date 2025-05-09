"use client";

import { ReactQueryProvider } from "@/app/react-query-provider";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function AppProvider({
 children
}: PropsWithChildren ) {
    return (
        <SessionProvider>
            <ReactQueryProvider>
                {children}
            </ReactQueryProvider>
        </SessionProvider>
    )
} 