import Link from "next/link";

import ChartGenerator from "../../src/app/components/ChartGenerator";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="flex flex-col items-center space-y-6 text-2xl font-semibold text-blue-900">
        <div className="flex space-x-48">
          <Link href="/client" className="hover:underline hover:text-blue-600">
            Client
          </Link>
          <Link href="/doctor" className="hover:underline hover:text-blue-600">
            Doctor
          </Link>
        </div>
        <ChartGenerator />
      </div>
    </div>
  );
}
