import json

CATALOG_PATH = "anime_catalog.json"

fixes = {
    "Kanojo, Okarishimasu S5": {
        "poster_path": "https://image.tmdb.org/t/p/w500/8X5gR1V92aB1q58wR18WfE9f291.jpg", # Rent a Girlfriend poster
        "id": 103756
    },
    "Kimi ga Shinu made Koi wo Shitai": {
        "poster_path": "https://upload.wikimedia.org/wikipedia/en/2/23/Kimi_ga_Shinu_Made_Koi_wo_Shitai_volume_1_cover.jpg"
    },
    "Lv999 no Murabito": {
        "poster_path": "https://m.media-amazon.com/images/I/81+21rWn8lL._AC_UF1000,1000_QL80_.jpg"
    },
    "Tomb Raider King": {
        "poster_path": "https://upload.wikimedia.org/wikipedia/en/5/52/Tomb_Raider_King_volume_1_cover.jpg"
    }
}

with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

for item in catalog:
    for title_key, data in fixes.items():
        if title_key.lower() in item["title"].lower():
            item["poster_path"] = data["poster_path"]
            item["backdrop_path"] = data["poster_path"]
            if "id" in data:
                item["id"] = data["id"]
            print(f"Fixed {item['title']}")

with open(CATALOG_PATH, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=4)
print("Done")
