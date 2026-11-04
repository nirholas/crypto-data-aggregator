# Free Crypto News Rust SDK

Production-ready Rust client for the [Free Crypto News API](https://crypto-data-aggregator.modelcontextprotocol.name).

## Features

- ✅ **Async/await** with Tokio
- ✅ **WebSocket streaming** (real-time news)
- ✅ **Automatic retries** with exponential backoff
- ✅ **Rate limit handling** with smart retry
- ✅ **Type-safe** with Serde serialization
- ✅ **Portfolio tools** with tax reporting
- ✅ **On-chain events** correlation
- ✅ **Gzip compression** for efficient transfers
- ✅ **Optional tracing** for observability

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
fcn-sdk = "0.2"

# Optional: Enable all features
fcn-sdk = { version = "0.2", features = ["full"] }
```

### Feature Flags

| Feature | Description | Default |
|---------|-------------|---------|
| `websocket` | Real-time news streaming | ✅ |
| `tracing` | Debug/trace logging | ❌ |
| `full` | All features enabled | ❌ |

## Quick Start

```rust
use fcn_sdk::{Client, ClientConfig};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create client
    let client = Client::new()?;
    
    // Get latest news
    let news = client.get_news(10, None, None, None).await?;
    for article in news.articles {
        println!("📰 {}", article.title);
    }
    
    Ok(())
}
```

### With Configuration

```rust
use fcn_sdk::{Client, ClientConfig};
use std::time::Duration;

let config = ClientConfig::new()
    .with_api_key("your_api_key")
    .with_timeout(Duration::from_secs(60))
    .with_base_url("https://custom-api.example.com");

let client = Client::with_config(config)?;
```

## News API

```rust
// Get latest news with filters
let news = client.get_news(20, None, Some("BTC"), None).await?;

// Get trending tickers
let trending = client.get_trending(10).await?;
println!("🔥 Trending: {:?}", trending);

// Search articles
let results = client.search("ethereum upgrade", 10).await?;
```

## AI & Analytics

```rust
// Sentiment analysis
let sentiment = client.get_sentiment(20).await?;
println!("Market sentiment: {} ({})", sentiment.overall, sentiment.score);

// AI digest
let digest = client.get_digest().await?;
println!("📊 Today's summary:\n{}", digest.summary);

// Ask anything
let answer = client.ask("What's happening with Bitcoin ETFs?").await?;
println!("🤖 {}", answer);
```

## Real-time Streaming

```rust
use fcn_sdk::Client;
use futures_util::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new()?;
    
    // Stream real-time news
    let mut stream = client.stream_news().await?;
    
    while let Some(article) = stream.next().await {
        match article {
            Ok(a) => println!("🔴 LIVE: {}", a.title),
            Err(e) => eprintln!("Error: {}", e),
        }
    }
    
    Ok(())
}
```

## Portfolio Tools

```rust
// Get portfolio performance
let performance = client.get_portfolio_performance("demo", "30d").await?;
println!("Portfolio value: ${}", performance.current_value);

// Generate tax report
let tax = client.get_tax_report("demo", 2024, "FIFO", "US").await?;
println!("Total gains: ${}", tax.total_gains);
```

## On-chain Events

```rust
// Get on-chain events correlated to news
let events = client.get_onchain_events(Some("ethereum"), None).await?;
for event in events {
    println!("🔗 {} - {}", event.event_type, event.description);
}
```

## Error Handling

```rust
use fcn_sdk::{Client, FcnError};

async fn fetch_news(client: &Client) {
    match client.get_news(10, None, None, None).await {
        Ok(news) => println!("Got {} articles", news.articles.len()),
        Err(FcnError::RateLimited { retry_after }) => {
            println!("Rate limited, retry after {}s", retry_after);
        }
        Err(FcnError::Unauthorized) => {
            println!("Invalid API key");
        }
        Err(e) => eprintln!("Error: {}", e),
    }
}
```

## Examples

```bash
# Run basic example
cargo run --example basic

# Run streaming example
cargo run --example streaming --features websocket

# Run portfolio example
cargo run --example portfolio
```

## API Reference

### Client Methods

| Method | Description |
|--------|-------------|
| `get_news()` | Fetch latest news articles |
| `get_trending()` | Get trending tickers |
| `search()` | Search articles |
| `get_sentiment()` | Sentiment analysis |
| `get_digest()` | AI-generated digest |
| `ask()` | Natural language Q&A |
| `get_entities()` | Entity extraction |
| `get_predictions()` | Price predictions |
| `stream_news()` | Real-time WebSocket stream |
| `get_portfolio_performance()` | Portfolio metrics |
| `get_tax_report()` | Tax report generation |
| `get_onchain_events()` | On-chain event correlation |

## License

MIT
