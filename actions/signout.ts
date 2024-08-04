'use server'

import { createServer } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export const logout = async () => {

   const supabase = createServer();

   await supabase.auth.signOut();

   redirect("/login");
}