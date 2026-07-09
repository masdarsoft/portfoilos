import os
import sys

# Add the project root to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
import django
django.setup()

from django.conf import settings
print("=== DJANGO SETTINGS ===")
print("ALLOWED_HOSTS:", settings.ALLOWED_HOSTS)
print("SECURE_SSL_REDIRECT:", getattr(settings, "SECURE_SSL_REDIRECT", None))
print("SECURE_REDIRECT_EXEMPT:", getattr(settings, "SECURE_REDIRECT_EXEMPT", None))

import urllib.request
import urllib.error

print("\n=== TESTING LOCAL PORT 8000 ===")
url = "http://127.0.0.1:8000/api/v1/tenants/resolve/?domain=malakparties.com"
req = urllib.request.Request(url)

try:
    with urllib.request.urlopen(req) as response:
        print("Success! Status:", response.status)
        print("Headers:", dict(response.headers))
        body = response.read().decode("utf-8")
        import json
        try:
            data = json.loads(body)
            print("\n=== RESOLVED DATABASE TENANT DETAILS ===")
            print("Name:     ", data.get("name"))
            print("Subdomain:", data.get("subdomain"))
            print("Phone:    ", data.get("phone"))
            print("WhatsApp: ", data.get("whatsapp"))
            print("Address:  ", data.get("address"))
            print("========================================")
        except Exception:
            print("Body:", body[:300])
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Headers:", dict(e.headers))
    print("Body:", e.read().decode("utf-8"))
except Exception as e:
    print("Connection Error:", e)
