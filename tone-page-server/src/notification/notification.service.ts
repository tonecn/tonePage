import { BadRequestException, Injectable } from '@nestjs/common';

import Dm20151123, * as $Dm20151123 from '@alicloud/dm20151123';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Client, * as $dm from "@alicloud/dm20151123";
import Util, * as $Util from '@alicloud/tea-util';
import Credential, { Config } from '@alicloud/credentials';

@Injectable()
export class NotificationService {

  private dm: Dm20151123;

  constructor() {
    const credentialsConfig = new Config({
      type: 'access_key',
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    });
    const credential = new Credential(credentialsConfig);
    const config = new $OpenApi.Config({ credential });
    config.endpoint = 'dm.aliyuncs.com';
    this.dm = new Dm20151123(config);
  }

  private getMailHtmlBody(option: { type: 'login-verify', code: string }) {
    if (option.type === 'login-verify') {
      return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>特恩的日志 - 登录验证码</title>
          <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0px auto; padding: 20px; }
              .content { padding: 20px 0; }
              .code-box { 
                  background: #f8f9fa; 
                  border: 1px dashed #ccc;
                  padding: 15px;
                  text-align: center;
                  margin: 20px 0;
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 5px;
                  color: #e74c3c;
              }
              .footer { 
                  color: #777; 
                  font-size: 12px; 
                  border-top: 1px solid #eee;
                  padding-top: 15px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <p>您好！您正在尝试登录【特恩的日志】控制台，验证码如下：</p>
                  
                  <div class="code-box">
                      <span id="verificationCode">${option.code}</span>
                  </div>
                  
                  <p>请注意：</p>
                  <ul>
                      <li>此验证码 <strong>10分钟内</strong> 有效</li>
                      <li>请勿向任何人透露此验证码</li>
                      <li>如非本人操作，请忽略本邮件</li>
                  </ul>
              </div>
              
              <div class="footer">
                  <p>© 2025 TONE（个人） 版权所有</p>
                  <a href="https://beian.miit.gov.cn/">网站备案号：渝ICP备2023009516号-1</a>
              </div>
          </div>
      </body>
      </html>`
    } else {
      throw new Error('未配置的模版');
    }
  }


  async sendMail(option: { type: 'login-verify', targetMail: string, code: string; }) {
    const runtime = new $Util.RuntimeOptions({});

    const singleSendMailRequest = new $Dm20151123.SingleSendMailRequest({
      accountName: "security@tonesc.cn",
      addressType: 1,
      replyToAddress: false,
      toAddress: `${option.targetMail}`,
      subject: "【特恩的日志】登陆验证码",
      htmlBody: this.getMailHtmlBody({ type: 'login-verify', code: option.code }),
      textBody: "",
    })

    try {
      await this.dm.singleSendMailWithOptions(singleSendMailRequest, runtime);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('邮件发送失败');
    }
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
