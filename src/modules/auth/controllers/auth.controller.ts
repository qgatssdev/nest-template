import { Body, Controller, Post } from "@nestjs/common";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { LoginRequestDto } from "../dto/login-request.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignUpDto } from "../dto/signup.dto";
import { AuthService } from "../services/auth.service";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async createUser(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post("login")
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.login(loginRequestDto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return await this.authService.forgotPassword(data);
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
