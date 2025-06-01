import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []

    # Read CSV and convert to list of dictionaries
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)

    # Write list of dictionaries to JSON
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"✅ Converted '{csv_file_path}' to '{json_file_path}' successfully.")

# Example usage
csv_to_json('./data/Courses3.csv', './data/LS_Courses3.json')
