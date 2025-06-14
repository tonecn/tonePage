import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  sendEmail(email: string, subject: string, content: string) {
    throw new Error(
      `Email sending is not implemented yet. Email: ${email}, Subject: ${subject}, Content: ${content}`,
    );
  }

  /**
   * @deprecated 短信签名暂未通过
   */
  async sendSMS(phone: string, type: 'login', code: string) {
    throw new Error(
      `SMS sending is not implemented yet. Phone: ${phone}, Type: ${type}, Code: ${code}`,
    );
    // const config = new $OpenApi.Config({
    //     accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    //     accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    // })
    // config.endpoint = 'dysmsapi.aliyuncs.com';
    // const client = new Client(config);
    // const request = new $dysmsapi.SendSmsRequest({});
    // request.phoneNumbers = phone;
    // request.signName = (() => {
    //     switch (type) {
    //         case 'login':
    //             return process.env.ALIYUN_SMS_LOGIN_SIGN_NAME;
    //         default:
    //             throw new Error('Unknown SMS type');
    //     }
    // })();
    // request.templateCode = code;
    // await client.sendSms(request).then(a => {
    //     console.log(a)
    // }).catch(err => {
    //     console.error(err);
    // })
  }
}
