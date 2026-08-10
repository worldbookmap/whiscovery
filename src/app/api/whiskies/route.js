import { NextResponse } from "next/server";
import { getWhiskyList } from "@/lib/notion";

export async function GET() {
  try {
    const items = await getWhiskyList();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        message: "노션 데이터를 불러오지 못했습니다.",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
