import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-12">Last updated: April 27, 2026</p>

          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide directly to us, such as your name, email address, and gameplay data when you register for an account or use our services.",
            },
            {
              title: "2. How We Use Your Information",
              body: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and respond to your comments and questions.",
            },
            {
              title: "3. Information Sharing",
              body: "We do not share your personal information with third parties except as described in this policy. We may share information with vendors and service providers that assist us in providing the service.",
            },
            {
              title: "4. Data Security",
              body: "We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.",
            },
            {
              title: "5. Data Retention",
              body: "We retain your account information for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time.",
            },
            {
              title: "6. Your Rights",
              body: "You have the right to access, update, or delete your personal information. You can do this by logging into your account settings or by contacting us directly.",
            },
            {
              title: "7. Cookies",
              body: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. Please see our Cookie Policy for more details.",
            },
            {
              title: "8. Contact Us",
              body: "If you have any questions about this Privacy Policy, please contact us at privacy@chessmastery.com.",
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
