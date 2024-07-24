import { useState } from 'react';
import { bytesToHexString } from './utils';

const BLE_SERVER_NAME = "TayFrame";
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export const useTayframe = (log: any): any => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dataCharacteristic, setDataCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>();

  const onDisconnected = () => {
    console.log("disconnected");
    setIsConnected(false);
  };

  const connect = async () => {
    setIsConnecting(true);
    navigator.bluetooth.requestDevice({
      filters: [{ name: BLE_SERVER_NAME }],
      optionalServices: [SERVICE_UUID],
    })
      .then(device => {
        device.addEventListener('gattserverdisconnected', onDisconnected);
        return device.gatt?.connect()
      })
      .then(server => server?.getPrimaryService(SERVICE_UUID))
      .then(service => service?.getCharacteristic(CHARACTERISTIC_UUID))
      .then(characteristic => {
        setIsConnecting(false);
        setIsConnected(true);
        setDataCharacteristic(characteristic)
      })
      .catch(error => {
        setIsConnecting(false);
        log(`${error}`)
        console.error(error);
      });
  };

  const write = async (data: any) => {
    console.assert(data.length > 3)
    console.log(`Writing data: hex: ${bytesToHexString(data.slice(0, 3))}, data: ${data.slice(3)}`);
    log(`Writing data: hex: ${bytesToHexString(data.slice(0, 3))}`);
    await dataCharacteristic?.writeValueWithResponse(
      new Uint8Array(data)
    );
    log('done');
  };

  return { isConnected, isConnecting, connect, write };
};
