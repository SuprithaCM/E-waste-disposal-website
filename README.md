# EcoCycle — E-Waste Disposal Website

EcoCycle is a responsive, multi-page front-end demonstration website built with HTML, CSS, JavaScript and jQuery.

## Pages
- `index.html` — landing page and feature overview
- `catalogue.html` — searchable e-waste categories, environmental concerns and safer disposal tips
- `collectors.html` — sample collector directory, manual city/PIN filtering and browser geolocation permission demo
- `sell.html` — item/weight calculator with illustrative INR value ranges and demo pickup/drop-off request preview
- `about.html` — project purpose and what is needed to turn the prototype into a live service

## Run locally
1. Extract the `EcoCycle.zip` file.
2. Open the `EcoCycle` folder in VS Code.
3. Recommended: install the **Live Server** extension in VS Code.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Use the navigation to open the other pages.

You can also open `index.html` directly in a browser. Geolocation usually works only on `localhost` or a secure HTTPS origin, and the user must grant permission.

## Technology
- HTML5
- CSS3 (responsive layouts and mobile navigation)
- JavaScript
- jQuery 3.7.1 loaded from the official jQuery CDN
- Browser Geolocation API

## Important demo limitations
- Collector names and directory entries are fictional sample listings, not real or verified businesses.
- Distances are illustrative and are not calculated from the user's coordinates.
- Browser GPS is used only to demonstrate requesting location permission. This project does not reverse-geocode coordinates or connect to a live collector/map database.
- INR per-kg payout ranges in `js/main.js` are illustrative demo rates, not current market quotes or guaranteed payouts.
- The request form displays a local preview only. It does not send a request, book a collection, or store personal data on a server.
- No database, authentication, live maps, SMS, email or payment processing is included.

## Editing sample payout rates
Open `js/main.js` and find `const rates`. Each category has `low` and `high` example values in INR per kg. Change them only when you have real, dated quotes from a recycler; add a visible source/date and conditions if you publish real rates.

## Before launching as a real service
Add a backend/database, verified collector registration, live geocoding/maps, secure request submission, server-side validation, consent/privacy notices, abuse protection, and current collector-specific quotes. Verify local e-waste regulations and authorized collection channels.
