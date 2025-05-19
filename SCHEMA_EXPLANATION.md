# Meta Ads Dashboard Database Schema Explanation

This document explains the database schema design for the Meta Ads performance dashboard.

## Schema Overview

The schema follows a star schema design with dimension tables for entities (accounts, campaigns, ad sets, ads) and a central fact table (`ads_performance_daily`) that contains all performance metrics, with foreign keys to the dimension tables. Additional utility tables are included for dashboard customization and data sync tracking.

## Design Choices

### 1. Dimension Tables

The schema includes separate tables for each level of the Meta Ads hierarchy:

- `accounts`: Stores basic Facebook Ad Account information
- `campaigns`: Stores campaign-level data with reference to accounts
- `ad_sets`: Stores ad set (audience) data with reference to campaigns
- `ads`: Stores individual ad data with reference to ad sets

This hierarchical structure allows for:
- Simple navigation of the ad hierarchy
- Easy filtering at different levels in the dashboard
- Efficient storage by avoiding repetition of entity metadata

### 2. Fact Table Design

The `ads_performance_daily` table is the central fact table that:

- Stores daily performance metrics at the most granular level (per ad per day)
- Includes columns for all breakdown dimensions (age, gender, platform, etc.)
- Contains all metrics required by the dashboard (spend, impressions, clicks, conversions, etc.)

Key design choices:

- **Single Table Approach**: Rather than creating separate tables for different breakdowns or metrics, everything is in a single fact table. This simplifies querying as the dashboard can retrieve all data from one table with appropriate filtering.
  
- **Granularity**: Each row represents performance metrics for a specific day, ad (and its hierarchy), and breakdown combination. This level of granularity supports all dashboard views from highly detailed to broad aggregations.

- **Breakdown Fields as Columns**: All possible breakdown dimensions are stored as columns in the fact table, rather than using a more normalized approach with separate dimension tables. When no breakdown is applied, these fields remain NULL. This approach:
  - Simplifies queries for the dashboard (no complex joins needed)
  - Makes it easier to filter and aggregate data by various dimensions
  - Provides better query performance for the dashboard's needs

- **Constraint for Uniqueness**: The unique constraint ensures no duplicate data is inserted for the same day, ad, and breakdown combination.

### 3. Additional Tables

- `data_sync_logs`: Tracks the status of data synchronization from Meta Ads API to ensure data quality and completeness.
- `dashboard_preferences`: Stores user-specific dashboard preferences for customization.
- `available_kpis`: Defines the KPIs available for display on the dashboard.
- `saved_dashboard_views`: Stores user-saved dashboard configurations.

### 4. Indexing Strategy

The schema includes several carefully designed indexes to optimize common dashboard queries:

- **Individual Field Indexes**: On commonly filtered fields like date, account_id, campaign_id, etc.
- **Composite Indexes**: For frequently combined filters like date+account, gender+age
- **Hierarchical Index**: A combined index on the entire hierarchy to optimize drill-down queries
- **Time-Series Index**: Specifically for efficient extraction of time-series data

## Performance Considerations

1. **Query Optimization**: The schema is optimized for the most common dashboard queries:
   - Time series charts (filtering by date range and entities)
   - Breakdown analysis (filtering by dimensions)
   - KPI calculations (aggregating metrics)

2. **Data Volume Management**: The fact table may grow large over time. Consider:
   - Partitioning the fact table by date for improved performance
   - Implementing a data retention policy to archive older data
   - Using materialized views for common aggregations

3. **ETL Process**: When designing the n8n workflow that populates this database:
   - Always update dimension tables first, then the fact table
   - Use batch inserts for better performance
   - Implement proper error handling and retries

## Example Queries

### Get time-series data for a campaign:

```sql
SELECT 
    date_start, 
    SUM(impressions) as total_impressions,
    SUM(spend) as total_spend,
    SUM(link_clicks) as total_link_clicks
FROM ads_performance_daily
WHERE campaign_id = 'campaign_123'
AND date_start BETWEEN '2023-01-01' AND '2023-01-31'
AND age_range IS NULL AND gender IS NULL -- no breakdown
GROUP BY date_start
ORDER BY date_start;
```

### Get breakdown by platform:

```sql
SELECT 
    platform,
    SUM(spend) as total_spend,
    SUM(link_clicks) as total_clicks,
    SUM(purchase_value) as total_revenue,
    CASE WHEN SUM(spend) > 0 THEN SUM(purchase_value) / SUM(spend) ELSE 0 END as roas
FROM ads_performance_daily
WHERE account_id = 'account_123'
AND date_start BETWEEN '2023-01-01' AND '2023-01-31'
AND platform IS NOT NULL
GROUP BY platform
ORDER BY total_spend DESC;
``` 