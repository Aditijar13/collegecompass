import { Suspense } from "react";
import { CompareClient } from "@/components/compare/CompareClient";
import { SessionProvider } from "@/components/shared/SessionProvider";

export default function ComparePage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div style={{maxWidth:1280,margin:"0 auto",padding:"40px 24px"}}><div className="skeleton" style={{height:400,borderRadius:14}}/></div>}>
        <CompareClient />
      </Suspense>
    </SessionProvider>
  );
}
