# Asset Management Worker

## Opertaion

```
pnpm wrangler dev --test-scheduled
# pnpm wrangler dev --test-scheduled --remote

curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"
curl "http://localhost:8787/__scheduled?cron=1,6,11,16,21,26,31,36,41,46,51,56+0-6+*+*+2-6"
curl "http://localhost:8787/__scheduled?cron=1,6,11,16,21,26,31,36,41,46,51,56+13-20+*+*+2-6"
```

```
pnpm wrangler kv namespace create kv
pnpm wrangler secret put {..}
```

## Reference

### Notion API

- [Query a database](https://developers.notion.com/reference/post-database-query)
- [Update page properties](https://developers.notion.com/reference/patch-page)
- [Database properties](https://developers.notion.com/reference/property-object)

### KIS Developers

- [접근토큰발급(P)](https://apiportal.koreainvestment.com/apiservice/oauth2#L_fa778c98-f68d-451e-8fff-b1c6bfe5cd30)
- [투자계좌자산현황조회](https://apiportal.koreainvestment.com/apiservice/apiservice-domestic-stock-order#L_052c663e-73db-43ee-b1a0-702a14de31fc)
- [ETF/ETN 현재가](https://apiportal.koreainvestment.com/apiservice/apiservice-domestic-stock-quotations2#L_e53eb2e6-b292-4e2b-b150-22d92b401453)
- [해외주식 현재가상세](https://apiportal.koreainvestment.com/apiservice/apiservice-oversea-stock-quotations#L_abc66a03-8103-4f6d-8ba8-450c2b935e14)

### Cloudflare

- [Multiple Cron Triggers · Cloudflare Workers docs](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/)
- [Get started · Cloudflare Workers KV](https://developers.cloudflare.com/kv/get-started/)
- [Secrets · Cloudflare Workers docs](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Limits · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/limits/)
