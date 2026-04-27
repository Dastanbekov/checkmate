import { Navbar } from "@/components/ui/nav-header";
import { Footer } from "@/components/ui/footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Cookie Policy</h1>
          <p className="text-gray-500 mb-12">Last updated: April 27, 2026</p>

          {[
            {
              title: "1. What Are Cookies",
              body: "Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the service to recognize you and make your next visit easier.",
            },
            {
              title: "2. How We Use Cookies",
              body: "We use cookies for authentication (keeping you logged in), preferences, analytics to understand how our service is used, and to improve user experience.",
            },
            {
              title: "3. Essential Cookies",
              body: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as logging in or setting your preferences.",
            },
            {
              title: "4. Analytics Cookies",
              body: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular.",
            },
            {
              title: "5. Managing Cookies",
              body: "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.",
            },
            {
              title: "6. Contact Us",
              body: "If you have any questions about our use of cookies, please contact us at privacy@chessmastery.com.",
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
