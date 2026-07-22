declare module "react-qr-scanner" {
  import { Component, CSSProperties } from "react";

  export interface QrScannerProps {
    delay?: number | false;
    onError?: (error: any) => void;
    onScan?: (data: { text: string } | null | string) => void;
    facingMode?: "user" | "environment" | string;
    legacyMode?: boolean;
    style?: CSSProperties;
    className?: string;
    constraints?: MediaStreamConstraints;
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}
