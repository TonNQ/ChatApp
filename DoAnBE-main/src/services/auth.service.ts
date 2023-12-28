import { hash, compare } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRED, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRED, GMAIL_ACCOUNT, GMAIL_PASSWORD } from '@config';
import { Request, Response } from 'express';
import moment from 'moment';
import { LoginDTO } from '@/dtos/auth.dto';
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

class AuthService {
  private readonly users = userModel;

  constructor() {}

  createAccessToken = payload => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRED });
  };

  createRefreshToken = payload => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRED });
  };

  public async signup(userData: CreateUserDto): Promise<{ refresh_token: string; createUser: User; access_token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUser: User = await this.users.create({ ...userData, password: hashedPassword });

    const access_token = this.createAccessToken({ id: createUser._id });
    const refresh_token = this.createRefreshToken({ id: createUser._id });

    return { access_token, refresh_token, createUser };
  }

  public async login(userData: LoginDTO): Promise<{ refresh_token: string; findUser: User; access_token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const access_token = this.createAccessToken({ id: findUser._id });
    const refresh_token = this.createRefreshToken({ id: findUser._id });

    return { access_token, refresh_token, findUser };
  }

  public async generateAccessToken(req: Request, res: Response): Promise<string> {
    const { refresh_token } = req.body;
    if (!refresh_token) throw new HttpException(404, 'REFRESH_TOKEN missing');
    const payload = await jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
    if (!payload) throw new HttpException(403, 'Wrong REFRESH_TOKEN');
    const user = await this.users.findById(payload.id).select('-password');
    if (!user) throw new HttpException(409, 'This user is not exits');
    const access_token = this.createAccessToken({ id: user._id });
    return access_token;
  }

  public async sendMailResetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await this.users.findOne({ email });
    if (!user) throw new HttpException(409, `This email ${email} was not found`);
    const randomSlug = uuidv4();
    await this.users.findOneAndUpdate(
      { _id: user._id },
      { resetPasswordSlug: randomSlug, dateResetPasswordAllowed: moment(Date.now()).add(5, 'm').toDate() },
      { new: true },
    );
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_ACCOUNT,
        pass: GMAIL_PASSWORD,
      },
    });
    const content = `
          <div style="padding: 10px; background-color: #003375">
              <div style="padding: 10px; background-color: white;">
                  <h4 style="color: #0085ff">Đặt lại mật khẩu</h4>
                  <p>Click the link below to reset password</p>
                  <span style="color: black">http://localhost:3000/reset-password/${randomSlug}</span>
              </div>
          </div>
      `;
    var mainOptions = {
      from: 'Học Tiếng Anh' + '&lt;' + process.env.GMAIL_ACCOUNT + '&gt;',
      to: user.email,
      subject: 'Reset password',
      html: content,
    };
    return transporter.sendMail(mainOptions);
  }

  public async updatePassword(slug: string, newPassword: string) {
    console.log(slug);
    const user = await this.users.findOne({ resetPasswordSlug: slug });
    if (!user) throw new HttpException(409, "User doesn't exist");
    if (moment(Date.now()).isAfter(moment(user.dateResetPasswordAllowed.toString()))) throw new HttpException(409, 'The time is up!');
    const hashedPassword = await hash(newPassword, 10);
    await this.users.findByIdAndUpdate({ _id: user.id }, { password: hashedPassword }, { new: true });
  }
}

export default AuthService;
