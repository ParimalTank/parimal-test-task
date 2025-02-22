'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession(); // Destructure for clarity
  console.log('session: ', session);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login/?callbackUrl=/");
    }
  }, [status, router]);  // Add dependencies to useEffect

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* {session && (
        <p className="text-4xl font-semibold">Hi {session.user?.name}!</p>
      )} */}
      {session && (
        <>
          <p className="text-4xl font-semibold">Hi {session.user?.name}!</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
