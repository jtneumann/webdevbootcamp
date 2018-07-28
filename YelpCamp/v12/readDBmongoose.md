


npm uninstall mongoose
npm i -S mongoose@5.1.3

To update from whatever version of mongodb you're using to mongodb 3.6.5 use the following commands*:
*note: you may need to run these individually.

killall mongod
sudo apt-get purge -y mongodb-org*
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install -y mongodb-org

------

When that's done you can restart the terminal (close and open a new one) and run mongo --version it should be 3.6.5

Now you'll want to remove the mongod*  file that you normally run with ./mongod  and create a new one.

So go to the folder that you normally run ./mongod  from and run the following: 

rm -rf mongod
echo "mongod --dbpath=data --nojournal" > mongod
chmod a+x mongod


