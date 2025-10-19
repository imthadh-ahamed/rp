import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-8 p-8">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/AspireAI.png"
              alt="AspireAI Logo"
              width={180}
              height={180}
              priority
              className="drop-shadow-xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AspireAI</h1>
          <p className="text-2xl font-medium text-gray-700 italic mb-4">
            "Shaping your future, smarter"
          </p>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Get Started
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
          Choose an option below to continue
        </p>

        <div className="flex gap-6 items-center justify-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-[#0891b2] to-[#06b6d4] text-white px-8 py-4 font-semibold hover:from-[#0e7490] hover:to-[#0891b2] transition duration-200 shadow-lg hover:shadow-xl text-center"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto rounded-lg border-2 border-cyan-600 text-cyan-600 px-8 py-4 font-semibold hover:bg-cyan-50 transition duration-200 text-center"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

