import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import NodeRSA from 'node-rsa';
import QuickEncrypt from 'quick-encrypt'

import { useForm } from '../../hooks/useForm';

import '../../index.css'

export const ChatPage = ({socket}) => {
    
    const [values, handleInputChange, ] = useForm({ message: '' });
    const {message} = values;

    const encryptData = (data, key) =>
        new Promise((resolve, reject) => {
            try {
                const encrypted = QuickEncrypt.encrypt(data, "-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAgXo+UjWayozJoO5WSQ5D2GJjOsOfdqcaZKJ1twsRUgIX3l1MSBmvSEr8BBjh\nhUGJDElCJgwV1XM/N+7vImGoEx9ekRmUt1hvYbd6YyVnQWVeUfqH6AJ3Tp4B3XT02GMmLisp\n4vYoObYcJhAzy1vhF7OVNxktwASIcxtN7ogJNHgChr0VKZlvrzLFm+aGCTRAIVI2718mgtRO\nkntpcCTcKCXB6fkcFcHLxtAED80vAOUco1hpfpv3JbCLGS6L0ICpZjhHCj8snELtXa2FpE3h\nGB9nvu1mNnkuTPUY0g3Mu1DS2uYYH+fG9UdaaWcNGjvGUpfhrcVBtD/2ZeR9z9RFNQIDAQAB\n-----END RSA PUBLIC KEY-----\n")
                resolve(encrypted)
            } catch (error) {
                reject(error)
            }
	})

    const encryptMessage = async(msg) => {
        const pubkey = localStorage.getItem('zpub');
        const mypub = localStorage.getItem('mypub');
        const myprv = localStorage.getItem('myprv');
        // console.log('pubkey OG', pubkey);
        if(pubkey && typeof(pubkey)=='string'){
            // const test = await encryptData(msg, pubkey)
            // console.log(test);
            const key = new NodeRSA();
            key.importKey(mypub, 'pkcs1-public-pem');
            const encrypted3 = key.encrypt(msg,'base64');
            console.log('encrypted message', encrypted3);

            const prvk = new NodeRSA();
            prvk.importKey(myprv, 'pkcs1-private-pem');
            console.log('decrypted message', prvk.decrypt(encrypted3, 'utf8'));
            // const encrypted = QuickEncrypt.encrypt(msg, pubkey)
            // console.log('encrypted message', encrypted);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault()
        if (message.length&&message!==' ') {
            // socket.emit('chat message', message);
            // reset()
            encryptMessage(message)
        }
    }

    return (
        <>
            <form id="form" className="m-3">
                <div style={{display:'flex'}}>
                    <input 
                        value={message} name="message" 
                        autoComplete="off" onChange={handleInputChange}
                        className="form-control"
                    />
                    <button className="btn btn-success bts" onClick={sendMessage} > <FontAwesomeIcon icon={faShare} /> </button>
                </div>
            </form>
        </>

    )
}