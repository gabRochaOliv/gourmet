import os
import json
from PIL import Image

def map_images(directory):
    results = {}
    print(f"Scanning {directory}...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".webp"):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        # logical path for html relative to index.html
                        # assuming index.html is in z:\Arquivos Marketing Digital\GELADINHO GOURMET\Site-Geladinho
                        # and img is in img/
                        rel_path = os.path.relpath(file_path, r"z:\Arquivos Marketing Digital\GELADINHO GOURMET\Site-Geladinho")
                        # original assumed to be .png or .jpg
                        original_base = os.path.splitext(file)[0]
                        
                        # Find original extension
                        original_filename = None
                        for ext in ['.png', '.jpg', '.jpeg']:
                             if os.path.exists(os.path.join(root, original_base + ext)):
                                 original_filename = original_base + ext
                                 break
                        
                        if original_filename:
                             original_rel_path = os.path.relpath(os.path.join(root, original_filename), r"z:\Arquivos Marketing Digital\GELADINHO GOURMET\Site-Geladinho")
                             # Normalize slashes
                             original_rel_path = original_rel_path.replace("\\", "/")
                             rel_path = rel_path.replace("\\", "/")
                             
                             results[original_rel_path] = {
                                 "webp_path": rel_path,
                                 "width": img.width,
                                 "height": img.height
                             }
                except Exception as e:
                    print(f"Error: {e}")
    
    with open("assets_map.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    base_dir = r"z:\Arquivos Marketing Digital\GELADINHO GOURMET\Site-Geladinho\img"
    map_images(base_dir)
