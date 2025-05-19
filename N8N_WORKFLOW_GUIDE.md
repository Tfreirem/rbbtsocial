# n8n Workflow Guide for Meta Ads Database Integration

This guide outlines how to implement n8n workflows to populate the Meta Ads dashboard database from the Meta Ads API.

## Overview

The integration process consists of multiple workflows:

1. Entity Sync Workflows - to populate dimension tables (accounts, campaigns, ad sets, ads)
2. Performance Data Sync Workflow - to populate the fact table with daily metrics
3. Scheduled Trigger Workflow - to orchestrate the synchronization process

## Prerequisites

1. n8n instance set up and running
2. Meta/Facebook Developer account with an app that has appropriate permissions
3. Long-lived access token for the Meta Marketing API
4. PostgreSQL database set up with the schema defined in `schema.sql`

## 1. Entity Sync Workflows

### 1.1 Account Sync Workflow

This workflow fetches account information and updates the `accounts` table.

#### Steps:

1. **Trigger Node**: Schedule (e.g., once daily)

2. **HTTP Request Node**:
   - Method: GET
   - URL: `https://graph.facebook.com/v18.0/me/adaccounts`
   - Parameters:
     - `access_token`: Your access token
     - `fields`: `id,name,account_status,currency,timezone_name`
   - Authentication: None (token is in params)

3. **Function Node** (Transform Response):
   ```javascript
   return items[0].json.data.map(account => {
     return {
       account_id: account.id.replace('act_', ''),
       account_name: account.name,
       status: account.account_status === 1 ? 'ACTIVE' : 'INACTIVE',
       currency: account.currency,
       timezone: account.timezone_name,
       updated_at: new Date().toISOString()
     };
   });
   ```

4. **PostgreSQL Node**:
   - Operation: Insert
   - Table: accounts
   - Columns to Match: account_id
   - On Conflict: Do Update (UPSERT)
   - Update All Fields: true

### 1.2 Campaign Sync Workflow

Similar structure, but fetching campaigns for each account and updating the `campaigns` table.

#### Fetch Campaigns Function:

```javascript
// This assumes the input contains account_id from previous node
const accountId = items[0].json.account_id;
const url = `https://graph.facebook.com/v18.0/act_${accountId}/campaigns`;
const params = {
  access_token: $node['Credentials'].access_token,
  fields: 'id,name,status,objective,buying_type,start_time,stop_time,budget_remaining,daily_budget,lifetime_budget',
  limit: 500
};

// Return prepared HTTP Request
return {
  url,
  method: 'GET',
  qs: params
};
```

#### Transform Campaigns:

```javascript
return items[0].json.data.map(campaign => {
  return {
    campaign_id: campaign.id,
    account_id: items[0].json.account_id,
    campaign_name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
    buying_type: campaign.buying_type,
    start_time: campaign.start_time,
    stop_time: campaign.stop_time,
    budget_remaining: campaign.budget_remaining ? campaign.budget_remaining / 100 : null,
    daily_budget: campaign.daily_budget ? campaign.daily_budget / 100 : null,
    lifetime_budget: campaign.lifetime_budget ? campaign.lifetime_budget / 100 : null,
    updated_at: new Date().toISOString()
  };
});
```

### 1.3 Ad Set and Ad Sync Workflows

Follow similar patterns for ad sets and ads, adjusting fields as necessary.

## 2. Performance Data Sync Workflow

This workflow fetches performance metrics from the Meta Ads API Insights endpoint and populates the `ads_performance_daily` table.

### 2.1 Basic Workflow Structure

1. **Trigger Node**: Schedule (daily)

2. **PostgreSQL Node** (Get Active Accounts):
   - Operation: Select
   - Table: accounts
   - Additional Fields: `SELECT account_id FROM accounts WHERE status = 'ACTIVE'`

3. **Split In Batches Node**: Split accounts for parallel processing

4. **Function Node** (Generate Date Range):
   ```javascript
   // Default to yesterday if no specific date range is provided
   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);
   const dateStr = yesterday.toISOString().split('T')[0];
   
   return [{
     json: {
       account_id: items[0].json.account_id,
       start_date: dateStr,
       end_date: dateStr
     }
   }];
   ```

5. **HTTP Request Node** (Fetch Insights):
   - Method: GET
   - URL: `https://graph.facebook.com/v18.0/act_{{$node["Generate Date Range"].json["account_id"]}}/insights`
   - Parameters:
     - `access_token`: Your access token
     - `level`: `ad`
     - `time_range`: `{"since":"{{$node["Generate Date Range"].json["start_date"]}}","until":"{{$node["Generate Date Range"].json["end_date"]}}"}`
     - `fields`: (see detailed fields list below)
     - `breakdowns`: `""` (for no breakdowns initially)

6. **Function Node** (Transform Insights):
   ```javascript
   // Transform API response to match database schema
   return items[0].json.data.map(insight => {
     return {
       date_start: insight.date_start,
       account_id: items[0].json.account_id,
       campaign_id: insight.campaign_id,
       ad_set_id: insight.adset_id,
       ad_id: insight.ad_id,
       impressions: parseInt(insight.impressions || 0),
       reach: parseInt(insight.reach || 0),
       spend: parseFloat(insight.spend || 0),
       clicks: parseInt(insight.clicks || 0),
       link_clicks: parseInt(insight.link_clicks || 0),
       // ... map all other fields from API to DB schema
       last_fetched_time: new Date().toISOString()
     };
   });
   ```

7. **PostgreSQL Node** (Insert Performance Data):
   - Operation: Insert
   - Table: ads_performance_daily
   - Option: Do Nothing on Conflict or Update as needed

### 2.2 Insights API Fields

Use this comprehensive list of fields for the Insights API call:

```
date_start,date_stop,account_id,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,impressions,reach,frequency,spend,clicks,unique_clicks,link_clicks,unique_link_clicks,ctr,cpc,cpp,cpm,purchases,purchase_values,leads,add_to_carts,checkouts_initiated,cost_per_purchase,cost_per_lead,video_3s_views,video_p25_watched,video_p50_watched,video_p75_watched,video_p95_watched,video_p100_watched,video_avg_watch_time,post_reactions,post_comments,post_shares,page_engagement
```

### 2.3 Handling Breakdowns

Create separate workflow executions for each breakdown type. For example:

1. No breakdowns (base metrics)
2. Age and gender breakdown
3. Platform and placement breakdown
4. Country and region breakdown

Each breakdown workflow follows the same pattern but with different `breakdowns` parameter:

```
// Age and gender
breakdowns=age,gender

// Platform and placement
breakdowns=publisher_platform,placement

// Geographic
breakdowns=country,region
```

Transform the response to include the breakdown fields in the database insert.

## 3. Data Sync Logging

Add logging nodes to track the progress of data synchronization:

1. **Function Node** (Create Log Entry - Start):
   ```javascript
   return [{
     json: {
       sync_type: 'performance_data',
       account_id: items[0].json.account_id,
       start_date: items[0].json.start_date,
       end_date: items[0].json.end_date,
       status: 'in_progress',
       sync_start_time: new Date().toISOString()
     }
   }];
   ```

2. **PostgreSQL Node** (Insert Log):
   - Operation: Insert
   - Table: data_sync_logs

3. Add similar nodes at the end to update the log status to 'success' or 'failure'

## 4. Master Workflow (Orchestration)

Create a master workflow that:

1. Triggers all entity sync workflows
2. Waits for their completion
3. Triggers the performance data sync workflows
4. Handles error notifications

This can be accomplished using n8n's Webhook nodes for inter-workflow communication.

## Error Handling and Retries

1. Add Error Trigger nodes to each workflow to capture failures
2. Implement automatic retries for API failures with exponential backoff
3. Send notifications on critical failures (email/Slack)

## Performance Optimization

1. Use pagination for large data sets
2. Implement parallel processing with Split In Batches nodes
3. Schedule workflows during off-peak hours
4. Consider implementing incremental syncs for faster updates

## Example Function for Targeted Sync

This function helps sync only recent data for active entities:

```javascript
// Get data for the last 30 days for active campaigns only
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const startDate = thirtyDaysAgo.toISOString().split('T')[0];
const endDate = new Date().toISOString().split('T')[0];

// Get list of active campaign IDs from items
const campaignIds = items.map(item => item.json.campaign_id).join(',');

return [{
  json: {
    start_date: startDate,
    end_date: endDate,
    campaign_ids: campaignIds
  }
}];
```

## Conclusion

These workflows will ensure your Meta Ads dashboard database is kept up-to-date with the latest performance data. Adjust the field mappings and schedules as needed for your specific requirements.

Remember to monitor API usage to avoid hitting Meta's rate limits, especially when dealing with large accounts or extensive date ranges. 