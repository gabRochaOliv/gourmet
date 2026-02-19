import os
from PIL import Image
import re

def optimize_images(directory, max_width=800, quality=80):
    image_extensions = {'.png', '.jpg', '.jpeg'}
    results = {}
    
    print(f"Scanning {directory}...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in image_extensions:
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        # Convert to RGB if needed
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGBA') # Keep alpha for pngs
                        
                        # Resize if too large
                        width, height = img.size
                        if width > max_width:
                            ratio = max_width / width
                            new_height = int(height * ratio)
                            img = img.resize((max_width, new_height), Image.LANCZOS)
                            print(f"Resized {file}: {width}x{height} -> {max_width}x{new_height}")
                        else:
                            print(f"Skipped resizing {file}: {width}x{height}")
                        
                        # Save as WebP
                        new_file_path = os.path.splitext(file_path)[0] + ".webp"
                        img.save(new_file_path, "WEBP", quality=quality, optimize=True)
                        
                        # Store dimensions for HTML update
                        results[file] = {
                            "original": file,
                            "webp": os.path.basename(new_file_path),
                            "width": img.width,
                            "height": img.height
                        }
                        print(f"Saved {new_file_path}")
                        
                except Exception as e:
                    print(f"Error processing {file}: {e}")
    return results

def minify_css(input_path, output_path):
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            css = f.read()
            
        # Remove comments
        css = re.sub(r'/\*[\s\S]*?\*/', '', css)
        # Remove whitespace
        css = re.sub(r'\s+', ' ', css)
        css = re.sub(r'\s*([:;{}])\s*', r'\1', css)
        css = css.replace(';}', '}')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(css)
            
        print(f"Minified CSS saved to {output_path}")
    except Exception as e:
        print(f"Error minifying CSS: {e}")

if __name__ == "__main__":
    base_dir = r"z:\Arquivos Marketing Digital\GELADINHO GOURMET\Site-Geladinho"
    img_dir = os.path.join(base_dir, "img")
    css_path = os.path.join(base_dir, "styles.css")
    min_css_path = os.path.join(base_dir, "styles.min.css")

    # Optimize Images
    img_data = optimize_images(img_dir)
    
    # Minify CSS
    minify_css(css_path, min_css_path)
    
    # Print data for Agent to use
    print("\n--- IMAGE DATA START ---")
    for original, data in img_data.items():
        print(f"{original}|{data['webp']}|{data['width']}|{data['height']}")
    print("--- IMAGE DATA END ---")
