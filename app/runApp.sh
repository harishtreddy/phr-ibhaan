cd ../network/
./teardown.sh
cd ../app/
./startFabric.sh
npm install
node enrollAdmin
node registerUser
node server

