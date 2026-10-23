import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_HldaYWo92Beg@ep-steep-moon-apdvw1tz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

def update():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Atualiza SystemSetting
    cur.execute('''
        UPDATE "SystemSetting"
        SET "siteTitle" = 'PuxarPlaca - Consultas Veiculares e Cadastrais Online',
            "siteDescription" = 'Plataforma profissional para consultas veiculares pela placa, CPF, CNPJ, histórico de proprietários e débitos.',
            "companyName" = 'PUXARPLACA TECNOLOGIA LTDA',
            "companyEmail" = 'contato@puxarplaca.net'
        WHERE id = 'default'
    ''')

    # Atualiza páginas institucionais no banco caso existam
    cur.execute('''
        UPDATE "Page"
        SET title = REPLACE(title, 'Detetive Buscas', 'PuxarPlaca'),
            content = REPLACE(REPLACE(content, 'Detetive Buscas', 'PuxarPlaca'), 'suporte@detetivebuscas.com', 'suporte@puxarplaca.net'),
            "metaDescription" = REPLACE("metaDescription", 'Detetive Buscas', 'PuxarPlaca')
    ''')

    conn.commit()

    cur.execute('SELECT id, "siteTitle", "companyName", "companyEmail" FROM "SystemSetting"')
    print("SETTINGS_ATUALIZADOS:", cur.fetchall())

    cur.execute('SELECT slug, title FROM "Page"')
    print("PAGINAS_NO_BANCO:", cur.fetchall())

    cur.close()
    conn.close()

if __name__ == "__main__":
    update()
