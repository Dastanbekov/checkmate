import os
import urllib.request

urls = {
    'wK': 'https://lichess1.org/assets/piece/cburnett/wK.svg',
    'wQ': 'https://lichess1.org/assets/piece/cburnett/wQ.svg',
    'wR': 'https://lichess1.org/assets/piece/cburnett/wR.svg',
    'wB': 'https://lichess1.org/assets/piece/cburnett/wB.svg',
    'wN': 'https://lichess1.org/assets/piece/cburnett/wN.svg',
    'wP': 'https://lichess1.org/assets/piece/cburnett/wP.svg',
    'bK': 'https://lichess1.org/assets/piece/cburnett/bK.svg',
    'bQ': 'https://lichess1.org/assets/piece/cburnett/bQ.svg',
    'bR': 'https://lichess1.org/assets/piece/cburnett/bR.svg',
    'bB': 'https://lichess1.org/assets/piece/cburnett/bB.svg',
    'bN': 'https://lichess1.org/assets/piece/cburnett/bN.svg',
    'bP': 'https://lichess1.org/assets/piece/cburnett/bP.svg',
}

base_dir = r"c:\Users\ASUS\Desktop\projects\chess\frontend\public\pieces"
os.makedirs(base_dir, exist_ok=True)

for name, url in urls.items():
    file_path = os.path.join(base_dir, f"{name}.svg")
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            svg_data = response.read()
            with open(file_path, 'wb') as f:
                f.write(svg_data)
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("Done.")
