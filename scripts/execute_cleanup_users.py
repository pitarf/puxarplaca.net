import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_HldaYWo92Beg@ep-steep-moon-apdvw1tz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

def cleanup():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    admin_email = "rfpita.ti@gmail.com"

    print("Iniciando limpeza mantendo apenas:", admin_email)

    # 1. Obter IDs dos usuários que NÃO são o admin
    cur.execute('SELECT id, email FROM "User" WHERE email != %s', (admin_email,))
    users_to_remove = cur.fetchall()
    print(f"Total de usuários a remover: {len(users_to_remove)}")

    if users_to_remove:
        user_ids = [u[0] for u in users_to_remove]
        emails = [u[1] for u in users_to_remove]
        print("E-mails que serão excluídos:", emails)

        # 2. Desvincular indicacoes (referrer) apontando para ou vindo destes usuarios
        cur.execute('UPDATE "User" SET "referredById" = NULL WHERE "referredById" = ANY(%s) OR id = ANY(%s)', (user_ids, user_ids))

        # 3. Remover transações de indicação
        cur.execute('DELETE FROM "ReferralTransaction" WHERE "userId" = ANY(%s) OR "fromUserId" = ANY(%s)', (user_ids, user_ids))

        # 4. Remover transações financeiras desses usuários
        cur.execute('DELETE FROM "Transaction" WHERE "userId" = ANY(%s)', (user_ids,))

        # 5. Remover histórico de buscas desses usuários
        cur.execute('DELETE FROM "SearchHistory" WHERE "userId" = ANY(%s)', (user_ids,))

        # 6. Remover tokens de reset de senha vinculados aos emails
        cur.execute('DELETE FROM "PasswordResetToken" WHERE email = ANY(%s)', (emails,))

        # 7. Remover os usuários
        cur.execute('DELETE FROM "User" WHERE id = ANY(%s)', (user_ids,))

        conn.commit()
        print("Limpeza concluída com sucesso!")
    else:
        print("Nenhum outro usuário encontrado para remoção.")

    # Listar usuários restantes para conferência
    cur.execute('SELECT id, name, email, role, balance FROM "User"')
    remaining = cur.fetchall()
    print("USUARIOS_RESTANTES_NO_BANCO:", remaining)

    cur.close()
    conn.close()

if __name__ == "__main__":
    cleanup()
