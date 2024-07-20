#!/bin/bash

# start the db
sudo service mariadb start

# create a database called 'casa'
sudo mariadb -e "CREATE DATABASE casa"

# root user with password 'casa'
basic_single_escape () {
    # The quoting on this sed command is a bit complex.  Single-quoted strings
    # don't allow *any* escape mechanism, so they cannot contain a single
    # quote.  The string sed gets (as argv[1]) is:  s/\(['\]\)/\\\1/g
    #
    # Inside a character class, \ and ' are not special, so the ['\] character
    # class is balanced and contains two characters.
    echo "$1" | sed 's/\(['"'"'\]\)/\\\1/g'
}

esc_pass=`basic_single_escape "casa"`
sudo mariadb -e  "UPDATE mysql.global_priv SET priv=json_set(priv, '$.plugin', 'mysql_native_password', '$.authentication_string', PASSWORD('$esc_pass')) WHERE User='root';"
sudo mariadb -e "FLUSH PRIVILEGES;"