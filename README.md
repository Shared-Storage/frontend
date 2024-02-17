Prototype 2: 

This project is based on ReactJS in frontend, [NodeJS in backend](https://github.com/bug-tracker-software/bts-be-prototype-2) and MongoDB as a database.

It contains complete authentication and user management system.


Material UI Examples

https://github.com/mui/material-ui/blob/master/docs/data/material/getting-started/templates/pricing/Pricing.js

Internationalizing and Localizing:
https://www.youtube.com/watch?v=baLjPx_wFi4

JSON Translator:
https://translate.i18next.com/

Deployment:
https://www.youtube.com/watch?v=eKEiKbPaFJg&t=477s


Create .env or .env.local

REACT_APP_ENV="Development"
REACT_APP_ENABLE_DEBUG=true
REACT_APP_BACKEND_LINK="http://localhost:3001"
REACT_APP_STRIPE_PUBLISHABLE_KEY="XXXX"

## Docker
```docker build -t docker-react-image:1.0 .```
```docker run -d -p 4000:80 --name docker-react-container docker-react-image:1.0```

## Deployment build
```$ npm run build --prod```

Deployed in bucket **sstorage-frontend**