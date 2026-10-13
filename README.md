# Pharmacybyme

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

# Pharmacy by Me

Angular 22 standalone pharmacy operations prototype, with Arabic/English layouts and local browser storage.

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

The login screen includes the Sherif Mostafa demo administrator account:

- Email: `sherif@pharmacybyme.eg`
- Password: `Pharmacy123!`

New staff accounts receive a password when created. Sign out from the user menu to switch accounts.

## Included workflows

- Dashboard, medicine catalog, stock, staff, customers, suppliers, sales, purchasing, prescriptions, and standard data use searchable, editable records.
- Roles support create, edit, delete, and per-module view/create/edit/delete permissions; returns have a separate review permission.
- Role permissions filter navigation and actions and guard direct route access. Creating a staff account does not switch the current session; sign out, then log in with the new account.
- Returns support invoice-linked item quantities, refund methods, review, rejection, and stock restocking on approval.
- Data is stored in `localStorage` for this prototype; it is not shared across devices or users.

Build with `npm run build`. Connect a secured backend before using this application for live pharmacy operations.

