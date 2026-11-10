import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-brand text-white px-6 text-center">
      <h1 className="text-3xl font-bold mb-2">Roshan Rozgar</h1>
      <p className="text-xl mb-1 urdu">روشن روزگار</p>
      <p className="text-gray-300 mb-8 text-sm">
        Hyper-local marketplace for skilled trade workers
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Link
          to="/customer/home"
          className="block w-full bg-accent text-brand font-bold py-4 rounded-xl text-lg hover:bg-accent-light transition"
        >
          I need a worker
          <span className="block text-sm font-normal urdu mt-1">مجھے ورکر چاہیے</span>
        </Link>

        <Link
          to="/worker/onboarding"
          className="block w-full bg-white text-brand font-bold py-4 rounded-xl text-lg hover:bg-gray-100 transition border-2 border-white"
        >
          I am a worker
          <span className="block text-sm font-normal urdu mt-1">میں ورکر ہوں</span>
        </Link>
      </div>
    </div>
  );
}
