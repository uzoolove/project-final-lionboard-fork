'use client';

import CustomError from "@/components/common/CustomError";

export default function ErrorPage({ error }: { error: Error }) {
  console.error(error);
  return (
    <CustomError message="예상치 못한 오류가 발생했습니다." />
  );
}