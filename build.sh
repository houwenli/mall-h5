#!/bin/bash

if [ $# != 2 ] ; then
    echo "Usage: ./build.sh <env> <branch>"
    echo "eg: ./build.sh dev develop"
    exit 1;
fi

env=$1
branch=$2
passwd="./.passwd"
host="wsf-web"

case $1 in
    dev)
        git checkout $branch
        git pull
        npm install
        npm run build:develop
        sshpass -f $passwd scp -r dist/* root@${host}:/data/www/m-dev.wsfmall.com/
        ;;
    test)
        git checkout $branch
        git pull
        npm install
        npm run build:test
        sshpass -f $passwd scp -r dist/* root@${host}:/data/www/m-test.wsfmall.com/
        ;;
    uat)
        git checkout $branch
        git pull
        npm install
        npm run build:uat
        sshpass -f $passwd scp -r dist/* root@${host}:/data/www/m-uat.wsfmall.com/
        ;;
esac

