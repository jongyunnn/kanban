"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 서비스로 전송 가능
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <div className="flex items-center gap-2 text-destructive mb-2">
        <AlertCircle className="w-8 h-8" />
        <h2 className="text-2xl font-bold">오류가 발생했습니다</h2>
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        죄송합니다. 예상치 못한 오류가 발생하여 요청을 처리할 수 없습니다.
        <br />
        문제가 지속되면 관리자에게 문의해주세요.
      </p>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          새로고침
        </Button>
      </div>
    </div>
  );
}
