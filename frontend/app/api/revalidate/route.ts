import { getIdeas } from '@/app/actions'
import { revalidateTag } from 'next/cache'
import { 
  NextRequest, 
  NextResponse,
} from 'next/server'

export async function POST (request: NextRequest) {
  try {
    const { tagName } = await request.json()
    if (!tagName || typeof tagName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing tagname' },
        { status: 400 },
      )
    }
    revalidateTag(tagName)
    await getIdeas()
    return NextResponse.json({ 
      revalidated: true,
      tag: tagName,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 },
    )
  }
}
