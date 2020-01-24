cd ~/backups/
now=$(date +"%Y-%m-%d_%T")
sudo docker exec -it medle_db_1 pg_dump -U medle > backup_$now.sql