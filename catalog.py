import requests
import json

TITLE_ID = "95378"
SECRET_KEY = "HPXPNT1CD4BOBGK9BYWHMDEU1EW69FU89F5Q84QM45JAD9CRAC"
CATALOG_VERSION = "DLC"
OUTPUT_FILE = f"{TITLE_ID}_dlc.json"

url = f"https://{TITLE_ID}.playfabapi.com/Admin/GetCatalogItems"
headers = {
    "Content-Type": "application/json",
    "X-SecretKey": SECRET_KEY
}
payload = {
    "CatalogVersion": CATALOG_VERSION
}

response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    catalog_data = response.json()["data"]["Catalog"]

    # Save to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, indent=2)
    
    print(f"✅ Catalog saved to {OUTPUT_FILE}")
else:
    print(f"❌ Failed to get catalog: {response.status_code}")
    print(response.text)
