import Image from 'next/image';

export default function LoginBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 items-center justify-center p-12">
      <div className="text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/AspireAI.png"
              alt="AspireAI Logo"
              width={400}
              height={400}
              priority
              className="drop-shadow-2xl"
            />
          </div>
          <p className="text-2xl font-medium text-gray-700 italic mb-8">
            "Shaping your future, smarter"
          </p>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome Back!</h2>
        <p className="text-gray-600 text-lg">Sign in to continue to your account</p>
      </div>
    </div>
  );
}
