"use client"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/libs/configs/routes"
import { Linkedin } from "lucide-react"

export default function LinkedInButton(props: React.ComponentPropsWithRef<typeof Button> & { text?: string }) {
  const text = props.text || "Se connecter avec LinkedIn"
  return (
    <Button
      {...props}
      variant="outline"
      type="button"
      onClick={() => signIn("linkedin", { callbackUrl: DEFAULT_LOGIN_REDIRECT })}
      aria-label="Se connecter avec LinkedIn"
    >
      <Linkedin className="h-5 w-5" />
      {text}
    </Button>
  )
}