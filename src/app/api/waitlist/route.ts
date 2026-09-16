import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !serverPrefix || !audienceId) {
    console.error('Mailchimp env vars are not configured.');
    return NextResponse.json({ error: 'Waitlist signup is not configured yet.' }, { status: 500 });
  }

  const subscriberHash = crypto.createHash('md5').update(email).digest('hex');
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const mailchimpResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
    }),
  });

  if (!mailchimpResponse.ok) {
    const errorBody = await mailchimpResponse.json().catch(() => null);
    console.error('Mailchimp error:', errorBody);

    if (errorBody?.title === 'Member In Compliance State') {
      return NextResponse.json(
        { error: 'This email can’t be re-added automatically — please contact us directly.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
