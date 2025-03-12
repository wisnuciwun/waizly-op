# Medio One Platform

This Project using Next Js Library and for  run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

And for run unit tess:

```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Folder Structure

📦src
 ┣ 📂assets
 ┃ ┣ 📂fonts
 ┃ ┣ 📂images
 ┃ ┗ 📂scss
 ┃ ┃ ┣ 📜medio.scss
 ┃ ┃ ┣ 📜style-email.scss
 ┃ ┃ ┗ 📜_medio_variables.scss
 ┣ 📂components
 ┃ ┣ 📂atoms
 ┃ ┃ ┣ 📂button
 ┃ ┃ ┃ ┣ 📂__test__
 ┃ ┃ ┃ ┃ ┗ 📜Button.test.js
 ┃ ┃ ┃ ┗ 📜index.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂molecules
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂organisms
 ┃ ┗ 📜index.js
 ┣ 📂pages
 ┃ ┣ 📜index.js
 ┃ ┣ 📜_app.js
 ┃ ┗ 📜_document.js
 ┣ 📂redux
 ┃ ┣ 📂action
 ┃ ┃ ┗ 📜auth.js
 ┃ ┣ 📂reducer
 ┃ ┃ ┣ 📜auth.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┗ 📜store.js
 ┣ 📂services
 ┃ ┗ 📂auth
 ┃ ┃ ┗ 📜index.js
 ┗ 📂utils
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂lists
 ┃ ┃ ┃ ┗ 📜auth.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📜index.js
