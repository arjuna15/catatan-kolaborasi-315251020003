import json
import requests
import time
import re

TMDB_API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb"
CATALOG_PATH = "anime_catalog.json"

def clean_title(title):
    # Remove things like " S5", " (Episode 1 - 12)", " [Batch]"
    t = re.sub(r'\(.*?\)', '', title)
    t = re.sub(r'\[.*?\]', '', t)
    t = re.sub(r' S\d+', '', t)
    t = t.replace('Batch', '')
    return t.strip()

def search_tmdb(title):
    cleaned = clean_title(title)
    try:
        url = f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={cleaned}&language=id-ID"
        resp = requests.get(url)
        data = resp.json()
        if data.get("results"):
            for res in data["results"]:
                if (res.get("media_type") == "tv" or res.get("media_type") == "movie") and ("ja" in res.get("original_language", "") or 16 in res.get("genre_ids", [])):
                    return res.get("id"), "https://image.tmdb.org/t/p/w500" + res.get("poster_path", "")
    except Exception as e:
        print(f"Error searching {title}: {e}")
    return None, None

def update_catalog():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)
        
    updated_count = 0
    for item in catalog:
        if item.get("id", 0) > 900000 and not item.get("direct_embeds"):
            print(f"Fixing ID for: {item['title']} (Current: {item['id']})")
            real_id, poster = search_tmdb(item["title"])
            if real_id:
                item["id"] = real_id
                if poster and "image.tmdb" in poster and poster != "https://image.tmdb.org/t/p/w500":
                    item["poster_path"] = poster
                    item["backdrop_path"] = poster.replace("w500", "original")
                print(f"  -> Found real ID: {real_id}")
                updated_count += 1
            else:
                print(f"  -> Could not find real ID")
            time.sleep(0.3)

    if updated_count > 0:
        with open(CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog, f, ensure_ascii=False, indent=4)
        print(f"Successfully updated {updated_count} TMDB IDs.")
    else:
        print("No TMDB IDs needed updating or found.")

if __name__ == "__main__":
    update_catalog()
