.PHONY: run start_db reset_db clean_db clean

# I would put db as a target prereq but the script assumes the database does not exist
run:
	# NOTE: Requires DB to be initialized (start_db).
	mvn spring-boot:run

start_db:
	# Run the postStartCommand.sh script which initializes/starts mariadb
	bash ../.devcontainer/postStartCommand.sh

reset_db: clean_db
	sudo mariadb -e "CREATE DATABASE casa;"

clean_db:
	sudo mariadb -e "DROP DATABASE casa;"

clean: clean_db
	rm -rf logs
