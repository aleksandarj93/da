import { NameValue } from "./name-value";


export class createJsonMode {
    dn: string;
    attributes: NameValue[] = new Array<NameValue>();
}

export class resultStatus{
    resultStatus: string;
    message: string;
    userDN: string;

    constructor (resultStatus: string, message?: string, userDN?: string) {
        this.resultStatus= resultStatus;
        this.message = message;
        this.userDN = userDN;
    }

    public static parseMessageResponse(obj: any): resultStatus {
        if (obj.resultStatus === 'SUCCESS') {
          return new resultStatus(obj.resultStatus, obj.userDN);
        }
        else
        {
          return new resultStatus(obj.resultStatus, obj.message);
        }
      }
}