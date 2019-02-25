import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { Environment } from "./environments/environment";


// Initialize environment variables
Environment.init(window["Environment"]);

export function getBaseUrl() {
  return document.getElementsByTagName("base")[0].href;
}

const providers = [{ provide: "BASE_URL", useFactory: getBaseUrl, deps: [] }];

if (Environment.production) {
  enableProdMode();
}



platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));