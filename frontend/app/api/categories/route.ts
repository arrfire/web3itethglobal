import {
  NextRequest,
  NextResponse,
} from "next/server";
import { createClient } from '@/common/utils/supabase/client';

export async function GET () {
  try {
    const supabase = createClient();
    const { data: categories } = await supabase
      .from('Categories')
      .select('id,value')
    if (categories?.length) {
      const sortedCategories = categories.sort((a, b) => a.value.localeCompare(b.value));
      return NextResponse.json(
        { data: sortedCategories },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { data: [] },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


export async function POST (request: NextRequest) {
  try {
    const supabase = createClient();
    const jsonRequest = await request.json();
    const payload = JSON.parse(jsonRequest)
    await supabase
      .from('Categories')
      .insert([payload]).select()
    return NextResponse.json(
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
