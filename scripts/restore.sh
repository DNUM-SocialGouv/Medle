# sudo docker exec -it medle_db_1 pg_restore -U medle -d medle -v backup_xxx.sql
#docker exec -i "${DOCKER_DB_NAME}" pg_restore -C --clean --no-acl --no-owner -U "${DB_USER}" -d "${DB_HOSTNAME}" < "${LOCAL_DUMP_PATH}"
#sudo docker exec -i medle_db_1 pg_restore -C --clean --no-acl --no-owner -U medle -d medle < "backup_2020-02-03_16:45:26.sql"
sudo docker exec -i medle_db_1 psql -U medle -d medle < "backup_2020-02-03_16:45:26.sql" # OK

sudo docker exec -i medle_db_1 psql -U medle -d medle -c "\du" # OK

sudo docker exec -i medle_db_1 psql -U medle -d medle -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;" # KO


