import { selectParams } from '../utils/selectParams.util';
import { Document, FilterQuery, Model } from 'mongoose';
import {
  generateAccessToken,
  generateVerifyToken,
  verifyVerificationToken,
} from './jwtService.service';
import { IBaseInterface, ILoginInterface } from '../types/identityTypes.type';
import { sendEmail } from './mailService.service';
import { compare } from 'bcryptjs';
import generatePassword from '../utils/passwordGenerator';
import hashField from '../utils/hashField.util';

export const getByIdService = async <ModelInterface>(
  id: string,
  model: Model<ModelInterface>,
  params?: string,
  populateParams?: string
): Promise<ModelInterface | null> => {
  try {
    const query = model.findById(id).select(selectParams(params));

    if (populateParams) {
      query.populate(populateParams);
    }

    return await query;
  } catch (error) {
    throw error;
  }
};

export const getByFieldService = async <ModelInterface extends Document>(
  field: string,
  value: string,
  model: Model<ModelInterface>,
  params?: string
): Promise<ModelInterface | null> => {
  try {
    const query: FilterQuery<ModelInterface> = {
      [field]: value,
    } as FilterQuery<ModelInterface>;

    return await model.findOne(query).select(selectParams(params));
  } catch (error) {
    throw error;
  }
};

export const getAllService = async <ModelInterface extends Document>(
  model: Model<ModelInterface>,
  params?: string
): Promise<ModelInterface[]> => {
  return await model.find().select(selectParams(params));
};

export const loginService = async <
  ModelInterface extends IBaseInterface & Document,
>(
  model: Model<ModelInterface>,
  body: ILoginInterface,
  serviceFor: string,
  checkPassword?: boolean
): Promise<string> => {
  const { email, password } = body;
  const foundModel = await getByFieldService('email', email, model);

  if (!foundModel) {
    throw `${serviceFor.charAt(0).toUpperCase() + serviceFor.slice(1)} not found with this email`;
  } else if (!foundModel.verified) {
    throw `${serviceFor.charAt(0).toUpperCase() + serviceFor.slice(1)} not verified. Check email for verification link or send another one`;
  }

  if (checkPassword && !foundModel.changedPassword) {
    throw 'You need to set password first after verification';
  }

  const comparedPassword = await compare(password, foundModel.password);

  if (!comparedPassword) {
    throw 'Password is incorrect. Please try again';
  }

  return generateAccessToken(foundModel._id as string);
};

export const verificationService = async <
  ModelInterface extends IBaseInterface & Document,
>(
  model: Model<ModelInterface>,
  token: string,
  serviceFor: string,
  sendPassword?: boolean
): Promise<ModelInterface | null> => {
  const id = verifyVerificationToken(token);
  const foundModel = await getByIdService(id, model, '-password');

  if (!foundModel) {
    throw `${serviceFor.charAt(0).toUpperCase() + serviceFor.slice(1)} not found`;
  } else if (foundModel.verified) {
    throw `${serviceFor.charAt(0).toUpperCase() + serviceFor.slice(1)} already verified`;
  }

  if (sendPassword) {
    const generatedPassword = generatePassword();
    const hashedPassword = await hashField(generatedPassword, 10);
    sendEmail(foundModel.email, {
      subject: 'One time password',
      text: `This is your one time password for login: ${generatedPassword}`,
    }).catch((error) => {
      throw new Error(error);
    });
    foundModel.password = hashedPassword;
  }

  foundModel.verified = true;
  foundModel.sentAt = new Date();
  await foundModel.save();

  return foundModel;
};

export const verifyAgainService = async <
  ModelInterface extends IBaseInterface & Document,
>(
  model: Model<ModelInterface>,
  email: string,
  verificationFor: string
): Promise<string> => {
  const foundModel = await getByFieldService('email', email, model);

  if (!email) {
    throw 'Please provide an email address';
  } else if (!foundModel) {
    throw `${verificationFor.charAt(0).toUpperCase() + verificationFor.slice(1)} not found`;
  } else if (foundModel.verified) {
    throw `${verificationFor.charAt(0).toUpperCase() + verificationFor.slice(1)} already verified`;
  }

  const providedTimeString = foundModel.sentAt;
  const providedTime = new Date(providedTimeString);

  const currentTime = new Date();
  const timeDifferenceInMinutes =
    (currentTime.getTime() - providedTime.getTime()) / (1000 * 60);

  if (timeDifferenceInMinutes < 15) {
    throw 'Please wait 15 minutes before sending again. Verification email already sent and is accessible for 15 minutes';
  }

  const token = generateVerifyToken(foundModel.id);
  sendEmail(foundModel.email, {
    subject: 'Account Activation',
    text: `Verification link was sent again. Click on the link to activate your account: ${process.env.API_URL}/${verificationFor}/verify/${token}`,
  }).catch((error) => {
    throw new Error(error);
  });
  foundModel.sentAt = new Date();
  await foundModel.save();

  return token;
};

export const setPasswordService = async <
  ModelInterface extends IBaseInterface & Document,
>(
  model: Model<ModelInterface>,
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const foundModel = await getByFieldService('email', email, model);

  if (!foundModel) {
    throw 'Wrong email. Please try again';
  } else if (foundModel.changedPassword) {
    throw 'Password already set. Please log in instead';
  }

  const checkPassword = await compare(oldPassword, foundModel.password);

  if (!checkPassword) {
    throw 'Old password is incorrect. Please enter the password you received at email for one time log in to set a new one';
  }

  foundModel.password = await hashField(newPassword, 10);
  foundModel.changedPassword = true;
  await foundModel.save();
};
