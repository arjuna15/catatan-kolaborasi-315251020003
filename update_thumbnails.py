import json
import requests
import time

TMDB_API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb"
CATALOG_PATH = "anime_catalog.json"

def search_tmdb(title):
    try:
        url = f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={title}&language=id-ID"
        resp = requests.get(url)
        data = resp.json()
        if data.get("results"):
            for res in data["results"]:
                if res.get("poster_path"):
                    return "https://image.tmdb.org/t/p/w500" + res["poster_path"], res.get("id")
    except Exception as e:
        print(f"Error searching {title}: {e}")
    return None, None

def update_catalog():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)
        
    titles_to_fix = [
        "Kimi ga Shinu made",
        "Kanojo, Okarishimasu",
        "LV999 no Murabito",
        "Tomb Raider King"
    ]
    
    updated_count = 0
    for item in catalog:
        for t in titles_to_fix:
            if t.lower() in item["title"].lower():
                print(f"Checking {item['title']}...")
                if "otakudesu" in item.get("poster_path", "").lower() or "samehadaku" in item.get("poster_path", "").lower():
                    print(f"Needs fix: {item['title']}")
                    poster, tmdb_id = search_tmdb(t)
                    if poster:
                        item["poster_path"] = poster
                        item["backdrop_path"] = poster.replace("w500", "original")
                        if tmdb_id:
                            item["id"] = tmdb_id
                        print(f"Fixed {item['title']} -> {poster}")
                        updated_count += 1
                    else:
                        print(f"No TMDB poster found for {t}")
                    time.sleep(0.5)

    if updated_count > 0:
        with open(CATALOG_PATH, "w", encoding="utf-8") as f:
            json.dump(catalog, f, ensure_ascii=False, indent=4)
        print(f"Successfully updated {updated_count} thumbnails.")
    else:
        print("No thumbnails needed updating or found.")

if __name__ == "__main__":
    update_catalog()
