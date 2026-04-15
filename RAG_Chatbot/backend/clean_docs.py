import os
import re
from pathlib import Path

# Path to your Data directory
DATA_DIR = Path("/Users/hammadmasud/Work 1/Work/ML Portfolio Projects/Data")

def clean_file(file_path):
    """Removes Markdown headers and bold symbols from a file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 1. Remove #, ##, ###, etc. from start of lines
        content = re.sub(r'^#+\s*', '', content, flags=re.MULTILINE)
        
        # 2. Remove ** (bold symbols)
        content = content.replace("**", "")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned: {file_path}")
    except Exception as e:
        print(f"Failed to clean {file_path}: {e}")

def main():
    if not DATA_DIR.exists():
        print(f"Data directory not found at: {DATA_DIR}")
        return

    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                clean_file(Path(root) / file)

if __name__ == "__main__":
    main()
