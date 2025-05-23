import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { config } from '../config/env.config';
import { DeviceModel, PropertyModel, RoleModel, TokenModel, UserModel } from '../schemas';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from "express"
import axios from 'axios';
import { ZohoApi } from '../utils/zohoApi';
import { Model } from './model';
import { CheckPropertyUrl, UserType } from '../resources';
class UtilsClass {
  constructor() { }

  returnSchemaOption = () => {
    return {
      versionKey: false,
      timestamps: true,
    };
  };

  comparePassword = async (password: string, existingPassword: string) => {
    return await bcrypt.compare(password, existingPassword);
  };

  // getSignedJwtToken = (data: any) => {
  //     return jwt.sign({ id: data._id }, config.jwt.secret!, {
  //         expiresIn: config.jwt.expiresIn,
  //     });
  // };

  encryptPassword = async (password: any) => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
  };

  getSignedJwtToken = (payload: any, expiresIn: any) => {
    return jwt.sign(payload, config.jwt.secret!, {
      expiresIn,
    });
  };

  verifyToken = (payload: any) => {
    return jwt.verify(payload, config.jwt.secret!);
  };


  returnRegExp = (value: any) => {
    return {
      $regex: new RegExp(value, "i"),
    };
  };

  returnPhoneSchema = () => {
    return {
      countryCode: String,
      nationalNumber: String,
      is_verified: Boolean
    };
  }

  generateVerificationCode = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };

  // @ts-ignore
  generateToken = async (user: any, deviceId: any, res: Response) => {

    const tokens = await this.generateTokens({
      id: user._id,
      type: user.type,
      role: user.role,
      deviceId

    });
    // this.setCookies('refreshToken', tokens.refreshToken, config.cookie.oneDay, res);
    return { accessToken: tokens.accessToken, ... await this.checkProperty(user) }
  }

  generateTokens = async (payload: any) => {
    const accessToken = this.getSignedJwtToken(payload, config.jwt.expiresIn);
    const refreshToken = this.getSignedJwtToken(payload, config.jwt.refreshTexpiresIn);
    return { accessToken, refreshToken };
  };

  generateTokenAndMail = async (user: any, type: any) => {
    var set: string, expiry: any, template: any;


    if (type === "create-password" || type === "create") {
      expiry = config.jwt.oneDay;
      template = config.zeptoMail.template.create;
      set = "create-password";
      // login.loginLink = `${config.url.base}/en/admin/login`
    }
    else {
      expiry = config.jwt.fifteenMins;
      template = config.zeptoMail.template.forgot;
      set = "set-password";
    }
    const token = this.getSignedJwtToken({ id: user._id, type: set }, expiry);
    await TokenModel.deleteMany({ user: user.id, type })
    await TokenModel.create({ token, user: user.id, type })
    const url = `${config.url.base}/${globalThis.currentReq?.language}/admin/token-verify?token=${token}`;
    //send mail
    ZohoApi.sendMailTemplate(user.email, user.fullName, template, { product: "Otlesoft", link: url, name: user.fullName })

  }

  returnObjectId = (id: string) => {
    return new mongoose.Types.ObjectId(id)
  }

  newObjectId = () => {
    return new mongoose.Types.ObjectId()
  }

  createDevice = async (user: any, req: Request) => {


    let deviceId = uuidv4();
    (req as any).deviceId = deviceId;
    await DeviceModel.findOneAndUpdate({ deviceId }, {
      deviceId,
      user: user._id,
      ip: req.ip,
      keepMeSigned: req.cookies.keepMeSigned ?? false,
      userAgent: req.headers['user-agent'],
    }, { upsert: true, new: true })

    return deviceId;

  }

  setCookies = async (name: any, value: any, expiry: any, res: Response) => {
    res.cookie(name, value, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: expiry
    });

  }

  //   setCookies = async (name: any, value: any, expiry: any, res: Response) => {
  //   res.cookie(name, value, {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     maxAge: expiry
  //   });

  // }

  updateKeepsignToken = async (user: any, deviceId: any, res: Response) => {
    const device = await DeviceModel.findOne({ deviceId: deviceId });
    if (device) {
      const tokens = await this.generateTokens({
        id: user._id,
        type: user.type,
        role: user.role,
        deviceId
      });
      var cookieExpiry: any;
      if (device.keepMeSigned) cookieExpiry = config.cookie.oneDay
      else cookieExpiry = config.cookie.oneHour
      await this.setCookies('refreshToken', tokens.refreshToken, cookieExpiry, res);
    }

  }

  getGoogleAuth = async (token: any) => {
    const user = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return user.data;
  }

  checkProperty = async (user: any) => {

    var obj = {
      groupId: user.groupId
    };
    var redirectUrl = CheckPropertyUrl.PROPERTY, propertyId = null;
    if (user.type === "admin") {
      const property: any = await PropertyModel.find(obj)
      if (property.length === 1) {
        if (property[0].step === 6)
          redirectUrl = CheckPropertyUrl.DASHBOARD;
        else propertyId = property[0]._id;
      }
      else if (property.length === 0) {

        const property = await PropertyModel.create({ groupId: user.groupId, step: 1 });
        propertyId = property._id;
        await Model.findOneAndUpdate(UserModel, { _id: user.id }, { currentProperty: propertyId })
      }
      else redirectUrl = CheckPropertyUrl.DASHBOARD;
    }
    else redirectUrl = CheckPropertyUrl.DASHBOARD;
    return { redirectUrl, propertyId: propertyId };
  }

  lookupField = (from: string, local: string, foreign: string, result = "") => {
    return {
      $lookup: {
        from: from,
        localField: local,
        foreignField: foreign,

        as: result || local,
      },
    };
  }

  lookupSelectedField = (from: string, local: string, foreign: string, projection: any, result = "") => {
    return {
      $lookup: {
        from: from,
        localField: local,
        foreignField: foreign,
        pipeline: [
          {
            $project: {
              ...projection
            },
          },
        ],
        as: result || local,
      },
    };
  }

  unwind = (path: string) => {
    return {
      $unwind: {
        path: path,
        preserveNullAndEmptyArrays: true,
      },
    };
  };

  returnPageLimit = (query: any) => {
    let { page, limit }: any = query;
    page = Number(page) || 0;
    limit = Number(limit) || 10;
    // let page: any = (query.page ?? 1) - 1;
    // let limit: any = query.limit ?? 10;
    delete query.page;
    delete query.limit;
    return {
      page: page,
      limit: limit,
    };
  };

  removeCookie = async (name: any, res: Response) => {
    res.cookie(name, 'none', {
      expires: new Date(0),
      httpOnly: true,
    })
  }

  addPropertyId = async (data: any, req: Request) => {
    data.property = req.user.currentProperty;
  }

  initialRoleCreated = async (data: any) => {
    const groupId = data.groupId;
    const adminObj = { groupId, type: UserType.ADMIN, name: "Admin" }
    const houseObj = { groupId, type: UserType.HOUSEKEEPING, name: "House keeping" };
    var adminRole: any;
    adminRole = await this.RoleFind(adminObj);
    if (!adminRole)
      adminRole = await this.RoleCreate(adminObj)
    const houseRole = await this.RoleFind(houseObj);
    if (!houseRole)
      await this.RoleCreate(houseObj)
    data.role = adminRole._id;
  }

  RoleFind = (obj: any) => {
    return Model.findOne(RoleModel, obj)
  }

  RoleCreate = (obj: any) => {
    return RoleModel.create(obj)
  }

  addGroupId = async (query: any, req: any) => {
    query.groupId = req.user.groupId;
  }

  getPropertyId = async (query: any, req: Request) => {
    query.property = req.user.currentProperty;    
  }

  trimDataAndLower = (value: any) => {
    return value.trim().toLowerCase()
  }

}
export const Utils = new UtilsClass();
