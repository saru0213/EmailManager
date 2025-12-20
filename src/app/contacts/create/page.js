import CreateContactClient from "@/app/components/CreateContactClient";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <CreateContactClient />
    </Suspense>
  );
}
