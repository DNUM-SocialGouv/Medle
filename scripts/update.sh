cd ..
git pull
sudo docker-compose up --build -d
sudo docker-compose exec app yarn migrate