export default function FormDivider({ text = "Or continue with" }: { text?: string }) {
  return (
    <div className="mt-8 mb-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">{text}</span>
        </div>
      </div>
    </div>
  );
}
