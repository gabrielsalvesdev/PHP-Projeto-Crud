# CRUD PHP - Agenda de Contatos

A simple PHP CRUD application for managing a contact list (agenda de contatos), using PHP + PostgreSQL.

## Architecture

- **Backend/Frontend**: PHP 8.2 (server-side rendered, no separate frontend framework)
- **Database**: Replit PostgreSQL (via PDO pgsql driver)
- **UI**: Bootstrap 4 + jQuery (CDN + local assets)
- **Server**: PHP built-in development server on port 5000

## Key Files

- `banco.php` — Database connection singleton using PDO (connects to PostgreSQL via environment variables)
- `index.php` — Main page listing all contacts
- `create.php` — Add a new contact
- `read.php` — View contact details
- `update.php` — Edit an existing contact
- `delete.php` — Delete a contact
- `pessoa.sql` — Original MySQL schema (reference only; table created in PostgreSQL)
- `assets/` — Bootstrap CSS/JS local files

## Database

Uses Replit's built-in PostgreSQL. Connection is configured via environment variables:
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

Table: `pessoa` (id SERIAL, nome, endereco, telefone, email, sexo)

## Running

The app runs via PHP's built-in server:
```
php -S 0.0.0.0:5000
```

The workflow "Start application" starts this automatically.
