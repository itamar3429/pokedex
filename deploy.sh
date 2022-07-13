cd deploy
git init
heroku git:remote -a pokedex4s
git add -A
git commit -m "deploy"
git push heroku master -f
