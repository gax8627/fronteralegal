#!/usr/bin/env python3
"""
Collect last-7-days traffic data from GSC and GA4.
Saves results to traffic_data.json in this folder.

Run with:
  python3 "/Users/gax8627/Legal Guide/collect_traffic_data.py"
"""
import json, os
from datetime import date, timedelta

import google.oauth2.credentials
from googleapiclient.discovery import build

CREDS_PATH = os.path.expanduser("~/.config/gcloud/application_default_credentials.json")
SITE_URL   = "https://www.guiafederal.net/"
OUT_PATH   = os.path.join(os.path.dirname(__file__), "traffic_data.json")

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/cloud-platform",
]

end   = date.today() - timedelta(days=1)
start = end - timedelta(days=6)
s, e  = start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")

print(f"Date range: {s} → {e}")
print("Loading credentials …")
with open(CREDS_PATH) as f:
    info = json.load(f)
creds = google.oauth2.credentials.Credentials.from_authorized_user_info(info, scopes=SCOPES)

gsc = build("webmasters", "v3", credentials=creds)

def gsc_query(dimensions, row_limit=15):
    resp = gsc.searchanalytics().query(siteUrl=SITE_URL, body={
        "startDate": s, "endDate": e,
        "dimensions": dimensions, "rowLimit": row_limit
    }).execute()
    return resp.get("rows", [])

print("Fetching GSC data …")
data = {
    "date_range": {"start": s, "end": e},
    "gsc": {
        "by_date":    gsc_query(["date"], 7),
        "top_queries": gsc_query(["query"], 20),
        "top_pages":   gsc_query(["page"], 10),
        "by_device":   gsc_query(["device"], 5),
        "by_country":  gsc_query(["country"], 10),
    }
}

# Totals
totals = {"clicks": 0, "impressions": 0}
for row in data["gsc"]["by_date"]:
    totals["clicks"]      += row.get("clicks", 0)
    totals["impressions"] += row.get("impressions", 0)
if data["gsc"]["by_date"]:
    n = len(data["gsc"]["by_date"])
    totals["avg_ctr"]      = round(totals["clicks"] / totals["impressions"] * 100, 2) if totals["impressions"] else 0
    totals["avg_position"] = round(sum(r.get("position", 0) for r in data["gsc"]["by_date"]) / n, 1)
data["gsc"]["totals"] = totals

# GA4 via REST (Data API v1beta)
print("Fetching GA4 data …")
try:
    import requests
    from google.auth.transport.requests import Request
    creds.refresh(Request())
    token = creds.token
    GA4_PROPERTY = "476727852"   # update if different
    url = f"https://analyticsdata.googleapis.com/v1beta/properties/{GA4_PROPERTY}:runReport"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    def ga4_report(dimensions, metrics, order_by=None, limit=10):
        body = {
            "dateRanges": [{"startDate": s, "endDate": e}],
            "dimensions": [{"name": d} for d in dimensions],
            "metrics":    [{"name": m} for m in metrics],
            "limit": limit,
        }
        if order_by:
            body["orderBys"] = order_by
        r = requests.post(url, headers=headers, json=body)
        return r.json()

    overview_raw = ga4_report(
        dimensions=["date"],
        metrics=["sessions", "totalUsers", "newUsers", "bounceRate", "averageSessionDuration", "screenPageViews"],
        order_by=[{"dimension": {"dimensionName": "date"}}],
        limit=7
    )
    sources_raw = ga4_report(
        dimensions=["sessionDefaultChannelGroup"],
        metrics=["sessions", "totalUsers"],
        order_by=[{"metric": {"metricName": "sessions"}, "desc": True}],
        limit=10
    )
    pages_raw = ga4_report(
        dimensions=["pagePath", "pageTitle"],
        metrics=["screenPageViews", "sessions", "bounceRate", "averageSessionDuration"],
        order_by=[{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        limit=15
    )
    countries_raw = ga4_report(
        dimensions=["country"],
        metrics=["sessions", "totalUsers"],
        order_by=[{"metric": {"metricName": "sessions"}, "desc": True}],
        limit=10
    )

    def parse(raw):
        rows = raw.get("rows", [])
        dim_headers = [h["name"] for h in raw.get("dimensionHeaders", [])]
        met_headers = [h["name"] for h in raw.get("metricHeaders", [])]
        out = []
        for row in rows:
            r = {}
            for i, v in enumerate(row.get("dimensionValues", [])):
                r[dim_headers[i]] = v["value"]
            for i, v in enumerate(row.get("metricValues", [])):
                r[met_headers[i]] = v["value"]
            out.append(r)
        return out

    data["ga4"] = {
        "by_date":   parse(overview_raw),
        "by_channel": parse(sources_raw),
        "top_pages":  parse(pages_raw),
        "by_country": parse(countries_raw),
        "error": None
    }
    # Aggregate totals
    ga4_totals = {"sessions": 0, "users": 0, "pageviews": 0}
    for row in data["ga4"]["by_date"]:
        ga4_totals["sessions"]  += int(row.get("sessions", 0))
        ga4_totals["users"]     += int(row.get("totalUsers", 0))
        ga4_totals["pageviews"] += int(row.get("screenPageViews", 0))
    data["ga4"]["totals"] = ga4_totals
    print("GA4 OK")
except Exception as ex:
    print(f"GA4 error: {ex}")
    data["ga4"] = {"error": str(ex)}

with open(OUT_PATH, "w") as f:
    json.dump(data, f, indent=2)

print(f"\n✅ Done — data saved to: {OUT_PATH}")
print(f"   GSC clicks:  {data['gsc']['totals']['clicks']}")
print(f"   GSC impressions: {data['gsc']['totals']['impressions']}")
if "totals" in data.get("ga4", {}):
    print(f"   GA4 sessions: {data['ga4']['totals']['sessions']}")
