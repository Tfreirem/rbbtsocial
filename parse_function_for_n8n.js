/**
 * Parse function for n8n workflow
 * 
 * This function takes the raw API results from any Meta Ads endpoint
 * and structures it into a format easily consumable by an LLM.
 * It's designed to be used in the n8n Function node after API calls.
 * 
 * @param {Object} items - The input items from previous node (API results)
 * @returns {Object} - Structured data for the LLM
 */

// Get original request context from MCP node
const originalRequest = items[0]?.json?.original_query || 'Unknown request';
const requestType = items[0]?.json?.request_type || {};
const endpointCalled = items[0]?.json?.endpoint_to_call || 'unknown_endpoint';

// Get results from API call node
const apiResults = items[1]?.json?.data || [];
const apiError = items[1]?.json?.error;

// Build the response for the LLM
function buildResponse() {
  // Handle API errors
  if (apiError) {
    return [{
      json: {
        status: 'error',
        message: `Failed to fetch data: ${apiError.message || 'Unknown error'}`,
        original_request: originalRequest,
        endpoint: endpointCalled,
        timestamp: new Date().toISOString()
      }
    }];
  }
  
  // Process successful results
  const formattedData = formatDataForLLM(apiResults, endpointCalled);
  
  // Generate natural language summary
  const summary = generateSummary(formattedData, endpointCalled, requestType);
  
  return [{
    json: {
      status: 'success',
      summary,
      data: formattedData,
      metadata: {
        endpoint: endpointCalled,
        record_count: Array.isArray(apiResults) ? apiResults.length : 0,
        time_period: requestType.time_period,
        filters: requestType.filters,
        entity_type: requestType.entity_type,
        timestamp: new Date().toISOString()
      },
      original_request: originalRequest
    }
  }];
}

/**
 * Format data based on endpoint type
 */
function formatDataForLLM(data, endpoint) {
  // Handle empty data
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return [];
  }
  
  // Format based on endpoint type
  switch (endpoint) {
    case 'lista_campanhas':
      return formatCampaignsList(data);
      
    case 'lista_ad_sets':
      return formatAdSetsList(data);
      
    case 'list_ads':
      return formatAdsList(data);
      
    case 'get_campaign_insights':
    case 'get_ad_set_insights':
    case 'get_ad_insights':
      return formatInsights(data);
      
    case 'get_ig_posts':
      return formatInstagramPosts(data);
      
    case 'get_post_comments':
      return formatPostComments(data);
      
    case 'get_media_insights':
      return formatMediaInsights(data);
      
    default:
      // Generic formatting for unknown endpoints
      return Array.isArray(data) ? data : [data];
  }
}

/**
 * Format campaign list data
 */
function formatCampaignsList(campaigns) {
  if (!Array.isArray(campaigns)) {
    campaigns = [campaigns];
  }
  
  return campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    objective: campaign.objective,
    budget: formatBudget(campaign),
    date_range: {
      start: campaign.start_time,
      end: campaign.stop_time
    }
  }));
}

/**
 * Format ad sets list data
 */
function formatAdSetsList(adSets) {
  if (!Array.isArray(adSets)) {
    adSets = [adSets];
  }
  
  return adSets.map(adSet => ({
    id: adSet.id,
    name: adSet.name,
    status: adSet.status,
    campaign_id: adSet.campaign_id,
    budget: formatBudget(adSet),
    optimization_goal: adSet.optimization_goal,
    targeting_summary: summarizeTargeting(adSet.targeting)
  }));
}

/**
 * Format ads list data
 */
function formatAdsList(ads) {
  if (!Array.isArray(ads)) {
    ads = [ads];
  }
  
  return ads.map(ad => ({
    id: ad.id,
    name: ad.name,
    status: ad.status,
    ad_set_id: ad.adset_id,
    preview_url: ad.preview_url,
    creative_id: ad.creative_id
  }));
}

/**
 * Format insights data
 */
function formatInsights(insights) {
  if (!Array.isArray(insights)) {
    insights = [insights];
  }
  
  return insights.map(insight => {
    // Create base object with common properties
    const formattedInsight = {
      date_start: insight.date_start,
      date_stop: insight.date_stop,
      id: insight.ad_id || insight.adset_id || insight.campaign_id,
      name: insight.ad_name || insight.adset_name || insight.campaign_name,
    };
    
    // Add core metrics if present
    const coreMetrics = ['impressions', 'reach', 'frequency', 'spend', 'clicks'];
    coreMetrics.forEach(metric => {
      if (insight[metric] !== undefined) {
        formattedInsight[metric] = parseNumericValue(insight[metric]);
      }
    });
    
    // Add calculated metrics if present
    const calculatedMetrics = ['ctr', 'cpc', 'cpp', 'cpm'];
    calculatedMetrics.forEach(metric => {
      if (insight[metric] !== undefined) {
        formattedInsight[metric] = parseNumericValue(insight[metric]);
      }
    });
    
    // Add conversion metrics if present
    if (insight.purchases !== undefined) {
      formattedInsight.conversions = {
        purchases: parseNumericValue(insight.purchases),
        purchase_value: parseNumericValue(insight.purchase_value),
        cost_per_purchase: parseNumericValue(insight.cost_per_purchase),
        roas: parseNumericValue(insight.purchase_value) / parseNumericValue(insight.spend)
      };
    }
    
    // Add breakdown dimensions if present
    const breakdownDimensions = ['age', 'gender', 'country', 'region', 'publisher_platform', 'placement', 'device_platform'];
    const breakdowns = {};
    let hasBreakdowns = false;
    
    breakdownDimensions.forEach(dimension => {
      if (insight[dimension] !== undefined) {
        breakdowns[dimension] = insight[dimension];
        hasBreakdowns = true;
      }
    });
    
    if (hasBreakdowns) {
      formattedInsight.breakdowns = breakdowns;
    }
    
    return formattedInsight;
  });
}

/**
 * Format Instagram posts data
 */
function formatInstagramPosts(posts) {
  if (!Array.isArray(posts)) {
    posts = [posts];
  }
  
  return posts.map(post => ({
    id: post.id,
    permalink: post.permalink,
    caption: post.caption,
    media_type: post.media_type,
    media_url: post.media_url,
    timestamp: post.timestamp,
    comments_count: post.comments_count,
    like_count: post.like_count
  }));
}

/**
 * Format post comments
 */
function formatPostComments(comments) {
  if (!Array.isArray(comments)) {
    comments = [comments];
  }
  
  return comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    username: comment.username,
    timestamp: comment.timestamp,
    like_count: comment.like_count,
    replies: comment.replies ? formatPostComments(comment.replies) : []
  }));
}

/**
 * Format media insights
 */
function formatMediaInsights(insights) {
  // Media insights are typically not an array, but an object with metric names
  const formattedInsights = {};
  
  if (insights.data && Array.isArray(insights.data)) {
    insights.data.forEach(metric => {
      formattedInsights[metric.name] = {
        value: parseNumericValue(metric.values[0]?.value),
        period: metric.period,
        title: metric.title
      };
    });
  }
  
  return formattedInsights;
}

/**
 * Helper function to format budget information
 */
function formatBudget(entity) {
  const budget = {};
  
  if (entity.daily_budget) {
    budget.daily = parseFloat(entity.daily_budget) / 100;
  }
  
  if (entity.lifetime_budget) {
    budget.lifetime = parseFloat(entity.lifetime_budget) / 100;
  }
  
  if (entity.budget_remaining) {
    budget.remaining = parseFloat(entity.budget_remaining) / 100;
  }
  
  return budget;
}

/**
 * Helper function to summarize targeting information
 */
function summarizeTargeting(targeting) {
  if (!targeting) return 'No targeting information';
  
  const summary = [];
  
  if (targeting.age_min && targeting.age_max) {
    summary.push(`Age: ${targeting.age_min}-${targeting.age_max}`);
  }
  
  if (targeting.genders && targeting.genders.length > 0) {
    const genderMap = { 1: 'Male', 2: 'Female' };
    const genders = targeting.genders.map(g => genderMap[g] || g).join(', ');
    summary.push(`Gender: ${genders}`);
  }
  
  if (targeting.geo_locations) {
    const countries = targeting.geo_locations.countries;
    if (countries && countries.length > 0) {
      summary.push(`Countries: ${countries.join(', ')}`);
    }
  }
  
  if (targeting.interests && targeting.interests.length > 0) {
    const interestNames = targeting.interests.map(i => i.name).join(', ');
    summary.push(`Interests: ${interestNames}`);
  }
  
  return summary.join(' | ');
}

/**
 * Helper function to parse numeric values
 */
function parseNumericValue(value) {
  if (value === undefined || value === null) return 0;
  
  if (typeof value === 'string') {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  }
  
  return typeof value === 'number' ? value : 0;
}

/**
 * Generate a natural language summary of the data
 */
function generateSummary(data, endpoint, requestType) {
  if (!data || data.length === 0) {
    return `No data found for your request about ${requestType.entity_type || 'Meta Ads'}.`;
  }
  
  let summary = '';
  
  switch (endpoint) {
    case 'lista_campanhas':
      summary = `Found ${data.length} campaign${data.length !== 1 ? 's' : ''}`;
      
      // Include status breakdown
      const campaignStatusCount = countByStatus(data);
      summary += ` (${campaignStatusCount.ACTIVE || 0} active, ${campaignStatusCount.PAUSED || 0} paused, ${campaignStatusCount.ARCHIVED || 0} archived)`;
      break;
      
    case 'lista_ad_sets':
      summary = `Found ${data.length} ad set${data.length !== 1 ? 's' : ''}`;
      
      // Include status breakdown
      const adSetStatusCount = countByStatus(data);
      summary += ` (${adSetStatusCount.ACTIVE || 0} active, ${adSetStatusCount.PAUSED || 0} paused, ${adSetStatusCount.ARCHIVED || 0} archived)`;
      break;
      
    case 'list_ads':
      summary = `Found ${data.length} ad${data.length !== 1 ? 's' : ''}`;
      
      // Include status breakdown
      const adStatusCount = countByStatus(data);
      summary += ` (${adStatusCount.ACTIVE || 0} active, ${adStatusCount.PAUSED || 0} paused, ${adStatusCount.ARCHIVED || 0} archived)`;
      break;
      
    case 'get_campaign_insights':
    case 'get_ad_set_insights':
    case 'get_ad_insights':
      // For insights, summarize key metrics
      const totalSpend = data.reduce((sum, item) => sum + (parseFloat(item.spend) || 0), 0);
      const totalImpressions = data.reduce((sum, item) => sum + (parseInt(item.impressions) || 0), 0);
      const totalClicks = data.reduce((sum, item) => sum + (parseInt(item.clicks) || 0), 0);
      const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      summary = `Performance data shows ${formatCurrency(totalSpend)} spend, ${formatNumber(totalImpressions)} impressions, ${formatNumber(totalClicks)} clicks with an average CTR of ${averageCTR.toFixed(2)}%`;
      
      // Add conversion data if available
      const hasConversions = data.some(item => item.conversions && item.conversions.purchases);
      if (hasConversions) {
        const totalPurchases = data.reduce((sum, item) => sum + (item.conversions ? (parseInt(item.conversions.purchases) || 0) : 0), 0);
        const totalRevenue = data.reduce((sum, item) => sum + (item.conversions ? (parseFloat(item.conversions.purchase_value) || 0) : 0), 0);
        const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        
        summary += `, resulting in ${formatNumber(totalPurchases)} purchases with ${formatCurrency(totalRevenue)} revenue (ROAS: ${overallROAS.toFixed(2)}x)`;
      }
      break;
      
    case 'get_ig_posts':
      summary = `Found ${data.length} Instagram post${data.length !== 1 ? 's' : ''}`;
      break;
      
    case 'get_post_comments':
      summary = `Found ${data.length} comment${data.length !== 1 ? 's' : ''} on the post`;
      break;
      
    case 'get_media_insights':
      // Format based on available insights
      const insightMetrics = Object.keys(data);
      summary = `Media insights available for ${insightMetrics.length} metrics including: ${insightMetrics.slice(0, 3).join(', ')}${insightMetrics.length > 3 ? '...' : ''}`;
      break;
      
    default:
      summary = `Retrieved ${data.length} record${data.length !== 1 ? 's' : ''} from the ${endpoint} endpoint`;
  }
  
  const period = requestType.time_period;
  if (period && period.start_date && period.end_date) {
    summary += ` for the period ${period.start_date} to ${period.end_date}`;
  }
  
  return summary;
}

/**
 * Helper function to count items by status
 */
function countByStatus(items) {
  return items.reduce((counts, item) => {
    const status = item.status || 'UNKNOWN';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

/**
 * Helper function to format currency values
 */
function formatCurrency(value, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Helper function to format large numbers
 */
function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

// Execute the function and return the result
return buildResponse(); 