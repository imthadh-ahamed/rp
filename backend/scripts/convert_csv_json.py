import pandas as pd
import os
import json

# Define paths
raw_dir = r'c:\Users\AImthadh\Desktop\New folder\rp\backend\data\raw'
output_dir = raw_dir # User requested output in raw directory

# Files to convert
files = [
    "CourseData.csv",
]

def convert_csv_to_json(filename):
    csv_path = os.path.join(raw_dir, filename)
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return

    try:
        print(f"Converting {filename}...")
        # Read CSV
        df = pd.read_csv(csv_path)
        
        # Define JSON filename
        json_filename = os.path.splitext(filename)[0] + ".json"
        json_path = os.path.join(output_dir, json_filename)
        
        # Save to JSON
        df.to_json(json_path, orient='records', indent=4)
        print(f"Successfully created {json_path}")
        
    except Exception as e:
        print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    for file in files:
        convert_csv_to_json(file)
