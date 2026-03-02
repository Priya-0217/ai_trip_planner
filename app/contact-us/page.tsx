import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function ContactUsPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">
            Reach out for support, feedback, or collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6">
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours.
              </p>

              <form className="mt-6 space-y-4">
                <input
                  className="w-full rounded-lg border px-4 py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Your name"
                  name="name"
                />
                <input
                  className="w-full rounded-lg border px-4 py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Email"
                  type="email"
                  name="email"
                />
                <Textarea
                  className="min-h-28"
                  placeholder="Message"
                  name="message"
                />
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6">
              <h2 className="text-xl font-semibold">Contact details</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>support@tripplanner.ai</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Twitter</span>
                  <Link href="https://x.com" className="underline">x.com</Link>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Docs</span>
                  <Link href="/pricing" className="underline">Pricing</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
