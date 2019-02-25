import { Environment } from "./environments/environment";

export class AdobeAnalyticsService {
  public static setupAdobeAnalytics() {
    const scriptElement = document.createElement("script");
    if (String(Environment.production).toLowerCase() === String(true)) {
      scriptElement.src =
        "//assets.adobedtm.com/79073b1c53b56c91dd6b0c456743ebf482c22c56/satelliteLib-ec3f5361ddea8d684d666f767508560979c43f20.js";
    } else {
      scriptElement.src =
        "//assets.adobedtm.com/79073b1c53b56c91dd6b0c456743ebf482c22c56/satelliteLib-ec3f5361ddea8d684d666f767508560979c43f20-staging.js";
    }
    document.head.appendChild(scriptElement);
    scriptElement.onload = () => {
      (<any>window).digitalData = {
        page: {
          PageInfo: {
            customName: "thing-faceter",
            name: "thing-faceter"
          }
        }
      };
      (<any>window)._satellite.pageBottom();
    };
  }
}
