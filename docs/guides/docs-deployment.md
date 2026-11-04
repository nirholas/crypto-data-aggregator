# Documentation Site Deployment

The documentation at [crypto-data-aggregator-docs.modelcontextprotocol.name](https://crypto-data-aggregator-docs.modelcontextprotocol.name) is a MkDocs Material site hosted on Cloudflare Pages.

| Item | Value |
|------|-------|
| Host | Cloudflare Pages, project `crypto-data-aggregator-docs` |
| Production URL | `https://crypto-data-aggregator-docs.modelcontextprotocol.name` |
| Security headers | `docs/_headers` (copied into the build) |
| DNS | Proxied CNAME in the `modelcontextprotocol.name` Cloudflare zone, pointing to `crypto-data-aggregator-docs.pages.dev` |

## Build

```bash
pip install mkdocs-material mkdocs-minify-plugin pymdown-extensions
mkdocs build            # output: site/
```

## Deploy

Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run from the repository root:

```bash
npx wrangler@4 pages deploy site --project-name=crypto-data-aggregator-docs --branch=main
```

Deploys are manual. GitHub Actions is not used for this site.

## Verify

```bash
curl -sI https://crypto-data-aggregator-docs.modelcontextprotocol.name | head -1   # HTTP/2 200
```

## Rollback

In the Cloudflare dashboard, open **Workers & Pages → crypto-data-aggregator-docs → Deployments**.
Pick an earlier production deployment and select **Rollback to this deployment**.

## Web app

The Next.js app is deployed to Google Cloud Run (service `crypto-data-aggregator`, project `aerial-vehicle-466722-p5`, `us-central1`) and served at https://crypto-data-aggregator.modelcontextprotocol.name through a Cloudflare Worker (`crypto-data-aggregator-proxy`) that forwards to the Cloud Run URL.

```bash
gcloud run deploy crypto-data-aggregator --source . --region us-central1 \
  --project aerial-vehicle-466722-p5 --allow-unauthenticated --memory 1Gi --port 8080 \
  --set-env-vars NEXT_PUBLIC_APP_URL=https://crypto-data-aggregator.modelcontextprotocol.name
```

Cloud Build uses the repository `Dockerfile` (`next.config.js` sets `output: 'standalone'`). Rollback with `gcloud run services update-traffic crypto-data-aggregator --to-revisions=<revision>=100`.
