import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_HldaYWo92Beg@ep-steep-moon-apdvw1tz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

def check():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute('SELECT id, "siteTitle", "siteDescription", "companyName", "companyEmail" FROM "SystemSetting"')
    rows = cur.fetchall()
    print("CURRENT_SETTINGS:", rows)
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
