#!/usr/bin/env python3
"""Build a Meta Commerce Manager catalog feed (for the WhatsApp Business app)
from the live MerlinMarina website catalog.

Source: data/products.json of the merlinmarina site repo (the same file the
admin dashboard edits). Images and product links point at the GitHub Pages
site, so Meta can fetch them publicly.

Only products that are active AND in stock are included.

Usage:
    python3 scripts/build_whatsapp_feed.py                       # whole catalog
    python3 scripts/build_whatsapp_feed.py --category "Aqua Filters" --limit 5
    python3 scripts/build_whatsapp_feed.py --ids id1,id2,id3
    python3 scripts/build_whatsapp_feed.py --source https://merlinmarina.github.io/data/products.json

Output: whatsapp_feed.csv (repo root). The GitHub Action
.github/workflows/whatsapp-feed.yml rebuilds and commits it whenever
data/products.json changes; Commerce Manager reads it as a scheduled feed from
https://raw.githubusercontent.com/merlinmarina/merlinmarina.github.io/main/whatsapp_feed.csv
"""

import argparse
import csv
import json
import os
import re
import sys
import urllib.request
from urllib.parse import quote

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://merlinmarina.github.io"
DEFAULT_SOURCE = os.path.join(BASE, "data", "products.json")

FIELDS = ["id", "title", "description", "availability", "condition", "price",
          "sale_price", "link", "image_link", "additional_image_link",
          "brand", "product_type", "google_product_category"]

BRANDS = ["SunSun", "Sobo", "Bluepet", "Venus Aqua", "Jeneca", "Boyu",
          "Qanvee", "Liny", "Cherlam", "Dophin", "Kuku", "Xinjian", "Muter",
          "Maxspect", "Bubble Magus", "Nepall", "Peqon", "Stori", "Taiyo",
          "Tetra", "Optimum", "Hikari", "Seachem", "Chihiros"]

PET_CAT = "Animals & Pet Supplies > Pet Supplies"
GOOGLE_CATEGORY = {"Birds": PET_CAT + " > Bird Supplies"}  # rest: fish


def load(source):
    if source.startswith("http"):
        with urllib.request.urlopen(source) as r:
            return json.load(r)["products"]
    with open(source) as f:
        return json.load(f)["products"]


def brand_of(name):
    low = name.lower()
    for b in BRANDS:
        if re.search(r"\b" + re.escape(b.lower()) + r"\b", low):
            return b
    return "MerlinMarina"


def abs_url(path):
    return path if path.startswith("http") else f"{SITE}/{quote(path)}"


def money(v):
    return f"{float(v):.2f} INR"


def to_row(p):
    images = [abs_url(i) for i in (p.get("images") or [p["image"]]) if i]
    price, mrp = float(p["price"]), float(p.get("originalPrice") or 0)
    on_sale = mrp > price
    title = re.sub(r"\s+", " ", p["name"]).strip()
    return {
        "id": p["id"],
        "title": title[:150],
        "description": (p.get("description") or title)[:9999],
        "availability": "in stock",
        "condition": "new",
        "price": money(mrp if on_sale else price),
        "sale_price": money(price) if on_sale else "",
        "link": f"{SITE}/products.html?cat={quote(p['category'])}",
        "image_link": images[0],
        "additional_image_link": ",".join(images[1:11]),
        "brand": brand_of(title),
        "product_type": p["category"],
        "google_product_category": GOOGLE_CATEGORY.get(
            p["category"], PET_CAT + " > Fish Supplies"),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default=DEFAULT_SOURCE)
    ap.add_argument("--category", action="append",
                    help="repeatable; default = all categories")
    ap.add_argument("--ids", help="comma-separated product ids")
    ap.add_argument("--limit", type=int, help="max products per category")
    ap.add_argument("--out", default=os.path.join(BASE, "whatsapp_feed.csv"))
    ap.add_argument("--check-images", action="store_true",
                    help="HEAD-request every image URL and drop broken ones")
    a = ap.parse_args()

    products = [p for p in load(a.source)
                if p.get("active") and p.get("stock") == "in"
                and p.get("image") and p.get("price")]
    if a.ids:
        wanted = {i.strip() for i in a.ids.split(",")}
        products = [p for p in products if p["id"] in wanted]
    if a.category:
        products = [p for p in products if p["category"] in a.category]
    if a.limit:
        per_cat = {}
        products = [p for p in products
                    if per_cat.setdefault(p["category"], []).append(1)
                    or len(per_cat[p["category"]]) <= a.limit]

    rows = [to_row(p) for p in products]

    if a.check_images:
        ok_rows = []
        for r in rows:
            try:
                req = urllib.request.Request(r["image_link"], method="HEAD")
                urllib.request.urlopen(req, timeout=15)
                ok_rows.append(r)
            except Exception as e:
                print(f"  dropped {r['id']}: image {e}")
        rows = ok_rows

    if not rows:
        sys.exit("No products matched.")
    leaked = [r["id"] for r in rows
              if "petkadai" in json.dumps(r).lower()]
    if leaked:
        sys.exit(f"petkadai text found in: {leaked}")

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    print(f"Wrote {len(rows)} products -> {a.out}")
    for r in rows:
        print(f"  {r['id'][:55]:55s} {r['price']:>12s} {r['sale_price']:>12s}")


if __name__ == "__main__":
    main()
