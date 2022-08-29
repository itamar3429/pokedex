HEROKU_APP_NAME="{heroku-app-name}"

cd deploy
git init
heroku git:remote -a $HEROKU_APP_NAME
git add -A
git commit -m "deploy"
git push heroku master -f
