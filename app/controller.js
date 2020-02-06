/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';

var path = require('path');
var Fabric_Client = require('fabric-client');
var os = require('os');
var fs = require('fs');
//var crypto = require('crypto');
var util = require('util');
const jwt = require('jsonwebtoken');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;


const nodemailer = require('nodemailer');
const CHANNEL_NAME = 'chips-phr-doctor-patient';
const CHAINCODE_ID = 'chips-phr-app';
const KEY = fs.readFileSync('./key.txt'); //crypto.randomBytes(32) should be 128 (or 256) bits
const IV = fs.readFileSync('./iv.txt');//crypto.randomBytes(16) Initialization Vector is always 16-bytes

var auth = [];

exports.login = async function(req, res, _next) {


    var id = req.body.id; // not id but username
    var otp = req.body.otp;
    var type_of_user = req.body.type_of_user;

    console.log("controller id value:"+id);
    console.log("controller otp value:"+otp);

    var orgToken = jwt.sign(
        {
            _id: id,
            _otp: otp
        },
        'jwt_Secret_Key_for_CHiPS_PHR_Of_32Bit_String',
        {
            expiresIn: '1800000'
        }
    );
    let url='';
    let x;

    let loopVar;
    console.log("Authorisation Verification before match : ",auth);
    for(loopVar=0;loopVar<auth.length;++loopVar){
        
        if(auth[loopVar][1] == id && auth[loopVar][0] == type_of_user && auth[loopVar][2] == otp ){
                        
            if(type_of_user == "Admin" && id == "Admin" ) {
                url = 'phr_admin_dash.html';
                res.send({'result': 'success',
                    'url': url,
                    'x':x,
                    'token': orgToken});
        
            }else if (type_of_user == "Doctor") {
                queryValues("getDoctors",[],'doctor_list',res,(doctors)=>{
                    console.log("\n\nDoctors : ",doctors)
                    let i;
                    for(i=0;i<doctors.length;++i){
                        let checkName = doctors[i].contact_details.first_name+" "+doctors[i].contact_details.last_name;
                        if(id == checkName){

                            console.log("Doctor found !! ");
                            id = doctors[i].id;
                            url = 'phr_doctor.html?doctor_id='+id;
                            res.send({'result': 'success',
                                'url': url,
                                'x':x,
                                'token': orgToken});
                            break;
        
                        }
                    }
                })
                
            }else if (type_of_user == "Patient") {
                
                queryValues("getPatients", [], 'patient_list', res,(patients)=>{
                    console.log("\n\n\n\nPatients : ",patients)
                    let i;
                for(i=0;i<patients.length;++i){
                    let checkName = patients[i].contact_details.first_name+" "+patients[i].contact_details.last_name
                    if(id == checkName){
                        console.log("Patient Found !! ")
                        id = patients[i].id;
                        url = 'phr_patient.html?patient_id='+id;
                        res.send({'result': 'success',
                    'url': url,
                    'x':x,
                    'token': orgToken});
        
                    break;
            
                        
                    }
                    
                }
                })
                    
                    
                
                
                            
            }else{
                
                url ='login.html' 
                res.send({'result': 'failed',
                    'url': url,
                    'error':"Invalid Credentials !!! "
                    });
        
        
            }
        auth.splice(loopVar,1);

        // let loopVar2
        // for(loopVar2=0;loopVar2<auth.length;++loopVar2){
        //     if(auth[loopVar2][1] == id ){
        //         auth.splice(loopVar2,1)
        //     }
        // }

        console.log("Authorisation Verification after match : ",auth);
        
        }
        if(( auth.length-1) == loopVar ){
                
            url ='login.html' 
            res.send({'result': 'failed',
                'url': url,
                'error':"Invalid Credentials !!! "
                });
            
        }
        

    }

        // res.send({'result': 'success',
    //           'url': url,
    //           'x':x,
    //           'token': orgToken});
    
}

exports.addDoctor = function (req, res, _next) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var address = req.body.address;
    var state = req.body.state;
    var city = req.body.city;
    var license_no = req.body.license_no;
    var status = req.body.status;
    var args = [first_name, last_name, email, address,
                state, city, license_no, status];
    invoke("addDoctor", args, res);
    
};

exports.changeStatus = function (req, res, _next) {

    var id = req.body.id;
    var status = req.body.status;
    var args = [id, status];
    invoke("changeStatus", args, res);
};

exports.addPatient = function (req, res, _next) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var address = req.body.address;
    var state = req.body.state;
    var city = req.body.city;
    var birth_year = req.body.birth_year;
    var gender = req.body.gender;
    var args = [first_name, last_name, email, address,
                state, city, birth_year, gender]
    invoke("addPatient", args, res) ;
};

exports.addPrescription = function (req, res, _next) {
    
    var doctorName = req.body.doctorName;
    var doctorID = req.body.doctorID;
    var prescriptionData = req.body.prescriptionData;
    var patientName = req.body.patientName;
    var patientID = req.body.patientID;
    var drugs = req.body.drugs;
    var refillCount = req.body.refillCount;
    var voidAfter = req.body.voidAfter;
    var args = [doctorName, doctorID, prescriptionData, patientName,
                patientID, drugs, refillCount, voidAfter];
    invoke("addPrescription", args, res);
};

exports.addReport = function (req, res, _next) {

    var refDoctor   = req.body.refDoctor;
    var codeID      = req.body.codeID;
    var reportType  = req.body.reportType;
    var reportName  = req.body.reportName;
    var patientID   = req.body.patientID;
    var patientName = req.body.patientName;
    var reportData  = req.body.reportData;
    var date        = req.body.date;
    var submitType  = req.body.submitType;
    var args = [refDoctor, codeID, reportType, reportName, patientName, patientID,
                reportData, submitType, date];
    invoke("addReport", args, res);
};

exports.getDoctors = function (_req, res, next) {

    query("getDoctors", [], 'doctor_list', res);

};

exports.getPatients = function (_req, res, _next) {

    query("getPatients", [], 'patient_list', res);
}


exports.getPatientInfo = function (req, res, next) {

    var patient_id = req.query.patient_id;
    query("getPatientInfo", [patient_id], 'patient_list', res)

}

exports.getDoctorInfo = function (req, res, next) {

    var doctor_id = req.query.doctor_id;
    console.log("Controller - getDoctorInfo : ",doctor_id)
    query("getDoctorInfo", [doctor_id], 'doctor_list', res)

}

exports.getPrescriptionById = function (req, res, next) {

    var patient_id = req.query.patient_id;
    query("getPrescriptionById", [patient_id], 'prescription_list', res)

}

exports.getReportById = function (req, res, next) {

    var patient_id = req.query.patient_id;
    query("getReportById", [patient_id], 'report_list', res)

}

exports.getDoctorCount = function (_req, res, _next) {

    queryCount("getDoctors", res);
}

exports.getPatientCount = function (req, res, next) {

    queryCount("getPatients", res);

}

exports.getPrescriptionCount = function (req, res, next) {

    queryCount("getPrescriptions", res);

}

exports.getReportCount = function (req, res, next) {

    queryCount("getReports", res);

}

exports.shareRecords = function (req, res, next) {

    console.log("shareRecords : req.body : ",req.body)
    var patient_id = req.body.patient_id;
    var patient_name = req.body.patient_name;
    var email = req.body.email;
    
    var subject = 'Medical Record shared for review';
    var message = '<b>' + patient_name + ',</b> has shared medical records with you for review. <br/><br/>' + 
                  'To access the records please use the URL: <br/>localhost:6004/production/loginv.html <br/><br/>' +
                  'Blockchain ID: ' + patient_id;

    sendEmail(email, subject, message);
    res.send({ 'result': 'success' });

}


function _monitor(_event) {
    var method = '_monitor';
    console.log(method + ' _event received: ' + _event.event_name);

    if (_event.event_name == 'DoctorAddedEvent') {
        sendEmailTo(_event);
    }

    if (_event.event_name == 'PatientAddedEvent') {
        sendEmailTo(_event);
    }
}

function sendEmailTo(event) {

    let event_payload = JSON.parse(event.payload.toString());
    var to = event_payload.email;
    var subject = 'EHR Blockchain - Registration ';
    var url = '';
    switch (event.event_name) {
        case 'DoctorAddedEvent':
            url = 'http://localhost:6004/production/phr_doctor.html';
            break;

        case 'PatientAddedEvent':
            url = 'http://localhost:6004/production/phr_patient.html';
            break;
    }

    var message = 'Dear <b>' + event_payload.firstName + ' ' + event_payload.lastName + '</b>, Congrats!!! You are now successfully registered to the <b>EHR Blockchain System</b>.' +
        '<br/><br/>' +
        'To login to the system, Please login to the following URL: ' +
        '<br/>' +
        '<br/>' +
        url +
        '<br/>' +
        '<br/>' +
        'Your USER-ID : <b>' + event_payload.id + '</b>'+
        '<br/>' +
        '<br/>' +
        'User Name for Login : <b> '+ event_payload.firstName + ' ' + event_payload.lastName+'</b>';

    sendEmail(to, subject, message);
}


function sendEmail(email, subject, message) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'tech.ibhaan', // generated ethereal user
            pass: 'Ibhaan@123' // generated ethereal password
        }
       
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: 'tech.ibhaan@gmail.com', // sender address
        to: email,
        subject: subject, // Subject line
        html: message  // html body
    };
    // send mail with defined transport object
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("sendEmail:- "+error);
        }
        //console.log('sendEmail:- Message sent: %s', info.messageId);
        console.log(info)
    });
}

exports.getHistory = function(req, res, next) {

    // query("getHistory", [CHANNEL_NAME], 'history', res)
    query("getHistory", [req.query.history_id], 'history', res)

}

exports.generateOTP = function (req, res, next) {
    console.log("Auth : ",auth)
    if(req.query.userName) {

        var userName = req.query.userName;
        var type_of_user = req.query.type_of_user;
        if(type_of_user=="Admin" && userName=="Admin" ){
        
            var otp = Date.now().toString().substr(-6);
            var subject = 'CHiPS EHR: Login OTP';
            var message = 'Your CHiPS EHR OTP is: ' + otp;
    
            console.log('--- OTP: ' + otp);
    
            let x;
            if(auth.length==0){
                auth.push([ type_of_user , userName , otp ] ) 
            }else{
                for(x=0;x<auth.length;++x){
                    if(auth[x][0] == type_of_user && auth[x][1] == userName ){
                        auth[x] = new Array(type_of_user,userName,otp)
                        break;
                    }
                    if(x==(auth.length-1)){
                        auth.push([ type_of_user , userName , otp ] ) 
                    }
                                    
                }
            }
            

            sendEmail("poc@ibhaan.com", subject, message);  // hard coded admin mail id  
            
            res.send({
                'result': 'success',
                'otp': otp
            });
    
        }else if(type_of_user=="Doctor"){
            
            queryValues("getDoctors",[],'doctor_list',res,(doctors)=>{
                
                let i;
                for(i=0;i<doctors.length;++i){
                    let checkName = doctors[i].contact_details.first_name+" "+doctors[i].contact_details.last_name;
                    if(userName == checkName){
                        
                        console.log("Doctor found !! \n",doctors[i]);
                        if(doctors[i].status=='Active'){
                        
                            var email =  doctors[i].contact_details.email
                            var otp = Date.now().toString().substr(-6);
                            var subject = 'CHiPS EHR: Login OTP';
                            var message = 'Your CHiPS EHR OTP is: ' + otp;
        
                            console.log('--- OTP: ' + otp);
                            
                            let x;
                            if(auth.length==0){
                                auth.push([ type_of_user , userName , otp ] ) 
                            }else{
                                for(x=0;x<auth.length;++x){
                                    if(auth[x][0] == type_of_user && auth[x][1] == userName ){
                                        auth[x] = new Array(type_of_user,userName,otp)
                                        break;
                                    }
                                    if(x==(auth.length-1)){
                                        auth.push([ type_of_user , userName , otp ] ) 
                                    }
                                                    
                                }
                            }
                                                        
                            sendEmail(email, subject, message);        
                            res.send({
                                'result': 'success',
                                'otp': otp
                            });
                            break; 

                        }else{
                            res.send({
                                'result': 'failed',
                                'error': "UnAuthorised !!" 
                            });
                        }             
                }
                    if(i == (doctors.length-1)){
                        console.log("Invalid Username !! ")
                        res.send({
                            'result': 'failed',
                            'error': "Invalid Username !!" 
                        });
                    }
                }
            })
    
        }else if(type_of_user=="Patient"){
            
            queryValues("getPatients", [], 'patient_list', res,(patients)=>{
                let i; 
            for(i=0;i<patients.length;++i){
                let checkName = patients[i].contact_details.first_name+" "+patients[i].contact_details.last_name
                
                if(userName == checkName){
                    console.log("Patient found !! \n",patients[i]);
                        var email =  patients[i].contact_details.email
                        var otp = Date.now().toString().substr(-6);
                        var subject = 'CHiPS EHR: Login OTP';
                        var message = 'Your CHiPS EHR OTP is: ' + otp;
    
                        console.log('--- OTP: ' + otp);
                        
                        let x;
                        if(auth.length==0){
                            auth.push([ type_of_user , userName , otp ] ) 
                        }else{
                            for(x=0;x<auth.length;++x){
                                if(auth[x][0] == type_of_user && auth[x][1] == userName ){
                                    auth[x] = new Array(type_of_user,userName,otp)
                                    break;
                                }
                                if(x==(auth.length-1)){
                                    auth.push([ type_of_user , userName , otp ] ) 
                                }
                                                
                            }
                        }

                        sendEmail(email, subject, message);        
                        res.send({
                            'result': 'success',
                            'otp': otp
                        });
        
                    break;
                }

                if(i == (patients.length-1)){
                    console.log("Invalid Username !! ")
                    res.send({
                        'result': 'failed',
                        'error': "Invalid Username !!" 
                    });
                }
                
            }
            })
                
    
        }else{
            res.send({
                'result': 'failed',
                'error': "Invalid Username !!" 
            });
    
        }

    }else if(req.query.email){

       
        
        var otp = Date.now().toString().substr(-6);
        var subject = 'CHiPS EHR: Login OTP';
        var message = 'Your CHiPS EHR OTP is: ' + otp;

        console.log('--- OTP: ' + otp);

        sendEmail(req.query.email, subject, message);
        
        requestArray.push([req.query.patient_id,req.query.doctor_id,(new Date()).toString()])

        console.log("Request Logs : \n",requestArray)
        res.send({
            'result': 'success',
            'otp': otp
        });

    }else{

        res.send({
            'result': 'failed',
            'error': "Invalid Username !!" 
        });

    }
    
    // var otp = Date.now().toString().substr(-6);
    // var subject = 'CHiPS EHR: Login OTP';
    // var message = 'Your CHiPS EHR OTP is: ' + otp;

    // console.log('--- OTP: ' + otp);

    // sendEmail(email, subject, message);        
    // res.send({
    //     'result': 'success',
    //     'otp': otp
    // });

}

var requestArray = [];

exports.requestAccess = function (req, res, next) {

    console.log("\n\nRequest Array : ",requestArray,"\n\n")
    var email = req.query.email;

    //var name = req.query.name;
    //var id = req.query.id;

    //requestArray['req.query.id'] = req.query;
    requestArray['req.query.id',req.query.email,Date.now()]

    res.send({
        'result': "success"
    });
}


exports.getRequestAccess = function (req, res, next) {
    
    var id = req.query.id;
    console.log("Patient ID : ",id )
    console.log("Request Access : ",requestArray)
    var i;
    var accessData = []
    for(i=0;i<requestArray.length;++i){
        if(requestArray[i][0] == id ){
            accessData.push([ requestArray[i][1],requestArray[i][2]])
        }
    }
    res.send({'result': 'success', 'access': accessData });
}

exports.getRequestApprove = function (req, res, next) {
    requestArray['req.query.id'].approved=true;
    res.send({'result': 'success'});
}

function invoke(func_name, args, res){
    var fabric_client = new Fabric_Client();

	// setup the fabric network
    var channel = fabric_client.newChannel(CHANNEL_NAME);
    console.log(func_name+'-invoke:- channel:'+channel);
    var peer = fabric_client.newPeer('grpc://localhost:7051');
    channel.addPeer(peer);
    var order = fabric_client.newOrderer('grpc://localhost:7050')
	channel.addOrderer(order);

	var store_path = path.join(os.homedir(), '.hfc-key-store');
    console.log(func_name+'-invoke:- Store path:'+store_path);
    var tx_id = null;

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
	    return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
            console.log(func_name+'-invoke:- Successfully loaded user1 from persistence');
            user_from_store
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
        }

        // get a transaction id object based on the current user assigned to fabric client
        tx_id = fabric_client.newTransactionID();
        console.log(func_name+"-invoke:- Assigning transaction_id: ", tx_id._transaction_id);
        // send proposal to endorser
        const request = {
            //targets : --- letting this default to the peers assigned to the channel
            chaincodeId: CHAINCODE_ID,
            fcn: func_name,
            args: args,
            chainId: CHANNEL_NAME,
            txId: tx_id,
            transientMap: {"KEY": Buffer.from(KEY), "IV": Buffer.from(IV)}
        };
        console.log("\n\nTransaction Request : ",request,"\n\n")
        // send the transaction proposal to the peers
        return channel.sendTransactionProposal(request)
    }).then((results) => {
        //console.log('\nResults after sendTransactionproposal : \n\n',results)
        var proposalResponses = results[0];
        var proposal = results[1];
        var isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            console.log(func_name+'-invoke:- Transaction proposal was good');
        } else {
            console.error(func_name+'-invoke:- Transaction proposal was bad');
        }
        if (isProposalGood) {
            console.log(util.format('%s-invoke:- Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
                                    func_name, proposalResponses[0].response.status, proposalResponses[0].response.message));
                                        
            // set the transaction listener and set a timeout of 30 sec
            // if the transaction did not get committed within the timeout period,
            // report a TIMEOUT status
            var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
            var promises = [];
            // build up the request for the orderer to have the transaction committed
            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal
              };
              
        
            var sendPromise = channel.sendTransaction(request);
            promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

            var event_hub = channel.newChannelEventHub(peer);

            var txPromise = 
                new Promise((resolve, reject) => {
                    var handle = setTimeout(() => {
                                    event_hub.unregisterTxEvent(transaction_id_string);
                                    event_hub.disconnect();
                                    resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
                                }, 3000);                    
                    event_hub.registerTxEvent(transaction_id_string, 
                        (tx, code) => {
                            // this is the callback for transaction event status
                            // first some clean up of event listener
                            clearTimeout(handle);
                            console.log("Transaction id txEvenet :"+tx)
                            // now let the application know what happened
                            var return_status = {event_status : code, tx_id : transaction_id_string};
                            if (code !== 'VALID') {
                                console.error(func_name+'-invoke:- The transaction was invalid, code = ' + code);
                                resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
                            } else {
                                console.log(func_name+'-invoke:- The transaction has been committed on peer ' + event_hub.getPeerAddr());
                                var regid = event_hub.registerChaincodeEvent('chips-phr-app', 'AddedEvent$', (event, blockNum, txId, txStatus) => {
                                    // This callback will be called when there is a chaincode event name
                                    // within a block that will match on the second parameter in the registration
                                    // from the chaincode with the ID of the first parameter.
                                    console.log('Successfully got a chaincode event with transid:'+ txId + ' with status:'+txStatus+' block number '+blockNum);
                                    // to see the event payload, the channel_event_hub must be connected(true)
                                    let event_payload = event.payload.toString('utf8');
                                    console.log("event_payload: "+event_payload);
                                        _monitor(event);
                                        event_hub.unregisterChaincodeEvent(regid);
                                        event_hub.disconnect();                       
                                });
                                resolve(return_status);
                            }
                        },
                        (err) => {
                            //this is the callback if something goes wrong with the event registration or processing
                            reject(new Error(func_name+'-invoke:- There was a problem with the eventhub ::'+err));
                        },
                        {disconnect: false} //disconnect when complete
                    );
                    event_hub.connect(true);
                });

            promises.push(txPromise);
            return Promise.all(promises);
        } else {
            console.error(func_name+'-invoke:- Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...' + '\n');
            throw new Error(func_name+'-invoke:-Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
        }
    }).then((results) => {
        // check the results in the order the promises were added to the promise all list
        console.log(func_name+'-invoke:- Send transaction promise and event listener promise have completed');
        if (results && results[0] && results[0].status === 'SUCCESS') {
            console.log(func_name+'-invoke:- Successfully sent transaction to the orderer.');
        } else {
            console.error(func_name+'-invoke:- Failed to order the transaction. Error code: ' + results[0].status);
        }
        if(results && results[1] && results[1].event_status === 'VALID') {
            console.log(func_name+'-invoke:- Successfully committed the change to the ledger by the peer');
            


            if(func_name == "addReport"){
                console.log("txID : ",tx_id.getTransactionID())
                console.log("filehash ", args[6])
                
                res.send(args[6]);
            }else{
                res.send(tx_id.getTransactionID());
            }

            
            
            // res.send(tx_id.getTransactionID());


        } else {
            console.log(func_name+'-invoke:- Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
        }
    }).catch((err) => {
        console.error(func_name+'-invoke:- Failed to invoke successfully :: ' + err + '\n');
    });
}

function query(func_name, args, list_name, res) {

    var fabric_client = new Fabric_Client();

	// setup the fabric network
    var channel = fabric_client.newChannel(CHANNEL_NAME);
    console.log(func_name+'-query:- channel:'+channel);
	var peer = fabric_client.newPeer('grpc://localhost:7051');
	channel.addPeer(peer);

	var store_path = path.join(os.homedir(), '.hfc-key-store');
	console.log(func_name+'-query:- Store path:'+store_path);

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
	    return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
            console.log(func_name+'-query:- Successfully loaded user1 from persistence');
            user_from_store
		} else {
			throw new Error(func_name+'-query:- Failed to get user1.... run registerUser.js');
        }
	    const request = {
		    chaincodeId: CHAINCODE_ID,
		    fcn: func_name,
            args: args,
            transientMap: {"KEY": KEY, "IV": IV}
	    };

		// send the query proposal to the peer
	    return channel.queryByChaincode(request)
    }).then((query_responses) => {
		console.log(func_name+"-query:- Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error(func_name+"-query:- error from query = "+ query_responses[0]);
			} else {
                console.log(func_name+"-query:- Response is "+ query_responses[0].toString());
                console.log(func_name+"-query:- Complete Response "+ query_responses);
                let JSONRes = JSON.parse(query_responses[0].toString());
                
                res.send({ 'result': 'success',
                            [list_name]: JSONRes
                        });
			}
		} else {
			console.log(func_name+"-query:- No payloads were returned from query");
		}
	}).catch((err) => {
		console.error(func_name+'-query:- Failed to query successfully :: ' + err);
	});
}

function queryCount(func_name, res) {
    var fabric_client = new Fabric_Client();

	// setup the fabric network
    var channel = fabric_client.newChannel(CHANNEL_NAME);
	var peer = fabric_client.newPeer('grpc://localhost:7051');
	channel.addPeer(peer);

	var store_path = path.join(os.homedir(), '.hfc-key-store');
	console.log(func_name+'-queryCount:- Store path:'+store_path);

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
	    return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
            console.log(func_name+'-queryCount:- Successfully loaded user1 from persistence');
            user_from_store
		} else {
			throw new Error(func_name+'-queryCount:- Failed to get user1.... run registerUser.js');
        }

	    const request = {
		    chaincodeId: CHAINCODE_ID,
		    fcn: func_name,
            args: [],
            transientMap: {"KEY": Buffer.from(KEY), "IV": Buffer.from(IV)}
	    };

		// send the query proposal to the peer
	    return channel.queryByChaincode(request)
   }).then((query_responses) => {
		console.log(func_name+"-queryCount:- Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error(func_name+"-queryCount:- error from query = ", query_responses[0]);
			} else {
				//console.log(func_name+"-queryCount:- Response: "+JSON.parse(query_responses[0].toString())+" Count: "+JSON.parse(query_responses[0].toString()).length);
                res.send({ 'result': 'success',
                            'count': JSON.parse(query_responses[0].toString()).length
                });
			}
		} else {
			console.log(func_name+"-queryCount:- No payloads were returned from query");
		}
	}).catch((err) => {
		console.error(func_name+'-queryCount:- Failed to query successfully :: ' + err);
    });
}

function queryValues(func_name, args, list_name, res,callback) {

    var fabric_client = new Fabric_Client();

	// setup the fabric network
    var channel = fabric_client.newChannel(CHANNEL_NAME);
    console.log(func_name+'-query:- channel:'+channel);
	var peer = fabric_client.newPeer('grpc://localhost:7051');
	channel.addPeer(peer);

	var store_path = path.join(os.homedir(), '.hfc-key-store');
	console.log(func_name+'-query:- Store path:'+store_path);

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
	    return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
            console.log(func_name+'-query:- Successfully loaded user1 from persistence');
            user_from_store
		} else {
			throw new Error(func_name+'-query:- Failed to get user1.... run registerUser.js');
        }
	    const request = {
		    chaincodeId: CHAINCODE_ID,
		    fcn: func_name,
            args: args,
            transientMap: {"KEY": KEY, "IV": IV}
	    };

		// send the query proposal to the peer
	    return channel.queryByChaincode(request)
    }).then((query_responses) => {
		console.log(func_name+"-query:- Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error(func_name+"-query:- error from query = "+ query_responses[0]);
			} else {
                console.log(func_name+"-query:- Response is "+ query_responses[0].toString());
                let JSONRes = JSON.parse(query_responses[0].toString());
                
                return callback(JSONRes);
                // res.send({ 'result': 'success',
                //             [list_name]: JSONRes
                //         });
			}
		} else {
			console.log(func_name+"-query:- No payloads were returned from query");
		}
	}).catch((err) => {
		console.error(func_name+'-query:- Failed to query successfully :: ' + err);
	});
}

// IPFS File Upload //

exports.addFile = (req,res,next)=>{
  try {  
    
    console.log("\n\nInside addFile Controller ..... \n\n")
    console.log("Request object .... \n\n",req.headers);
    console.log("\n\nRequest Body: ",req.body,"\nRequest Files: ",req.files)
    const file = req.files.file;
    const fileName = req.body.patientID+" "+req.body.reportName;
    const filePath = 'File Upload/'+fileName;

    file.mv(filePath, async (err)=>{
        if(err){
            return res.status(500).send(err)
        }
        const fileHash = await fileAdd(fileName,filePath)

        fs.unlink(filePath, (err) =>{ 
            if(err) console.log(err)
        })

        console.log("fileHash : ",fileHash)

        var refDoctor   = req.body.refDoctor;
        var codeID      = req.body.codeID;
        var reportType  = req.body.reportType;
        var reportName  = req.body.reportName;
        var patientID   = req.body.patientID;
        var patientName = req.body.patientName;
        var reportData  = fileHash;
        var date        = req.body.date;
        var submitType  = req.body.submitType;


        // var date        = req.body.report_date;
        // var submitType  = req.body.submit_upload;
        // var refDoctor   = req.body.ref_doc_upload;
        // var codeID      = req.body.code_id_upload;
        // var reportType  = req.body.report_type;
        // var reportName  = req.body.report_name;
        
        // var patientID   = req.body.patientID;
        // var patientName = req.body.patientName;
        // var reportData  = fileHash;
        

        var args = [refDoctor, codeID, reportType, reportName, patientName, patientID,
                    reportData, submitType, date];
        
        var tID = invoke("addReport", args, res);
        
        
    })
    }catch(err){
        console.log(err)
        res.send({error : err})

    }
}


const fileAdd = async ( fileName, filePath ) => {

    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({path : filePath,content : file})
    console.log(fileAdded)
    const fileHash = fileAdded[0].hash;
    return fileHash

}


