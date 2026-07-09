import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}. Make sure you run this script from the portfoilo_tenant_server folder.")
    exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Prepare new values
new_phone = '+996567880162'
new_whatsapp = '+996567880162'

# Update query
cur.execute("""
    UPDATE tenants_tenant
    SET phone = ?, whatsapp = ?
    WHERE subdomain = 'malak-parties' OR subdomain = 'malakparties'
""", (new_phone, new_whatsapp))

conn.commit()
print("DATABASE UPDATED SUCCESSFULLY!")
print("New Phone in Database:   ", new_phone)
print("New WhatsApp in Database:", new_whatsapp)
conn.close()
