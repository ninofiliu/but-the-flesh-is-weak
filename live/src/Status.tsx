import React from "react";

export default ({
  supported,
  ports,
}: {
  supported: boolean;
  ports: SerialPort[];
}) => {
  const requestPort = async () => {
    if (!supported) return alert("Not supported");
    try {
      await navigator.serial.requestPort({
        filters: [{ usbVendorId: 0x2341 }],
      });
      alert("Port successfully added");
      history.go(0);
    } catch (e) {
      alert(
        `An error happened:\n${e}\nIf you don't understand that, open the console and call Nino.`
      );
    }
  };

  return (
    <>
      {!supported && (
        <p>
          Your browser does not support web serial. Please open this in Chrome
          (not Chromium). In the meantime, mock data will be displayed.
        </p>
      )}
      <p>{ports.length} ports connected</p>
      <p>
        <button onClick={requestPort}>Request port</button>
      </p>
    </>
  );
};
