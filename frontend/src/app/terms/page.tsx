import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-12">Last updated: April 27, 2026</p>

          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing or using ChessMastery, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, you may not access the service.",
            },
            {
              title: "2. Use of the Service",
              body: "You agree to use ChessMastery only for lawful purposes. You must not use our platform to transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable.",
            },
            {
              title: "3. Accounts",
              body: "You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account.",
            },
            {
              title: "4. Intellectual Property",
              body: "The service and its original content, features, and functionality are and will remain the exclusive property of ChessMastery and its licensors.",
            },
            {
              title: "5. Termination",
              body: "We may terminate or suspend your account at any time, without prior notice or liability, for any reason, including if you breach these Terms.",
            },
            {
              title: "6. Limitation of Liability",
              body: "ChessMastery shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.",
            },
            {
              title: "7. Changes",
              body: "We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page.",
            },
            {
              title: "8. Contact",
              body: "If you have any questions about these Terms, please contact us at legal@chessmastery.com.",
            },
          ].map((section) => (
            <div key={section.title} className="mb-10">
              <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
