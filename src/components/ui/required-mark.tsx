/**
 * 필수 필드 표시 컴포넌트
 * 시각적으로 * 표시, 스크린리더에는 "(필수)" 텍스트 전달
 */
export function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive">
        *
      </span>
      <span className="sr-only">(필수)</span>
    </>
  );
}
