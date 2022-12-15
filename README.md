# semester-project-2022

<strong>Semester project 2</strong> 15.11.2022 - 16.12.2022

by Marthe Bull Pettersen


Goal:
To take the skills learned over the past three semesters and create an auction website.

Brief:
An auction site is looking to launch a website where users can add items to be bid on and bid on items other users have put up for auction.
When a new user joins the website, they are given 1000 credits to use on the site. They can get credits by selling items and use credit by buying items. Non-registered users can search through the listings, but only registered users can make bids on listings.

Links:

<a href="https://trello.com/b/mR3xnHO4/semester-project-2">Trello</a>

<a href="https://www.figma.com/file/RFc5emi6a6jUG75sDU1LoM/Semester-project-2?node-id=1%3A5&t=Z288Z6YUHHkhpNHh-0">Gantt chart</a>

<a href="https://www.figma.com/file/RFc5emi6a6jUG75sDU1LoM/Semester-project-2?node-id=1%3A4&t=Z288Z6YUHHkhpNHh-0">Figma design files and prototypes(see several pages)</a>

<a href="https://github.com/marthebull/semester-project-2">Github repo</a>

<a href="https://highestbidder.netlify.app/">Netlify main: https://highestbidder.netlify.app/</a>

[![Netlify Status](https://api.netlify.com/api/v1/badges/136014c1-ac0b-46d0-bde0-78a661fbf175/deploy-status)](https://app.netlify.com/sites/highestbidder/deploys) 

---

Report:

I will be using bootstrap as CSS-framework for this project.
In order to clone this code and make it work locally you should run `npm install bootstrap@latest` and then `sass --watch scss/custom.scss:css/style.css` vscode terminal.

For usertesting ive used the given userstories for the assignment and added a few to test functionality:

- Brukeren kan bla gjennom og se på produkter uten å være logget inn.
- Brukeren kan søke på produkter eller sortere på “latest first” eller “ending soon”.
- Brukeren kan registrere seg på siden.
- Brukeren kan logge inn på siden.
- Hvis noe ikke fungerer får brukeren tilbakemelding på dette ved feilmeldinger som forklarer feilen.
- Brukeren som er logget inn kan se profilen sin, sine listings og listings de selv har bydd på.
- Brukeren kan oppdatere profilbildet sitt.
- Brukeren kan se sin totale credit-saldo.
- Brukeren kan opprette og legge ut en ny listing med tittel, deadline, beskrivelse og et eller flere bilder og få en preview av listingen før den legges ut.
- Brukeren kan oppdatere sin egen listing.
- Brukeren kan slette sin egen listing.
- Brukeren kan by på en annens listing.
- Brukeren kan se andres/alle bud på en listing.
- Brukeren kan se profilinfo om selger.
- Brukeren kan bla i mediegalleri dersom det finnes flere bilder av produktet.
- Brukeren kan se høyeste bud på en listing.
- Når brukeren byr på en annens listing påvirkes credit-saldoen.
- Brukeren kan logge ut.

---

Resources:

Navbar code for bootstrap: https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-navbar.php
