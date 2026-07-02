import { Module } from "@nestjs/common";
import { UserService } from "./user.service";

/**
 * UserModule handles user management services, database operations,
 * and business logic.
 */
@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
