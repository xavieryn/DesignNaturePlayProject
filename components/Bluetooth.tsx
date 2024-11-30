"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Define TypeScript interfaces for better type safety
interface BluetoothDevice extends globalThis.BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
  characteristic?: BluetoothRemoteGATTCharacteristic;
}

function Bluetooth() {
  const [connected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>();
  const [doorOpening, setDoorOpened] = useState(false);
  const connectToDevice = async () => {
    try {
      // ID needs to be lowercase for some reason
      const SERVICE_UUID = "19B10000-E8F2-537E-4F6C-D104768A1214".toLowerCase();
      const CHARACTERISTIC_UUID =
        "19B10001-E8F2-537E-4F6C-D104768A1214".toLowerCase();
      setIsConnecting(true);
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "Arduino" }, { services: [SERVICE_UUID] }],
      });

      console.log("Device selected:", device.name);

      if (!device.gatt) {
        throw new Error("Error :(, No GATT server found ");
      }

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(
        CHARACTERISTIC_UUID
      );
      setCharacteristic(characteristic);
      setDevice(device);
      setIsConnected(true);
      device.addEventListener("gattserverdisconnected", onDisconnected);
    } catch (err) {
      console.log("Connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const ChangeLightStatus = async () => {
    console.log("Trying to change light status");
    let data: Uint8Array;
    if (doorOpening) {
      data = new Uint8Array([0x00, 0x00, 0x00]);
      setDoorOpened(false);
    } else {
      data = new Uint8Array([0xff, 0xff, 0xff]);
      setDoorOpened(true);
    }
    await characteristic?.writeValueWithResponse(data);
  };

  const onDisconnected = () => {
    setIsConnected(false);
    setDevice(null);
  };

  const disconnectDevice = async () => {
    try {
      if (device?.gatt?.connected) {
        device.gatt.disconnect();
      }
      setIsConnected(false);
      setDevice(null);
    } catch (err) {
      console.log("Disconnect failed:", err);
    }
  };

  return (
    <div className="flex justify-center align-items-center text-center">
      {!connected ? (
        <div>
          <Button onClick={connectToDevice}>
            {isConnecting ? (
              <div>Connecting...</div>
            ) : (
              <div>Connect to Device</div>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          Connected to: {device?.name || "Unknown Device"}
          {/* <p>{characteristic?.uuid || "No Characteristic"}</p> */}
          <Button onClick={ChangeLightStatus}>
            {!doorOpening ? <div> Open Door </div> : <div>Door Opening</div>}
          </Button>
          <Button onClick={disconnectDevice}>Disconnect</Button>
        </div>
      )}
    </div>
  );
}

export default Bluetooth;
