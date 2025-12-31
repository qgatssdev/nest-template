import {
  Body,
  Controller,
  UseGuards,
  Patch,
  Get,
  Put,
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CurrentUser } from "src/libs/common/decorators/current-user.decorator";
import { User } from "../entity/user.entity";
import { AuthGuard } from "src/libs/common/guards/auth.guard";
import { UpdateUserDto } from "../dto/update-user-dto";
import { BaseResponse } from "src/libs/core/base/base.response";
import { ChangePasswordDto } from "../dto/change-password.dto";

@Controller({
  path: "user",
  version: "1",
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get("")
  async getAuthenticatedUser(@CurrentUser() user: User) {
    return await this.userService.getAuthenticatedUser(user);
  }

  @UseGuards(AuthGuard)
  @Patch("")
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<Partial<User>>> {
    const data = await this.userService.updateUser(updateUserDto, user);
    return BaseResponse.successResponse(data, "User updated successfully");
  }

  @UseGuards(AuthGuard)
  @Put("change-password")
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.changePassword(changePasswordDto, user);
  }
}
