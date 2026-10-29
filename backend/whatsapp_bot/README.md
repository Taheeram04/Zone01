# WhatsApp FAQ assistant

An automated WhatsApp agent for Zone01 Kisumu. When someone messages the
Zone01 WhatsApp number, the agent reads the text, sends it to an AI model
together with the active FAQ knowledge base, and replies with an answer grounded
in those FAQs. If the AI layer is not configured (or the provider fails), it
falls back to a deterministic keyword/IDF matcher. If neither can answer, the
bot stays silent and leaves the message for the communication team.

The AI integration talks to any OpenAI-compatible `/chat/completions` endpoint
(OpenAI, Azure gateways, Groq, OpenRouter, a local server, ...) and is
configured with the `WHATSAPP_AI_*` variables. When `WHATSAPP_AI_API_KEY` is
empty the bot uses keyword matching only, so everything keeps working without
an external service.

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
    ├─ first message of a conversation → welcome (English or Swahili)
    ├─ detect the visitor's language (English / Swahili)
    ├─ ai.generate_reply(text, FAQs, language) → grounded answer (when configured)
    ├─ retrieval.get_matcher().best_match(text) → translated answer + audit FAQ
    └─ no match → no reply; the message stays in the admin for a human
       client.send_text(...)         (or dry-run log)
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
cd backend
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_faqs            # add --prune to remove stale rows
```

Afterwards, edit categories and questions in **Admin → FAQ categories / FAQ
items**. The `keywords` field on each item is what makes free-text matching
strong — add everyday phrases people actually type.

Because the matcher caches for two minutes, admin edits normally take up to
that long to appear. FAQ saves and deletes now invalidate the cache immediately
(see `content/apps.py`), so new questions and answers are used on the next
incoming message. The AI prompt is rebuilt from the active FAQs per request.

## Languages

Incoming messages are detected as English or Swahili from their text. The
assistant answers in the visitor's language:

- The seeded Swahili translations live in `content/faq_data_sw.py` and are
  merged into `FaqItem.translations["sw"]` by `seed_faqs`. Refine them in
  **Admin → FAQ items → translations** (or in the seed file) as needed.
- An FAQ without a translation falls back to its English answer.
- The welcome message has a matching `WHATSAPP_WELCOME_MESSAGE_SW`.
- When the AI layer is enabled its prompt tells the model to reply in the
  visitor's language; when the FAQs do not cover the question the model replies
  with `NO_ANSWER`, which the webhook treats as "stay silent".

## 2. Configure the environment

Add these to `backend/.env` (see `.env.example`):

| Variable | Purpose |
| -------- | ------- |
| `WHATSAPP_VERIFY_TOKEN` | Any secret string. Enter the same value in the Meta dashboard. |
| `WHATSAPP_ACCESS_TOKEN` | Token that lets the server send messages. |
| `WHATSAPP_PHONE_NUMBER_ID` | The "Phone number ID" of your WhatsApp sender. |
| `WHATSAPP_APP_SECRET` | App secret, used to verify webhook signatures. |
| `WHATSAPP_API_VERSION` | Graph API version (default `v21.0`). |
| `WHATSAPP_DRY_RUN` | `true` (default) logs replies instead of sending them. |
| `WHATSAPP_MATCH_THRESHOLD` | Minimum `0..1` match score before an answer is sent; below it the bot stays silent. |
| `WHATSAPP_WELCOME_MESSAGE` | English greeting sent on the first message of a conversation (and again after 24h of silence). Empty disables it. |
| `WHATSAPP_WELCOME_MESSAGE_SW` | Swahili greeting used when the first message is in Swahili. |
| `WHATSAPP_AI_ENABLED` | `true` (default) uses the AI answer when a key is set. |
| `WHATSAPP_AI_API_KEY` | Key for the AI provider. Empty = keyword matching only. |
| `WHATSAPP_AI_BASE_URL` | OpenAI-compatible base URL (default `https://api.openai.com/v1`). |
| `WHATSAPP_AI_MODEL` | Chat model name (default `gpt-4o-mini`). |
| `WHATSAPP_AI_SYSTEM_PROMPT` | Optional custom prompt; `{faqs}` inserts the FAQ block. |

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
  it if wrong answers slip through; lower it if real questions are being left
  for the communication team too often.
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
