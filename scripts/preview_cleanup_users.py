import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_HldaYWo92Beg@ep-steep-moon-apdvw1tz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

def preview():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    admin_email = "rfpita.ti@gmail.com"

    cur.execute('SELECT id, name, email, role FROM "User" WHERE email = %s', (admin_email,))
    admin = cur.fetchone()
    print("ADMIN_PRESERVADO:", admin)

    cur.execute('SELECT count(*), array_agg(email) FROM "User" WHERE email != %s', (admin_email,))
    others = cur.fetchone()
    print("TOTAL_OUTROS_USUARIOS:", others[0])
    print("EXEMPLO_EMAILS_A_REMOVER:", (others[1] or [])[:10])

    cur.close()
    conn.close()

if __name__ == "__main__":
    preview()
