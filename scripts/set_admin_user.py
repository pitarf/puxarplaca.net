import psycopg2
import bcrypt
import uuid

DATABASE_URL = "postgresql://neondb_owner:npg_HldaYWo92Beg@ep-steep-moon-apdvw1tz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    email = "rfpita.ti@gmail.com"
    password = "Rafael@67"
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    cur.execute('SELECT id, name, role FROM "User" WHERE email = %s', (email,))
    row = cur.fetchone()

    if row:
        print(f"Usuario existente encontrado: {row}. Atualizando para ADMIN...")
        cur.execute('''
            UPDATE "User"
            SET "passwordHash" = %s, "role" = 'ADMIN', "active" = true, "adminAttempts" = 0, "adminLockoutUntil" = NULL
            WHERE email = %s
        ''', (password_hash, email))
    else:
        new_id = str(uuid.uuid4())
        print("Criando novo usuario ADMIN...")
        cur.execute('''
            INSERT INTO "User" (id, name, email, "passwordHash", role, active, balance, "createdAt", "updatedAt")
            VALUES (%s, %s, %s, %s, 'ADMIN', true, 1000.0, NOW(), NOW())
        ''', (new_id, "Rafael Pita", email, password_hash))

    conn.commit()

    cur.execute('SELECT id, name, email, role, active, balance FROM "User" WHERE email = %s', (email,))
    user_data = cur.fetchone()
    print("RESULTADO:", user_data)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
