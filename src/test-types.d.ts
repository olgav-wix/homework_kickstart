import { BootstrapServer } from '@wix/wix-bootstrap-testkit';
import { WixHttpTestkit } from '@wix/wix-http-testkit';

declare global {
  const app: BootstrapServer;
  const petri: any;   // Petri has no node platform typings :(
  const httpTestkit: WixHttpTestkit;
}

export {};
