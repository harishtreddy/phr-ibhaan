package main

import (
	"errors"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/google/uuid"
	"github.com/hyperledger/fabric/bccsp"
	"github.com/hyperledger/fabric/bccsp/factory"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/entities"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

//Constants definition
const MAINORG = "chips"
const IV = "IV"

//Check that request was initiated by the Main Org (Educhain)
func MainOrg(stub shim.ChaincodeStubInterface) (bool, error) {
	err := cid.AssertAttributeValue(stub, MAINORG, "true")
	if err != nil {
		return false, err
	}
	return true, nil
}

func GetUId() (string, error) {
	id, err := uuid.NewUUID()
    if err != nil {
        return "", err
    }
    return id.String(), err
}

// Encrypter exposes how to write state to the ledger after having
// encrypted it with an AES 256 bit key that has been provided to the chaincode through the
// transient field
func Encrypt(value, encKey, IV []byte) ([]byte, error) {
	// create the encrypter entity - we give it an ID, the bccsp instance, the key and (optionally) the IV
	var bccspInst bccsp.BCCSP
	bccspInst = factory.GetDefault()
	ent, err := entities.NewAES256EncrypterEntity(MAINORG, bccspInst, encKey, IV)
	if err != nil {
		return nil, err
	}
	fmt.Printf("Encrypt: %s \n",value)
	ciphertext, err := ent.Encrypt([]byte(value))
	if err != nil {
		return nil, err
	}
	// here, we encrypt cleartextValue and assign it to key
	return ciphertext, nil
}

func Decrypt(ciphertext []byte, decKey, IV []byte) ([]byte, error) {

	if len(ciphertext) == 0 {
		return nil, errors.New("no ciphertext to decrypt")
	}
	var bccspInst bccsp.BCCSP
	bccspInst = factory.GetDefault()
	ent, err := entities.NewAES256EncrypterEntity(MAINORG, bccspInst, decKey, IV)
	if err != nil {
		return nil, err
	}
	plaintext, err1 := ent.Decrypt(ciphertext)
	if err1 != nil {
		return nil, err
	}
	return plaintext, nil
}