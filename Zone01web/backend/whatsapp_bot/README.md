# WhatsApp FAQ assistant

An automated WhatsApp agent for Zone01 Kisumu. When someone messages the
Zone01 WhatsApp number, the agent reads the text, finds the closest answer in
the FAQ knowledge base and replies with it. If nothing matches closely enough,
it sends a friendly fallback message.

There is **no external AI service**: matching is a deterministic keyword/IDF
scorer that runs in-process (see `retrieval.py`), so it is cheap, private and
easy to test. The design keeps a clean seam so an LLM re-ranking step could be
added later without touching the webhook.

## How it works

```
WhatsApp user
    │  message
    ▼
Meta WhatsApp Cloud API
    │  POST /webhooks/whatsapp/     (webhook)
    ▼
whatsapp_bot.views
    ├─ verify signature  (WHATSAPP_APP_SECRET)
    ├─ dedupe by message id
    ├─ retrieval.get_matcher().best_match(text)   → content.FaqItem
    └─ client.send_text(...)         (or dry-run log)
    │  reply
    ▼
WhatsApp user
```

Everything in and out is recorded in `WhatsAppContact` / `WhatsAppMessage` and
visible read-only in the Django admin under **WhatsApp assistant**.

## 1. Make sure the FAQs exist

The answers come from the `content` app (`FaqCategory` / `FaqItem`), which is
also the FAQ content for the website. Seed the shipped set once:

```bash
cd Zone01web/backend
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_faqs            # add --prune to remove stale rows
```

Afterwards, edit categories and questions in **Admin → FAQ categories / FAQ
items**. The `keywords` field on each item is what makes free-text matching
strong — add everyday phrases people actually type.

Because the matcher caches for two minutes, admin edits are picked up within
that window (or restart the process to apply immediately).

## 2. Configure the environment

Add these to `Zone01web/backend/.env` (see `.env.example`):

| Variable | Purpose |
| -------- | ------- |
| `WHATSAPP_VERIFY_TOKEN` | Any secret string. Enter the same value in the Meta dashboard. |
| `WHATSAPP_ACCESS_TOKEN` | Token that lets the server send messages. |
| `WHATSAPP_PHONE_NUMBER_ID` | The "Phone number ID" of your WhatsApp sender. |
| `WHATSAPP_APP_SECRET` | App secret, used to verify webhook signatures. |
| `WHATSAPP_API_VERSION` | Graph API version (default `v21.0`). |
| `WHATSAPP_DRY_RUN` | `true` (default) logs replies instead of sending them. |
| `WHATSAPP_MATCH_THRESHOLD` | Minimum `0..1` match score before an answer is sent. |
| `WHATSAPP_FALLBACK_MESSAGE` | Reply used when nothing matches. |

> Keep `WHATSAPP_DRY_RUN=true` until the rest is wired up. Replies are then
> stored and logged but not actually sent, so you can exercise the whole flow
> safely.

## 3. Point Meta at the webhook

1. Create a **Meta app** (type *Business*) and add the **WhatsApp** product.
2. From **WhatsApp → API Setup** copy the **Phone number ID** and a
   **temporary access token** into `.env` (`WHATSAPP_PHONE_NUMBER_ID`,
   `WHATSAPP_ACCESS_TOKEN`). Copy the **App secret** from *Settings → Basic*
   into `WHATSAPP_APP_SECRET`.
3. Expose the backend on a public HTTPS URL. In production that is your deployed
   domain; locally use a tunnel such as `ngrok http 8000`.
4. In **WhatsApp → Configuration → Webhook**, set:
   - **Callback URL**: `https://<your-host>/webhooks/whatsapp/`
   - **Verify token**: the same value as `WHATSAPP_VERIFY_TOKEN`
   Meta sends a `GET` handshake; the view answers it when the token matches.
5. **Subscribe** to the `messages` field.
6. Add the recipient number as a test number (or go live) and send it a text —
   it should reply with the matching FAQ answer.

The webhook is CSRF-exempt and mounted at `/webhooks/whatsapp/` (outside the
i18n prefix and the SPA catch-all); unknown API paths still 404 as JSON.

## Testing locally

With `WHATSAPP_DRY_RUN=true` you can simulate a delivery without Meta:

```bash
curl -s http://localhost:8000/webhooks/whatsapp/ \
  -H 'Content-Type: application/json' \
  -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{
        "contacts":[{"wa_id":"254700000001","profile":{"name":"Test"}}],
        "messages":[{"from":"254700000001","id":"wamid.1","type":"text",
                     "text":{"body":"how much is the tuition"}}]}}]}]}'
```

Then check **Admin → WhatsApp assistant → WhatsApp messages**: you should see an
inbound row and an outbound row with the matched FAQ and score.

Run the automated tests:

```bash
.venv/bin/python manage.py test whatsapp_bot content
```

## Going live

1. Set real credentials and `WHATSAPP_DRY_RUN=false`.
2. Send a message from a phone that is allowed to reach the number.
3. Watch **Admin → WhatsApp messages** to confirm replies are `sent` (statuses
   from Meta, such as delivery failures, are captured there too).

## Tuning the matching

- `WHATSAPP_MATCH_THRESHOLD` (default `0.34`) trades precision for recall. Raise
  it if wrong answers slip through; lower it if real questions get the fallback.
- `keywords` on a `FaqItem` are the strongest signal. If a common phrasing is
  missed, add it there rather than lengthening the question.
- The scorer weights question words and keywords above category/answer words,
  ignores stopwords, lightly stems plurals/gerunds and tolerates typos via
  fuzzy token matching.

## Deployment notes

- The webhook must be reachable over HTTPS, so it can only run on the deployed
  backend (or a local tunnel), not on your laptop by itself.
- Processing is synchronous. That is fine at the expected volume; for higher
  traffic, hand the reply off to a task queue (e.g. Celery/RQ) and return `200`
  immediately. Meta retries deliveries, and duplicates are already ignored via
  the stored message id.
- Required secrets on Fly.io: `fly secrets set WHATSAPP_VERIFY_TOKEN=... \
  WHATSAPP_ACCESS_TOKEN=... WHATSAPP_PHONE_NUMBER_ID=... WHATSAPP_APP_SECRET=...`
