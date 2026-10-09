import { NextResponse } from 'next/server';
/** Orders are confirmed directly in Messenger/email; no public order intake is enabled. */
export async function POST() {
  return NextResponse.json({ delivered: false, error: 'Please send your request to TapSpot through the contact page.' }, { status: 410 });
}
