"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
 const { data: session } = useSession();
  if (session) {
   return (
     <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
       Déconnexion de LinkedIn
     </button>
   );
 }
 return (
   <button onClick={() => signIn("linkedin")} className="bg-blue-600 text-white p-2 rounded">
     Se connecter avec LinkedIn
   </button>
 );
}