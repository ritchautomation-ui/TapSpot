# Smile U Love booking demo: setup

The clinic page works without any setup (the form runs in demo mode and saves nothing).
Follow these steps to turn on saving, the staff page, and the automatic emails.

## 1. Supabase (database and staff login)
1. Open your project, then **SQL Editor > New query**. Paste all of `supabase/schema.sql` and press **Run**.
2. **Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". This stops strangers from creating accounts.
3. **Authentication > Users > Add user > Create new user**. Enter the staff email and a strong password. Tick "Auto Confirm User".
4. **Project Settings > API Keys**. Copy the Project URL, the anon (publishable) key, and the service role (secret) key.

## 2. Vercel environment variables
Add these in **Project > Settings > Environment Variables**, then **redeploy**.

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role / secret key. Never share it or put it in a `NEXT_PUBLIC_` name. |
| `STAFF_EMAILS` | the staff email(s) from step 1.3, separated by commas |
| `MAKE_WEBHOOK_URL` | the webhook URL from step 3 |
| `CLINIC_NOTIFY_EMAIL` | the inbox that should be told about new requests |
| `NEXT_PUBLIC_SITE_URL` | your site address, so the email can link to the staff page |

The staff page is at `/samples/smile-u-love/staff`. It is not linked anywhere on the site.

## 3. Make scenario
1. New scenario, add **Webhooks > Custom webhook**. Copy its URL into `MAKE_WEBHOOK_URL`.
2. Send one test request from the form so Make learns the data fields.
3. Add a **Router** after the webhook with three routes:
   - **Filter `event` = `appointment.requested`**, with two Email modules:
     - To `email`: "We received your request" (use `name`, `service`, `preferred_date`, `preferred_time_label`, `reference`). Say it is waiting for confirmation.
     - To `clinic_email`: "New appointment request" with the same details, the patient's `phone`, and `dashboard_url`.
   - **Filter `event` = `appointment.status_changed` AND `status` = `confirmed`**: Email to `email` confirming the date and time.
   - **Filter `event` = `appointment.status_changed` AND `status` = `declined`**: Email to `email` saying that time is not available, and to call `clinic_phone` or send another request.
4. Turn the scenario **On**.

Fields sent to Make: `event`, `reference`, `name`, `phone`, `email`, `service`, `preferred_date`, `preferred_time`, `preferred_time_label`, `status`, `clinic_name`, `clinic_phone`, `clinic_email`, `dashboard_url`.

## 4. Test
1. Submit the form with your own email. You should get the "waiting for confirmation" email, and the clinic inbox should get one too.
2. Sign in at the staff page, press **Confirm**, and check that the patient email arrives.

## Notes
- Free Supabase projects pause after a week with no activity. For the demo, a daily scheduled request in Make keeps it awake. A real clinic should use a paid plan.
- Before real patients use it, the clinic needs a privacy notice, and someone should review how the data is handled (Data Privacy Act).
- Staff sign in with an email, not a username. That is how Supabase login works.
