# pokedex

pokedex project itamar cohen

# dev

to run in developer mode exec `npm run dev`

# start

to start server exec `npm start`

# deploy

running `npm run deploy`
will create a deploy folder and attempt to deploy to heroku.
if you have a heroku app you can change to name of the app in deploy.sh

# initialize

before starting the app you need to initialize to psql db.
to do that. you need to run `node scriptSql.js`
make sure to update your personal postgres link where its needed
make sure to add `DATABASE_URL` to your env file in the correct format
(postgresql db)
