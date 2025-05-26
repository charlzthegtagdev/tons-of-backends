import requests
import re

def get_latest_cloudscript_revision(title_id, secret_key):
    cloudscript_url = f"https://{title_id}.playfabapi.com/Admin/GetCloudScriptRevision"

    headers = {
        "Content-Type": "application/json",
        "X-SecretKey": secret_key
    }

    payload = {
        "Version": -1
    }

    try:
        response = requests.post(cloudscript_url, headers=headers, json=payload)
        response.raise_for_status()

        response_json = response.json()
        print("API Response:", response_json)

        if "data" in response_json and "Files" in response_json["data"]:
            files = response_json["data"]["Files"]

            if isinstance(files, list) and files:
                main_script = next((file for file in files if file.get("Filename") == "main.js"), None)

                if main_script:
                    cloudscript_content = main_script.get("FileContents")
                    cloudscript_content = re.sub(r"\\n", "\n", cloudscript_content)
                    cloudscript_content = re.sub(r"\\r", "\r", cloudscript_content)
                    print(cloudscript_content)
                    return cloudscript_content
                else:
                    print("Main CloudScript file 'main.js' not found.")
            else:
                print("Invalid 'Files' data format.")
        else:
            print("Failed to fetch CloudScript revision. Response:", response.text)

    except requests.exceptions.RequestException as e:
        print("Error making the API call:", e)
    except requests.exceptions.HTTPError as e:
        print("HTTP Error:", e)
    except requests.exceptions.JSONDecodeError as e:
        print("Error decoding JSON response:", e)

    return None

def save_cloudscript_to_file(title_id, script_contents):
    if script_contents:
        filename = f"{title_id}.js"
        with open(filename, "w") as file:
            file.write(script_contents)
        print(f"CloudScript revision saved to {filename}")

if __name__ == "__main__":
    title_id = ""
    secret_key = ""

    cloudscript = get_latest_cloudscript_revision(title_id, secret_key)
    if cloudscript:
        save_cloudscript_to_file(title_id, cloudscript)