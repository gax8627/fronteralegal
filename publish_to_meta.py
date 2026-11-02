#!/usr/bin/env python3
"""
=============================================================================
META PUBLISHER (Instagram Graph API & Facebook Pages API)
=============================================================================
Automates publishing viral educational posts to Instagram and Facebook
for Guía Federal.

Usage examples:
  python3 publish_to_meta.py --list
  python3 publish_to_meta.py --view 1
  python3 publish_to_meta.py --test
  python3 publish_to_meta.py --post 1 --dry-run
  python3 publish_to_meta.py --post 1 --target both
  python3 publish_to_meta.py --post 1 --target instagram
  python3 publish_to_meta.py --post 1 --target facebook
=============================================================================
"""

import sys
import os
import json
import argparse
import time
import urllib.request
import urllib.parse
import urllib.error

POSTS_FILE = os.path.join(os.path.dirname(__file__), "social_posts.json")
ENV_FILE = os.path.join(os.path.dirname(__file__), ".env")


def load_env(env_path):
    """Simple .env loader without external dependencies."""
    config = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                config[key.strip()] = val.strip().strip("'").strip('"')
    # Environment variables override .env
    for k in ["META_ACCESS_TOKEN", "META_PAGE_ID", "INSTAGRAM_ACCOUNT_ID", "META_GRAPH_VERSION"]:
        if os.environ.get(k):
            config[k] = os.environ[k]
    return config


def load_posts():
    if not os.path.exists(POSTS_FILE):
        print(f"❌ Error: Posts file not found at {POSTS_FILE}")
        sys.exit(1)
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def api_request(url, data=None, method="GET"):
    """Performs HTTP request with JSON parsing and error handling."""
    headers = {"User-Agent": "GuiaFederal-MetaPublisher/1.0"}
    encoded_data = None
    if data:
        encoded_data = urllib.parse.urlencode(data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"

    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
            err_msg = err_json.get("error", {}).get("message", err_body)
            err_type = err_json.get("error", {}).get("type", "HTTPError")
            err_code = err_json.get("error", {}).get("code", e.code)
            print(f"\n❌ Meta API Error [{err_type} - Code {err_code}]: {err_msg}")
        except Exception:
            print(f"\n❌ HTTP Error {e.code}: {err_body}")
        return None
    except Exception as e:
        print(f"\n❌ Connection Error: {e}")
        return None


def cmd_list(posts):
    print("=" * 80)
    print("📱 GUÍA FEDERAL — 15 VIRAL SOCIAL MEDIA POSTS")
    print("=" * 80)
    print(f"{'ID':<4} {'TOPIC':<30} {'TITLE':<42}")
    print("-" * 80)
    for p in posts:
        print(f"{p['id']:<4} {p['topic']:<30} {p['title'][:40]:<42}")
    print("-" * 80)
    print("Use: python3 publish_to_meta.py --view <id>    (to inspect copy)")
    print("Use: python3 publish_to_meta.py --post <id>    (to publish)")


def cmd_view(posts, post_id):
    post = next((p for p in posts if p["id"] == post_id), None)
    if not post:
        print(f"❌ Post #{post_id} not found (Valid IDs: 1 to {len(posts)})")
        return
    print("=" * 80)
    print(f"POST #{post['id']} — {post['title']}")
    print(f"Topic: {post['topic']}")
    print(f"Image URL: {post['image_url']}")
    print(f"Blog URL:  {post['blog_url']}")
    print("=" * 80)
    print("\n[CAPTION / COPY]:\n")
    print(post["caption"])
    print("=" * 80)


def cmd_test(config):
    token = config.get("META_ACCESS_TOKEN")
    page_id = config.get("META_PAGE_ID")
    ig_id = config.get("INSTAGRAM_ACCOUNT_ID")
    version = config.get("META_GRAPH_VERSION", "v21.0")

    print("\n🔍 TESTING META API CREDENTIALS...\n")
    if not token or "your_long_lived_token" in token:
        print("❌ Missing META_ACCESS_TOKEN in .env file.")
        print("   Copy .env.example to .env and insert your token.")
        return False

    # 1. Test User / Token Identity
    print("1. Checking Token Validity & Permissions...")
    url = f"https://graph.facebook.com/{version}/me?fields=id,name&access_token={token}"
    me = api_request(url)
    if not me:
        return False
    print(f"   ✅ Token is valid! Connected as: {me.get('name')} (ID: {me.get('id')})")

    # 2. Test Facebook Page Access
    if page_id and page_id != "123456789012345":
        print(f"\n2. Verifying Facebook Page ID: {page_id}...")
        url = f"https://graph.facebook.com/{version}/{page_id}?fields=id,name,link&access_token={token}"
        page = api_request(url)
        if page:
            print(f"   ✅ Facebook Page: {page.get('name')} ({page.get('link', '')})")
    else:
        print("\n⚠️ No META_PAGE_ID configured in .env.")

    # 3. Test Instagram Account Access
    if ig_id and ig_id != "987654321098765":
        print(f"\n3. Verifying Instagram Business Account ID: {ig_id}...")
        url = f"https://graph.facebook.com/{version}/{ig_id}?fields=id,username,name&access_token={token}"
        ig = api_request(url)
        if ig:
            print(f"   ✅ Instagram Account: @{ig.get('username')} ({ig.get('name', '')})")
    else:
        print("\n⚠️ No INSTAGRAM_ACCOUNT_ID configured in .env.")

    print("\n🎉 Configuration test complete!\n")
    return True


def publish_instagram(config, post, dry_run=False):
    token = config.get("META_ACCESS_TOKEN")
    ig_id = config.get("INSTAGRAM_ACCOUNT_ID")
    version = config.get("META_GRAPH_VERSION", "v21.0")

    if not ig_id or ig_id == "987654321098765":
        print("❌ INSTAGRAM_ACCOUNT_ID is not configured in .env")
        return False

    print(f"\n📸 [INSTAGRAM] Preparing to publish Post #{post['id']}...")
    print(f"   Image URL: {post['image_url']}")

    if dry_run:
        print("   [DRY RUN] Would create container on Instagram and publish. Skipping API call.")
        return True

    # Step 1: Create Container
    print("   Step 1: Creating media container on Instagram...")
    container_url = f"https://graph.facebook.com/{version}/{ig_id}/media"
    container_data = {
        "image_url": post["image_url"],
        "caption": post["caption"],
        "access_token": token
    }
    resp = api_request(container_url, data=container_data, method="POST")
    if not resp or "id" not in resp:
        print("❌ Failed to create Instagram media container.")
        return False

    creation_id = resp["id"]
    print(f"   ✅ Container created (ID: {creation_id})")

    # Step 2: Poll container status
    print("   Step 2: Checking media processing status...")
    for _ in range(10):
        time.sleep(2)
        status_url = f"https://graph.facebook.com/{version}/{creation_id}?fields=status_code&access_token={token}"
        status_resp = api_request(status_url)
        if status_resp and status_resp.get("status_code") == "FINISHED":
            print("   ✅ Media processed and ready.")
            break
        elif status_resp and status_resp.get("status_code") == "ERROR":
            print(f"❌ Media processing error: {status_resp}")
            return False

    # Step 3: Publish container
    print("   Step 3: Publishing media to Instagram feed...")
    publish_url = f"https://graph.facebook.com/{version}/{ig_id}/media_publish"
    publish_data = {
        "creation_id": creation_id,
        "access_token": token
    }
    pub_resp = api_request(publish_url, data=publish_data, method="POST")
    if pub_resp and "id" in pub_resp:
        print(f"   🎉 SUCCESS! Post #{post['id']} published to Instagram (Media ID: {pub_resp['id']})")
        return True
    else:
        print("❌ Failed to publish container to Instagram feed.")
        return False


def publish_facebook(config, post, dry_run=False):
    token = config.get("META_ACCESS_TOKEN")
    page_id = config.get("META_PAGE_ID")
    version = config.get("META_GRAPH_VERSION", "v21.0")

    if not page_id or page_id == "123456789012345":
        print("❌ META_PAGE_ID is not configured in .env")
        return False

    print(f"\n📘 [FACEBOOK] Preparing to publish Post #{post['id']}...")
    print(f"   Image URL: {post['image_url']}")

    if dry_run:
        print("   [DRY RUN] Would post photo + caption to Facebook Page. Skipping API call.")
        return True

    # Publish photo to Facebook Page
    fb_url = f"https://graph.facebook.com/{version}/{page_id}/photos"
    fb_data = {
        "url": post["image_url"],
        "caption": post["caption"],
        "access_token": token
    }
    resp = api_request(fb_url, data=fb_data, method="POST")
    if resp and "id" in resp:
        print(f"   🎉 SUCCESS! Post #{post['id']} published to Facebook Page (Post ID: {resp['id']})")
        return True
    else:
        print("❌ Failed to publish to Facebook Page.")
        return False


def main():
    parser = argparse.ArgumentParser(description="Meta Publisher for Guía Federal Social Campaigns")
    parser.add_argument("--list", action="store_true", help="List all 15 campaign posts")
    parser.add_argument("--view", type=int, help="Inspect full caption of a specific post ID (1-15)")
    parser.add_argument("--test", action="store_true", help="Test credentials and connection to Meta Graph API")
    parser.add_argument("--post", type=int, help="Post ID to publish (1 to 15)")
    parser.add_argument("--target", choices=["instagram", "facebook", "both"], default="both", help="Publish target (default: both)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate execution without calling Meta publish APIs")

    args = parser.parse_args()
    posts = load_posts()
    config = load_env(ENV_FILE)

    if args.list or (len(sys.argv) == 1):
        cmd_list(posts)
        return

    if args.view:
        cmd_view(posts, args.view)
        return

    if args.test:
        cmd_test(config)
        return

    if args.post:
        post = next((p for p in posts if p["id"] == args.post), None)
        if not post:
            print(f"❌ Invalid post ID #{args.post}. Choose between 1 and {len(posts)}.")
            return

        print(f"🚀 Selected Post #{post['id']}: {post['title']}")
        print(f"   Target: {args.target.upper()}")
        print(f"   Dry Run: {args.dry_run}")

        # Check image availability
        print(f"   Verifying image availability at: {post['image_url']}...")
        try:
            req = urllib.request.Request(post["image_url"], headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
            with urllib.request.urlopen(req, timeout=10) as r:
                print(f"   ✅ Image is live and public (HTTP {r.status}, Content-Type: {r.headers.get('Content-Type')})")
        except Exception as e:
            print(f"   ⚠️ Warning: Image check failed ({e}). Instagram requires a publicly reachable URL.")

        if args.target in ["instagram", "both"]:
            publish_instagram(config, post, dry_run=args.dry_run)

        if args.target in ["facebook", "both"]:
            publish_facebook(config, post, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
