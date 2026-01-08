import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <div className="bg-muted p-4 rounded-full mb-2">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground text-center max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        <br />
        주소를 다시 확인해주세요.
      </p>
      <div className="mt-4">
        <Button asChild>
          <Link href="/">메인으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
