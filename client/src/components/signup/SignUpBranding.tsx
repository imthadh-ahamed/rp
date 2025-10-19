import Image from 'next/image';

export default function SignUpBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-50 via-cyan-100 to-teal-100 items-center justify-center p-12">
      <div className="text-center">
        <div className="flex justify-center mb-1">
          <Image
            src="/AspireAI.png"
            alt="AspireAI Logo"
            width={400}
            height={400}
            priority
            className="drop-shadow-2xl"
          />
        </div>
        <p className="text-xl font-medium text-gray-700 italic mb-3">
          "Shaping your future, smarter"
        </p>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Join Us Today!</h2>
        <p className="text-gray-600 text-lg">Create an account and start your journey</p>
      </div>
    </div>
  );
}
