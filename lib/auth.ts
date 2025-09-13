import { adminSupabase, serverClient } from "@/lib/supabase/server"
    // gets user from supabase
export async function auth(){
  const supabase = await serverClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  //if user is not found, return null
  if (error || !user) {
    return null
  }
  try {

    // Verify the user exists in Supabase
    const { data, error } = await adminSupabase.from("users").select("*").eq("id", user.id).single()
    if (error || !data) {
      return null
    }

    return {
      user: {
        id: data.id as string,
        name: data.name as string,
        phone_number: data.phone_number as string,
      },
    }
  } catch (error) {
    return null
  }
}
